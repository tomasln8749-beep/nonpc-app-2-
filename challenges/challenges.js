const COMMUNITY_USER_STORAGE_KEY = "community_username";
const CHALLENGES_STORAGE_KEY = "challenges";
const ACTIVE_MISSIONS_STORAGE_KEY = "active_missions";
const USER_XP_STORAGE_KEY = "user_xp_map";
const XP_STORAGE_KEY = "nonpc-xp";
const CHALLENGE_EXPIRY_MS = 24 * 60 * 60 * 1000;
const CHALLENGE_PENALTY_XP = 20;
const WARNING_THRESHOLD_MS = 6 * 60 * 60 * 1000;

const challengeUsernameInput = document.getElementById("challengeUsernameInput");
const challengeStatus = document.getElementById("challengeStatus");
const incomingChallenges = document.getElementById("incomingChallenges");
const incomingEmpty = document.getElementById("incomingEmpty");
const incomingCount = document.getElementById("incomingCount");
const activeMissionsList = document.getElementById("activeMissionsList");
const activeMissionsEmpty = document.getElementById("activeMissionsEmpty");
const activeMissionsCount = document.getElementById("activeMissionsCount");

let challenges = loadChallenges();
let toastTimeout = null;

function ensureToast() {
  let toast = document.getElementById("socialToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "socialToast";
    toast.className = "social-toast";
    document.body.appendChild(toast);
  }

  return toast;
}

function showToast(message) {
  const toast = ensureToast();
  toast.textContent = message;
  toast.classList.add("show");

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function loadChallenges() {
  try {
    const stored = JSON.parse(localStorage.getItem(CHALLENGES_STORAGE_KEY)) || [];
    return Array.isArray(stored) ? stored : [];
  } catch (error) {
    return [];
  }
}

function saveChallenges() {
  localStorage.setItem(CHALLENGES_STORAGE_KEY, JSON.stringify(challenges));
}

function loadActiveMissions() {
  try {
    const stored = JSON.parse(localStorage.getItem(ACTIVE_MISSIONS_STORAGE_KEY)) || {};
    return stored && typeof stored === "object" ? stored : {};
  } catch (error) {
    return {};
  }
}

function saveActiveMissions(activeMissions) {
  localStorage.setItem(ACTIVE_MISSIONS_STORAGE_KEY, JSON.stringify(activeMissions));
}

function loadUserXpMap() {
  try {
    const stored = JSON.parse(localStorage.getItem(USER_XP_STORAGE_KEY)) || {};
    return stored && typeof stored === "object" ? stored : {};
  } catch (error) {
    return {};
  }
}

function saveUserXpMap(map) {
  localStorage.setItem(USER_XP_STORAGE_KEY, JSON.stringify(map));
}

function getCurrentUsername() {
  return challengeUsernameInput.value.trim();
}

function persistUsername() {
  const username = getCurrentUsername();
  if (username) {
    localStorage.setItem(COMMUNITY_USER_STORAGE_KEY, username);
  }
}

function formatDate(value) {
  try {
    return new Date(value).toLocaleString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch (error) {
    return "";
  }
}

function setUserXp(username, value) {
  const nextXp = Math.max(0, Number(value) || 0);
  const map = loadUserXpMap();
  map[username] = nextXp;
  saveUserXpMap(map);

  if (username === getCurrentUsername()) {
    localStorage.setItem(XP_STORAGE_KEY, String(nextXp));
  }
}

function applyExpiredChallengePenalties() {
  const now = Date.now();
  const currentUsername = getCurrentUsername() || localStorage.getItem(COMMUNITY_USER_STORAGE_KEY) || "";
  let changed = false;
  let penalizedCurrentUser = 0;

  challenges.forEach((challenge) => {
    if (challenge.status !== "pending" || challenge.penaltyApplied) {
      return;
    }

    const expiresAt = new Date(challenge.expiresAt || 0).getTime();
    if (!expiresAt || now <= expiresAt) {
      return;
    }

    const xpMap = loadUserXpMap();
    const currentXp = Number(xpMap[challenge.toUserId]) || 0;
    const nextXp = Math.max(0, currentXp - CHALLENGE_PENALTY_XP);

    challenge.status = "failed";
    challenge.penaltyApplied = true;
    challenge.expiredAt = new Date(now).toISOString();
    setUserXp(challenge.toUserId, nextXp);
    changed = true;

    if (challenge.toUserId === currentUsername) {
      penalizedCurrentUser += 1;
    }
  });

  if (changed) {
    saveChallenges();
  }

  if (penalizedCurrentUser > 0) {
    showToast(`No respondiste el desafio a tiempo (-${CHALLENGE_PENALTY_XP} XP)`);
  }
}

function formatTimeLeft(expiresAt) {
  const remainingMs = new Date(expiresAt).getTime() - Date.now();
  if (remainingMs <= 0) {
    return "Expiro";
  }

  const totalHours = Math.ceil(remainingMs / 3600000);
  if (totalHours >= 24) {
    return "Quedan 24 horas";
  }

  if (totalHours <= 1) {
    return "Queda menos de 1 hora";
  }

  return `Quedan ${totalHours} horas`;
}

function getChallengeStatusLabel(challenge) {
  if (challenge.status === "accepted") {
    return { text: "Aceptado", className: "badge badge-success" };
  }

  if (challenge.status === "failed" && challenge.penaltyApplied) {
    return { text: "Expirado", className: "badge badge-danger" };
  }

  if (challenge.status === "failed") {
    return { text: "Rechazado", className: "badge badge-warning" };
  }

  return { text: "Pendiente", className: "badge badge-primary" };
}

function createChallengeCard(challenge) {
  const card = document.createElement("article");
  card.className = "idea-card";

  const title = document.createElement("h3");
  title.textContent = challenge.missionTitle || "Mision";

  const meta = document.createElement("div");
  meta.className = "idea-meta";
  meta.textContent = `de ${challenge.fromUserId} - ${formatDate(challenge.createdAt)}`;

  const statusConfig = getChallengeStatusLabel(challenge);
  const status = document.createElement("div");
  status.className = statusConfig.className;
  status.textContent = statusConfig.text;

  const top = document.createElement("div");
  top.className = "idea-top";
  top.append(title, status);

  const extra = document.createElement("div");
  extra.className = "helper-text";

  if (challenge.status === "pending") {
    extra.textContent = `Expira: ${formatDate(challenge.expiresAt)}. ${formatTimeLeft(challenge.expiresAt)}.`;
    if (new Date(challenge.expiresAt).getTime() - Date.now() <= WARNING_THRESHOLD_MS) {
      extra.textContent += " Te quedan pocas horas para aceptarlo.";
    }
  } else if (challenge.status === "failed" && challenge.penaltyApplied) {
    extra.textContent = `No respondiste el desafio a tiempo (-${CHALLENGE_PENALTY_XP} XP).`;
  } else if (challenge.status === "failed") {
    extra.textContent = "Desafio rechazado por el usuario.";
  } else {
    extra.textContent = `Aceptado el ${formatDate(challenge.updatedAt || challenge.createdAt)}.`;
  }

  card.append(top, meta, extra);

  if (challenge.status !== "pending") {
    return card;
  }

  const actions = document.createElement("div");
  actions.className = "idea-actions";

  const acceptButton = document.createElement("button");
  acceptButton.className = "btn btn-primary btn-small";
  acceptButton.type = "button";
  acceptButton.textContent = "Aceptar";

  const rejectButton = document.createElement("button");
  rejectButton.className = "btn btn-ghost btn-small";
  rejectButton.type = "button";
  rejectButton.textContent = "Rechazar";

  acceptButton.addEventListener("click", () => {
    const activeMissions = loadActiveMissions();
    const username = getCurrentUsername();
    const userMissions = Array.isArray(activeMissions[username]) ? activeMissions[username] : [];

    if (!userMissions.some((mission) => mission.challengeId === challenge.id)) {
      userMissions.unshift({
        challengeId: challenge.id,
        missionId: challenge.missionId,
        missionTitle: challenge.missionTitle,
        fromUserId: challenge.fromUserId,
        addedAt: new Date().toISOString(),
        status: "active"
      });
    }

    activeMissions[username] = userMissions;
    saveActiveMissions(activeMissions);

    challenge.status = "accepted";
    challenge.updatedAt = new Date().toISOString();
    saveChallenges();
    renderChallenges();
  });

  rejectButton.addEventListener("click", () => {
    challenge.status = "failed";
    challenge.penaltyApplied = false;
    challenge.updatedAt = new Date().toISOString();
    saveChallenges();
    renderChallenges();
  });

  actions.append(acceptButton, rejectButton);
  card.append(actions);
  return card;
}

function createActiveMissionCard(mission) {
  const card = document.createElement("article");
  card.className = "idea-card";

  const title = document.createElement("h3");
  title.textContent = mission.missionTitle;

  const meta = document.createElement("div");
  meta.className = "idea-meta";
  meta.textContent = `desafio de ${mission.fromUserId} - ${formatDate(mission.addedAt)}`;

  const status = document.createElement("div");
  status.className = "badge badge-success";
  status.textContent = "Activa";

  const top = document.createElement("div");
  top.className = "idea-top";
  top.append(title, status);

  card.append(top, meta);
  return card;
}

function renderChallenges() {
  applyExpiredChallengePenalties();

  const username = getCurrentUsername();
  if (!username) {
    incomingChallenges.innerHTML = "";
    activeMissionsList.innerHTML = "";
    incomingEmpty.classList.remove("is-hidden");
    activeMissionsEmpty.classList.remove("is-hidden");
    incomingCount.textContent = "0 pendientes";
    activeMissionsCount.textContent = "0 activas";
    challengeStatus.textContent = "Escribe tu usuario para ver desafios.";
    return;
  }

  const receivedChallenges = challenges
    .filter((challenge) => challenge.toUserId === username)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const pendingChallenges = receivedChallenges.filter((challenge) => challenge.status === "pending");
  const urgentChallenge = pendingChallenges
    .slice()
    .sort((a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime())[0];

  challengeStatus.textContent = urgentChallenge
    ? `Mostrando desafios para ${username}. ${formatTimeLeft(urgentChallenge.expiresAt)} para responder el mas urgente.`
    : `Mostrando desafios para ${username}.`;

  incomingChallenges.innerHTML = "";
  incomingCount.textContent = `${pendingChallenges.length} pendientes`;

  if (receivedChallenges.length === 0) {
    incomingEmpty.classList.remove("is-hidden");
  } else {
    incomingEmpty.classList.add("is-hidden");
    receivedChallenges.forEach((challenge) => {
      incomingChallenges.appendChild(createChallengeCard(challenge));
    });
  }

  const activeMissions = loadActiveMissions();
  const userActiveMissions = Array.isArray(activeMissions[username]) ? activeMissions[username] : [];
  activeMissionsList.innerHTML = "";
  activeMissionsCount.textContent = `${userActiveMissions.length} activas`;

  if (userActiveMissions.length === 0) {
    activeMissionsEmpty.classList.remove("is-hidden");
  } else {
    activeMissionsEmpty.classList.add("is-hidden");
    userActiveMissions.forEach((mission) => {
      activeMissionsList.appendChild(createActiveMissionCard(mission));
    });
  }
}

function bootstrapChallenges() {
  const savedUsername = localStorage.getItem(COMMUNITY_USER_STORAGE_KEY);
  if (savedUsername) {
    challengeUsernameInput.value = savedUsername;
  }

  ensureToast();
  renderChallenges();
  challengeUsernameInput.addEventListener("change", () => {
    persistUsername();
    renderChallenges();
  });
}

bootstrapChallenges();
