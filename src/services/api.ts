import {
  ApiQuestion,
  QuestionsApiResponse,
  StartSessionApiResponse,
  AnswerSubmission,
  CompleteSessionData,
  CompleteSessionApiResponse,
} from '../types';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://learning-platform-1euu.onrender.com';
const BASE_URL = `${API_URL}/api/v1`;
const GAME_ID = 12;

let latestToken: string | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    let refreshRes = await fetch(`${BASE_URL}/student/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: "{}"
    });

    if (!refreshRes.ok) {
      refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: "{}"
      });
    }

    if (refreshRes.ok) {
      const refreshData = await refreshRes.json();
      const newToken = refreshData?.data?.accessToken || refreshData?.data?.token || refreshData?.accessToken || refreshData?.token;
      if (newToken) {
        console.log("Token refreshed successfully.");
        latestToken = newToken;

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('token')) urlParams.set('token', newToken);
        if (urlParams.has('accesstoken')) urlParams.set('accesstoken', newToken);
        const newUrl = window.location.pathname + '?' + urlParams.toString();
        window.history.replaceState(null, '', newUrl);

        return newToken;
      }
    } else {
      console.error("Token refresh failed on both endpoints with status", refreshRes.status);
    }
  } catch (err) {
    console.error("Error during token refresh", err);
  }
  return null;
};

const apiFetch = async (url: string, options: RequestInit = {}, initialToken: string | null = null) => {
  if (!latestToken && initialToken) {
    latestToken = initialToken;
  }
  if (!latestToken && !initialToken) {
    await refreshAccessToken();
  }

  const currentToken = latestToken || initialToken;
  const fetchOptions = { ...options };
  if (currentToken) {
    fetchOptions.headers = { ...(fetchOptions.headers || {}), Authorization: `Bearer ${currentToken}` };
  }

  let res = await fetch(url, fetchOptions);

  if (res.status === 401) {
    console.warn("401 Unauthorized encountered. Attempting to refresh token...");
    const newToken = await refreshAccessToken();
    if (newToken) {
      fetchOptions.headers = { ...(fetchOptions.headers || {}), Authorization: `Bearer ${newToken}` };
      res = await fetch(url, fetchOptions);
    }
  }
  
  return res;
};

export async function fetchQuestions(token: string, lessonId: string): Promise<ApiQuestion[]> {
  const response = await apiFetch(`${BASE_URL}/student/games/${GAME_ID}/questions?lessonId=${encodeURIComponent(lessonId)}`, {
    method: 'GET',
  }, token);

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
  const response = await apiFetch(`${BASE_URL}/student/games/${GAME_ID}/sessions?lessonId=${encodeURIComponent(lessonId)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }, token);

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

  const response = await apiFetch(`${BASE_URL}/student/games/sessions/${sessionId}/submit-answers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyData),
  }, token);

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

  const response = await apiFetch(`${BASE_URL}/student/games/sessions/${sessionId}/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }, token);

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
