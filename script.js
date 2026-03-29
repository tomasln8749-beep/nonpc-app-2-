const faciles = [
  { texto: "Escuchar una cancion sin tocar el celular", xp: 5 },
  { texto: "Ordenar solo una parte de tu pieza", xp: 5 },
  { texto: "Tomar agua y no mirar pantallas por 10 minutos", xp: 5 },
  { texto: "Salir a tomar aire 5 minutos", xp: 5 },
  { texto: "Cambiar algo minimo de tu rutina hoy", xp: 5 },
  { texto: "Escribir 3 cosas que hiciste hoy", xp: 5 },
  { texto: "Mirar por la ventana sin distracciones", xp: 5 },
  { texto: "Estirarte durante 5 minutos", xp: 5 },
  { texto: "No usar el celular por 20 minutos", xp: 5 },
  { texto: "Ordenar tu mochila o escritorio", xp: 5 },
  { texto: "Escuchar un sonido ambiente sin hacer nada mas", xp: 5 },
  { texto: "Pensar una idea nueva durante 5 minutos", xp: 5 },
  { texto: "Dejar el celular lejos mientras comes", xp: 5 },
  { texto: "Hacer algo rapido que venias evitando", xp: 5 },
  { texto: "Aprender una palabra nueva", xp: 5 }
];

const medias = [
  { texto: "Ir a un lugar publico sin usar el celular", xp: 10 },
  { texto: "Caminar 15 minutos sin auriculares", xp: 10 },
  { texto: "Hablar con alguien nuevo aunque sea 1 minuto", xp: 10 },
  { texto: "Decirle algo positivo a alguien", xp: 10 },
  { texto: "Probar una comida que nunca elegirias", xp: 10 },
  { texto: "Entrar a una tienda y mirar todo con calma", xp: 10 },
  { texto: "Sentarte en un lugar distinto al habitual", xp: 10 },
  { texto: "Leer 10 paginas de un libro", xp: 10 },
  { texto: "Hacer algo productivo que venias evitando", xp: 10 },
  { texto: "Cambiar completamente tu rutina por una hora", xp: 10 },
  { texto: "Quedarte 10 minutos sin estimulos digitales", xp: 10 },
  { texto: "Hacer una pregunta simple a un desconocido", xp: 10 },
  { texto: "Mirar una pelicula sin tocar el celular", xp: 10 },
  { texto: "Cocinar algo distinto a lo habitual", xp: 10 },
  { texto: "Salir sin musica ni distracciones", xp: 10 },
  { texto: "Escribir lo que pensas durante 10 minutos", xp: 10 },
  { texto: "Observar a la gente sin juzgar por 5 minutos", xp: 10 }
];

const hardcore = [
  { texto: "Gritar 'SANDIA' una vez en un supermercado y seguir como si nada", xp: 20 },
  { texto: "Entrar a un local, decir 'esto es interesante' y salir", xp: 20 },
  { texto: "Caminar en camara lenta 20 segundos en un lugar publico", xp: 20 },
  { texto: "Aplaudir solo despues de algo totalmente normal", xp: 20 },
  { texto: "Saludar a alguien como si fuera tu amigo de toda la vida", xp: 20 },
  { texto: "Quedarte quieto mirando un punto fijo 1 minuto", xp: 20 },
  { texto: "Decir 'esto es cine' en un momento completamente normal", xp: 20 },
  { texto: "Entrar a una tienda y preguntar algo innecesario con seriedad", xp: 20 },
  { texto: "Actuar como turista perdido en tu propia ciudad", xp: 20 },
  { texto: "Hacer una mini reverencia al bajarte del transporte", xp: 20 },
  { texto: "Mirar un producto y decir 'esto cambia todo'", xp: 20 },
  { texto: "Caminar como modelo por 20 segundos en publico", xp: 20 },
  { texto: "Preguntar la hora teniendo el celular en la mano", xp: 20 },
  { texto: "Decir 'interesante...' despues de observar algo random", xp: 20 },
  { texto: "Simular que estas en una entrevista importante mientras caminas", xp: 20 },
  { texto: "Hacer contacto visual con alguien y asentir como si compartieran un secreto", xp: 20 },
  { texto: "Entrar a un lugar, mirar todo, decir 'ok' y salir", xp: 20 },
  { texto: "Hablar en voz baja como narrador por 1 minuto en publico", xp: 20 }
];

const misionesDiarias = [
  { texto: "Pasar 1 hora sin redes sociales", xp: 30 },
  { texto: "Hablar con alguien que no conoces", xp: 30 },
  { texto: "Salir a caminar sin musica ni celular", xp: 30 },
  { texto: "Escribir una pagina completa de lo que pensas", xp: 30 },
  { texto: "Hacer algo incomodo que estes evitando", xp: 30 },
  { texto: "Levantarte temprano sin posponer la alarma", xp: 30 },
  { texto: "No usar el celular durante una comida", xp: 30 }
];

const XP_STORAGE_KEY = "nonpc-xp";
const MISSION_STORAGE_KEY = "nonpc-last-mission";
const HISTORY_STORAGE_KEY = "nonpc-history";
const DAILY_MISSION_STORAGE_KEY = "misionDiaria";
const DAILY_MISSION_COMPLETED_KEY = "misionDiariaCompletada";
const COMMUNITY_USER_STORAGE_KEY = "community_username";
const COMPLETED_MISSIONS_STORAGE_KEY = "completed_missions";
const ACTIVITIES_STORAGE_KEY = "activities";
const DAILY_STREAK_STORAGE_KEY = "daily_streak_state";
const USER_XP_STORAGE_KEY = "user_xp_map";
const CHALLENGES_STORAGE_KEY = "challenges";
const XP_PER_LEVEL = 100;
const MAX_HISTORY_ITEMS = 10;
const CHALLENGE_PENALTY_XP = 20;

const missionElement = document.getElementById("mission");
const difficultyElement = document.getElementById("difficulty");
const missionXpElement = document.getElementById("missionXp");
const xpElement = document.getElementById("xp");
const levelElement = document.getElementById("level");
const progressTextElement = document.getElementById("progressText");
const progressBarElement = document.getElementById("progressBar");
const xpToastElement = document.getElementById("xpToast");
const historyListElement = document.getElementById("historyList");
const historyEmptyElement = document.getElementById("historyEmpty");
const historyCountElement = document.getElementById("historyCount");
const dailyMissionTextElement = document.getElementById("dailyMissionText");
const dailyMissionXpElement = document.getElementById("dailyMissionXp");
const dailyMissionStatusElement = document.getElementById("dailyMissionStatus");
const completeDailyMissionBtn = document.getElementById("completeDailyMissionBtn");
const newMissionBtn = document.getElementById("newMissionBtn");
const chaosMissionBtn = document.getElementById("chaosMissionBtn");
const completeMissionBtn = document.getElementById("completeMissionBtn");

const todasLasMisiones = [
  ...faciles.map((mision) => ({ ...mision, dificultad: "Facil" })),
  ...medias.map((mision) => ({ ...mision, dificultad: "Media" })),
  ...hardcore.map((mision) => ({ ...mision, dificultad: "Hardcore" }))
];

const misionesHardcore = hardcore.map((mision) => ({ ...mision, dificultad: "Hardcore" }));

let xp = Number(localStorage.getItem(XP_STORAGE_KEY)) || 0;
let completedHistory = loadHistory();
let currentMission = loadSavedMission();
let currentDailyMission = null;
let audioContext;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => null);
  });
}

function getTodayKey() {
  return new Date().toDateString();
}

function loadHistory() {
  try {
    const rawHistory = JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY)) || [];
    return Array.isArray(rawHistory)
      ? rawHistory.map((item) => ({
          ...item,
          xp: Number(item.xp) || 10
        }))
      : [];
  } catch (error) {
    return [];
  }
}

function loadSavedMission() {
  try {
    const rawMission = JSON.parse(localStorage.getItem(MISSION_STORAGE_KEY));
    if (!rawMission || typeof rawMission.texto !== "string") {
      return null;
    }

    return {
      ...rawMission,
      xp: Number(rawMission.xp) || 10
    };
  } catch (error) {
    return null;
  }
}

function saveMission() {
  localStorage.setItem(MISSION_STORAGE_KEY, JSON.stringify(currentMission));
}

function saveHistory() {
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(completedHistory));
}

function getActiveUsername() {
  return localStorage.getItem(COMMUNITY_USER_STORAGE_KEY) || "anon";
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

function getUserXp(username) {
  const map = loadUserXpMap();
  return Number(map[username]) || 0;
}

function setUserXp(username, value) {
  const map = loadUserXpMap();
  map[username] = value;
  saveUserXpMap(map);

  if (username === getActiveUsername()) {
    xp = value;
    localStorage.setItem(XP_STORAGE_KEY, String(value));
  }
}

function addXp(amount) {
  const username = getActiveUsername();
  const nextXp = getUserXp(username) + amount;
  setUserXp(username, nextXp);
  return nextXp;
}

function loadChallenges() {
  try {
    const stored = JSON.parse(localStorage.getItem(CHALLENGES_STORAGE_KEY)) || [];
    return Array.isArray(stored) ? stored : [];
  } catch (error) {
    return [];
  }
}

function saveChallenges(challenges) {
  localStorage.setItem(CHALLENGES_STORAGE_KEY, JSON.stringify(challenges));
}

function processExpiredChallenges() {
  const now = Date.now();
  const activeUsername = getActiveUsername();
  const challenges = loadChallenges();
  let changed = false;
  let penalizedCurrentUser = false;

  challenges.forEach((challenge) => {
    if (challenge.status !== "pending" || challenge.penaltyApplied) {
      return;
    }

    const expiresAt = new Date(challenge.expiresAt || 0).getTime();
    if (!expiresAt || now <= expiresAt) {
      return;
    }

    challenge.status = "failed";
    challenge.penaltyApplied = true;
    challenge.expiredAt = new Date(now).toISOString();
    setUserXp(challenge.toUserId, Math.max(0, getUserXp(challenge.toUserId) - CHALLENGE_PENALTY_XP));
    changed = true;

    if (challenge.toUserId === activeUsername) {
      penalizedCurrentUser = true;
    }
  });

  if (changed) {
    saveChallenges(challenges);
  }

  if (penalizedCurrentUser) {
    xpToastElement.textContent = `No respondiste el desafio a tiempo (-${CHALLENGE_PENALTY_XP} XP)`;
    xpToastElement.classList.remove("show");
    requestAnimationFrame(() => {
      xpToastElement.classList.add("show");
    });
  }
}

function loadActivities() {
  try {
    const stored = JSON.parse(localStorage.getItem(ACTIVITIES_STORAGE_KEY)) || [];
    return Array.isArray(stored) ? stored : [];
  } catch (error) {
    return [];
  }
}

function saveActivities(activities) {
  localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(activities));
}

function logActivity(activity) {
  const activities = loadActivities();
  activities.unshift({
    id: `activity-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt: new Date().toISOString(),
    ...activity
  });
  saveActivities(activities.slice(0, 150));
}

function saveCompletedMissionRecord(mission, sourceType = "mission") {
  const completedBy = localStorage.getItem(COMMUNITY_USER_STORAGE_KEY) || "anon";
  let completedMissions = [];

  try {
    completedMissions = JSON.parse(localStorage.getItem(COMPLETED_MISSIONS_STORAGE_KEY)) || [];
  } catch (error) {
    completedMissions = [];
  }

  const record = {
    id: `completed-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    texto: mission.texto,
    dificultad: mission.dificultad || "Media",
    xp: mission.xp,
    sourceType,
    completedBy,
    completedAt: new Date().toISOString(),
    validations: [],
    comments: [],
    bonusGranted: false
  };

  completedMissions.unshift(record);

  localStorage.setItem(COMPLETED_MISSIONS_STORAGE_KEY, JSON.stringify(completedMissions));
  return record;
}

function loadDailyStreakState() {
  try {
    const stored = JSON.parse(localStorage.getItem(DAILY_STREAK_STORAGE_KEY));
    return stored && typeof stored === "object" ? stored : { streak: 0, lastCompletedDate: null };
  } catch (error) {
    return { streak: 0, lastCompletedDate: null };
  }
}

function saveDailyStreakState(state) {
  localStorage.setItem(DAILY_STREAK_STORAGE_KEY, JSON.stringify(state));
}

function updateDailyStreak() {
  const today = new Date();
  const todayKey = today.toDateString();
  const streakState = loadDailyStreakState();

  if (streakState.lastCompletedDate === todayKey) {
    return streakState.streak || 0;
  }

  const previousDate = streakState.lastCompletedDate ? new Date(streakState.lastCompletedDate) : null;
  let streak = 1;

  if (previousDate) {
    const diffMs = today.setHours(0, 0, 0, 0) - previousDate.setHours(0, 0, 0, 0);
    const diffDays = diffMs / 86400000;
    streak = diffDays === 1 ? (streakState.streak || 0) + 1 : 1;
  }

  const nextState = {
    streak,
    lastCompletedDate: todayKey
  };

  saveDailyStreakState(nextState);
  return streak;
}

function getLevelFromXp(totalXp) {
  return Math.floor(totalXp / XP_PER_LEVEL) + 1;
}

function updateStatsUI() {
  const level = getLevelFromXp(xp);
  const progress = xp % XP_PER_LEVEL;
  const progressPercent = (progress / XP_PER_LEVEL) * 100;

  xpElement.textContent = `XP: ${xp}`;
  levelElement.textContent = `Nivel: ${level}`;
  progressTextElement.textContent = `${progress} / ${XP_PER_LEVEL} XP`;
  progressBarElement.style.width = `${progressPercent}%`;
}

function getDifficultyClass(dificultad) {
  const normalized = dificultad.toLowerCase();

  if (normalized === "facil") {
    return "difficulty-easy";
  }

  if (normalized === "media") {
    return "difficulty-medium";
  }

  return "difficulty-hardcore";
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function obtenerMisionRandom() {
  return pickRandom(todasLasMisiones);
}

function obtenerMisionHardcore() {
  return pickRandom(misionesHardcore);
}

function obtenerMisionUnica(selector) {
  let mission = null;

  do {
    mission = selector();
  } while (mission.texto === currentMission?.texto);

  return mission;
}

function obtenerMisionDiaria() {
  const hoy = getTodayKey();
  let guardado = localStorage.getItem(DAILY_MISSION_STORAGE_KEY);

  if (guardado) {
    guardado = JSON.parse(guardado);

    if (guardado.fecha === hoy) {
      return {
        ...guardado.mision,
        xp: Number(guardado.mision.xp) || 30
      };
    }
  }

  const random = misionesDiarias[Math.floor(Math.random() * misionesDiarias.length)];

  localStorage.setItem(
    DAILY_MISSION_STORAGE_KEY,
    JSON.stringify({
      fecha: hoy,
      mision: random
    })
  );

  return random;
}

function isDailyMissionCompleted() {
  try {
    const guardado = JSON.parse(localStorage.getItem(DAILY_MISSION_COMPLETED_KEY));
    return guardado?.fecha === getTodayKey();
  } catch (error) {
    return false;
  }
}

function renderDailyMission() {
  currentDailyMission = obtenerMisionDiaria();
  const completed = isDailyMissionCompleted();

  dailyMissionTextElement.textContent = currentDailyMission.texto;
  dailyMissionXpElement.textContent = `${currentDailyMission.xp} XP`;
  dailyMissionStatusElement.textContent = completed ? "Volve manana" : "Disponible hoy";
  completeDailyMissionBtn.disabled = completed;
  completeDailyMissionBtn.textContent = completed ? "Completada hoy" : "Completar diaria";
}

function completeDailyMission() {
  if (!currentDailyMission || isDailyMissionCompleted()) {
    renderDailyMission();
    return;
  }

  addXp(currentDailyMission.xp);
  localStorage.setItem(
    DAILY_MISSION_COMPLETED_KEY,
    JSON.stringify({
      fecha: getTodayKey()
    })
  );

  updateStatsUI();
  const record = saveCompletedMissionRecord(
    {
      ...currentDailyMission,
      dificultad: "Diaria"
    },
    "daily"
  );
  const username = localStorage.getItem(COMMUNITY_USER_STORAGE_KEY) || "anon";
  logActivity({
    type: "mission_completed",
    userId: username,
    targetUserId: null,
    missionId: record.id,
    missionDifficulty: record.dificultad
  });
  const streak = updateDailyStreak();
  logActivity({
    type: "streak_reached",
    userId: username,
    targetUserId: null,
    missionId: null,
    streakCount: streak
  });
  dailyMissionStatusElement.textContent = "Volve manana";
  completeDailyMissionBtn.disabled = true;
  completeDailyMissionBtn.textContent = "Completada hoy";
  xpToastElement.textContent = `+${currentDailyMission.xp} XP`;
  xpToastElement.classList.remove("show");

  requestAnimationFrame(() => {
    xpToastElement.classList.add("show");
  });

  playSuccessSound();
}

function setMission(mission, animationName = "fade") {
  currentMission = mission;
  missionElement.classList.remove("fade", "chaos");

  requestAnimationFrame(() => {
    missionElement.textContent = currentMission.texto;
    difficultyElement.textContent = currentMission.dificultad;
    difficultyElement.className = `difficulty-badge ${getDifficultyClass(currentMission.dificultad)}`;
    missionXpElement.textContent = `${currentMission.xp} XP`;
    missionElement.classList.add(animationName);
  });

  saveMission();
}

function mostrarMisionRandom() {
  const nextMission = obtenerMisionUnica(obtenerMisionRandom);
  setMission(nextMission, "fade");
}

function mostrarMisionHardcore() {
  const nextMission = obtenerMisionUnica(obtenerMisionHardcore);
  setMission(nextMission, "chaos");
}

function loadInitialMission() {
  if (currentMission) {
    setMission(currentMission);
    return;
  }

  mostrarMisionRandom();
}

function showXpToast() {
  xpToastElement.textContent = `+${currentMission?.xp || 0} XP`;
  xpToastElement.classList.remove("show");

  requestAnimationFrame(() => {
    xpToastElement.classList.add("show");
  });
}

function playSuccessSound() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    return;
  }

  if (!audioContext) {
    audioContext = new AudioContextClass();
  }

  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(660, now);
  oscillator.frequency.exponentialRampToValueAtTime(880, now + 0.08);

  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.exponentialRampToValueAtTime(0.06, now + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start(now);
  oscillator.stop(now + 0.18);
}

function renderHistory() {
  historyListElement.innerHTML = "";
  historyCountElement.textContent = `${completedHistory.length} completadas`;

  if (completedHistory.length === 0) {
    historyEmptyElement.classList.remove("is-hidden");
    return;
  }

  historyEmptyElement.classList.add("is-hidden");

  completedHistory.forEach((item) => {
    const li = document.createElement("li");
    li.className = "history-item";

    const missionInfo = document.createElement("div");
    const missionText = document.createElement("p");
    const missionMeta = document.createElement("small");
    const xpTag = document.createElement("strong");

    missionText.textContent = item.texto;
    missionMeta.textContent = `${item.dificultad} | ${item.fecha}`;
    xpTag.textContent = `+${item.xp} XP`;

    missionInfo.append(missionText, missionMeta);
    li.append(missionInfo, xpTag);
    historyListElement.appendChild(li);
  });
}

function addMissionToHistory(mission) {
  const timestamp = new Date().toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });

  completedHistory.unshift({
    texto: mission.texto,
    dificultad: mission.dificultad,
    xp: mission.xp,
    fecha: timestamp
  });

  completedHistory = completedHistory.slice(0, MAX_HISTORY_ITEMS);
  saveHistory();
  renderHistory();
}

function handleNewMission() {
  mostrarMisionRandom();
}

function handleChaosMission() {
  mostrarMisionHardcore();
}

function handleCompleteMission() {
  if (!currentMission) {
    return;
  }

  addXp(currentMission.xp);
  updateStatsUI();
  const record = saveCompletedMissionRecord(currentMission, "standard");
  logActivity({
    type: "mission_completed",
    userId: localStorage.getItem(COMMUNITY_USER_STORAGE_KEY) || "anon",
    targetUserId: null,
    missionId: record.id,
    missionDifficulty: currentMission.dificultad
  });
  addMissionToHistory(currentMission);
  showXpToast();
  playSuccessSound();
}

xp = getUserXp(getActiveUsername());
localStorage.setItem(XP_STORAGE_KEY, String(xp));
processExpiredChallenges();
xp = getUserXp(getActiveUsername());
localStorage.setItem(XP_STORAGE_KEY, String(xp));
updateStatsUI();
renderDailyMission();
loadInitialMission();
renderHistory();

newMissionBtn.addEventListener("click", handleNewMission);
chaosMissionBtn.addEventListener("click", handleChaosMission);
completeMissionBtn.addEventListener("click", handleCompleteMission);
completeDailyMissionBtn.addEventListener("click", completeDailyMission);
