import {
  ApiQuestion,
  QuestionsApiResponse,
  StartSessionApiResponse,
  AnswerSubmission,
  CompleteSessionData,
  CompleteSessionApiResponse,
} from '../types';

const BASE_URL = 'https://learning-platform-1euu.onrender.com/api/v1/student';
const GAME_ID = 12;

export async function fetchQuestions(token: string, lessonId: string): Promise<ApiQuestion[]> {
  const response = await fetch(`${BASE_URL}/games/${GAME_ID}/questions?lessonId=${encodeURIComponent(lessonId)}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`فشل في جلب الأسئلة (${response.status}): ${errText || response.statusText}`);
  }

  const json: QuestionsApiResponse = await response.json();
  if (!json.success || !json.data || !json.data.questions) {
    throw new Error('استجابة خادم الأسئلة غير صالحة');
  }

  return json.data.questions;
}

export async function startSession(token: string, lessonId: string): Promise<string> {
  const response = await fetch(`${BASE_URL}/games/${GAME_ID}/sessions?lessonId=${encodeURIComponent(lessonId)}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`فشل في بدء الجلسة (${response.status}): ${errText || response.statusText}`);
  }

  const json: StartSessionApiResponse = await response.json();
  if (!json.success || !json.data || !json.data.id) {
    throw new Error('فشل الحصول على معرف الجلسة من الخادم');
  }

  return json.data.id;
}

export async function submitAnswers(
  token: string,
  sessionId: string,
  answers: AnswerSubmission[]
): Promise<boolean> {
  if (!sessionId) {
    throw new Error('معرف الجلسة مفقود');
  }

  // Sanitize and format answers array
  const formattedAnswers: AnswerSubmission[] = answers.map((ans) => ({
    questionId: Number(ans.questionId),
    selectedAnswer: String(ans.selectedAnswer || ''),
    timeTaken: Number(ans.timeTaken) || 1,
  }));

  // Ensure answers array contains at least 1 item as required by backend validation
  const payload = formattedAnswers.length > 0 ? formattedAnswers : [
    {
      questionId: 1,
      selectedAnswer: '',
      timeTaken: 1,
    }
  ];

  const bodyData = {
    answers: payload,
  };

  const response = await fetch(`${BASE_URL}/games/sessions/${sessionId}/submit-answers`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyData),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`فشل إرسال الإجابات (${response.status}): ${errText || response.statusText}`);
  }

  return true;
}

export async function completeSession(token: string, sessionId: string): Promise<CompleteSessionData> {
  if (!sessionId) {
    throw new Error('معرف الجلسة مفقود');
  }

  const response = await fetch(`${BASE_URL}/games/sessions/${sessionId}/complete`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`فشل إكمال الجلسة (${response.status}): ${errText || response.statusText}`);
  }

  const json: CompleteSessionApiResponse = await response.json();
  if (!json.success || !json.data) {
    throw new Error('فشل استلام ملخص النتيجة من الخادم');
  }

  return json.data;
}
