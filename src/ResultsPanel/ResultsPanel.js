import './ResultsPanel.css';
import panelFrame from './assets/banal.png';
import celebrationTitle from './assets/good.png';
import coinsImage from './assets/money.png';
import correctImage from './assets/right.png';
import wrongImage from './assets/wrong.png';
import buttonFrame from './assets/boutton.png';
import exitIconUrl from '../assets/ExitButton.svg';
import retryIconUrl from '../assets/retry.png';

const numberValue = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, Math.round(parsed)) : 0;
};

export class ResultsPanel {
  constructor(root, options = {}) {
    this.root = root;
    this.onRetry = options.onRetry;
    this.onBack = options.onBack;
    this.#build();
  }

  #build() {
    this.el = document.createElement("div");
    this.el.className = "results-overlay";

    const screen = document.createElement("section");
    screen.className = "results-screen";
    screen.setAttribute("aria-label", "نتائج اللعبة");
    screen.dir = "rtl";

    const panel = document.createElement("div");
    panel.className = "results-panel";
    panel.style.setProperty("--results-panel-image", `url(${panelFrame})`);

    const content = document.createElement("div");
    content.className = "results-panel__content";

    this.titleImg = document.createElement("img");
    this.titleImg.className = "results-panel__title";
    this.titleImg.src = celebrationTitle;
    this.titleImg.alt = "أحسنت";

    this.titleFail = document.createElement("div");
    this.titleFail.className = "results-panel__fail-title";
    this.titleFail.textContent = "حاول مرة أخرى!";
    this.titleFail.style.display = "none";

    const stats = document.createElement("div");
    stats.className = "results-stats";
    stats.setAttribute("aria-label", "إحصاءات الأداء");

    const correctCard = document.createElement("div");
    correctCard.className = "results-stat-card results-stat-card--correct";
    const correctImg = document.createElement("img");
    correctImg.src = correctImage;
    correctImg.alt = "إجابات صحيحة";
    this.correctText = document.createElement("strong");
    correctCard.append(correctImg, this.correctText);

    const coinsCard = document.createElement("div");
    coinsCard.className = "results-stat-card results-stat-card--coins";
    const coinsImg = document.createElement("img");
    coinsImg.src = coinsImage;
    coinsImg.alt = "عملات مكتسبة";
    this.coinsText = document.createElement("strong");
    const coinsLabel = document.createElement("span");
    coinsLabel.textContent = "فِلُوس";
    coinsCard.append(coinsImg, this.coinsText, coinsLabel);

    const wrongCard = document.createElement("div");
    wrongCard.className = "results-stat-card results-stat-card--wrong";
    const wrongImg = document.createElement("img");
    wrongImg.src = wrongImage;
    wrongImg.alt = "إجابات خاطئة";
    this.wrongText = document.createElement("strong");
    wrongCard.append(wrongImg, this.wrongText);

    stats.append(correctCard, coinsCard, wrongCard);
    content.append(this.titleImg, this.titleFail, stats);
    panel.append(content);

    const actions = document.createElement("div");
    actions.className = "results-actions";

    // Right button (First in RTL DOM) -> Retry
    const retryBtn = document.createElement("button");
    retryBtn.className = "results-action results-action--retry";
    retryBtn.type = "button";
    retryBtn.onclick = () => { if (this.onRetry) this.onRetry(); };
    const retryBtnImg = document.createElement("img");
    retryBtnImg.className = "results-action__bg";
    retryBtnImg.src = buttonFrame;
    retryBtnImg.alt = "";
    retryBtnImg.setAttribute("aria-hidden", "true");
    
    const retryGrp = document.createElement("span");
    retryGrp.className = "results-action__group";
    const retryTxt = document.createElement("span");
    retryTxt.className = "results-action__text";
    retryTxt.textContent = "ثانِيَةً";
    const retryIcon = document.createElement("img");
    retryIcon.className = "results-action__icon";
    retryIcon.src = retryIconUrl;
    retryIcon.alt = "Retry";
    retryGrp.append(retryTxt, retryIcon);
    retryBtn.append(retryBtnImg, retryGrp);

    // Left button (Second in RTL DOM) -> Exit
    const backBtn = document.createElement("button");
    backBtn.className = "results-action results-action--back";
    backBtn.type = "button";
    backBtn.onclick = () => {
      if (this.onBack) {
        this.onBack();
      } else {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.href = '/'; 
        }
      }
    };
    const backBtnImg = document.createElement("img");
    backBtnImg.className = "results-action__bg";
    backBtnImg.src = buttonFrame;
    backBtnImg.alt = "";
    backBtnImg.setAttribute("aria-hidden", "true");
    
    const backGrp = document.createElement("span");
    backGrp.className = "results-action__group";
    const backTxt = document.createElement("span");
    backTxt.className = "results-action__text";
    backTxt.textContent = "اخرج";
    const backIcon = document.createElement("img");
    backIcon.className = "results-action__icon";
    backIcon.src = exitIconUrl;
    backIcon.alt = "Exit";
    backGrp.append(backTxt, backIcon);
    backBtn.append(backBtnImg, backGrp);

    actions.append(backBtn, retryBtn);
    screen.append(panel, actions);
    this.el.append(screen);
  }

  show(data = {}) {
    const correct = numberValue(data.correctAnswers);
    const wrong = numberValue(data.wrongAnswers);
    const earnedCoins = numberValue(data.coins);

    this.correctText.textContent = correct;
    this.wrongText.textContent = wrong;
    this.coinsText.textContent = `+${earnedCoins}`;

    const percentage = (correct + wrong) > 0 ? (correct / (correct + wrong)) * 100 : 0;
    if (percentage < 50) {
      this.titleImg.style.display = 'none';
      this.titleFail.style.display = 'block';
    } else {
      this.titleImg.style.display = 'block';
      this.titleFail.style.display = 'none';
    }

    this.root.appendChild(this.el);
  }

  hide() {
    this.el.remove();
  }
}
