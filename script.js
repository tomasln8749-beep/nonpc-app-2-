const misiones = [
  { texto: "Comer en un lugar donde no entendes el menu", dificultad: "Media" },
  { texto: "Aprender a insultar en un idioma que no tenga nada que ver con el tuyo", dificultad: "Facil" },
  { texto: "Ir al cine solo y sentarte en el medio como si fueras el dueno", dificultad: "Media" },
  { texto: "Caminar 10 cuadras hacia una direccion que nunca elegis", dificultad: "Facil" },
  { texto: "Comprar un objeto totalmente inutil en una feria de usados", dificultad: "Facil" },
  { texto: "Hacerle una pregunta existencial a un desconocido", dificultad: "Hardcore" },
  { texto: "Aprender a hacer un nudo de corbata", dificultad: "Media" },
  { texto: "Ver el amanecer sin haber salido de fiesta", dificultad: "Hardcore" },
  { texto: "Entrar a una inmobiliaria y preguntar por una mansion", dificultad: "Hardcore" },
  { texto: "Cocinar algo que lleve mas de 3 horas", dificultad: "Hardcore" },
  { texto: "Leer un libro de un genero que odias", dificultad: "Media" },
  { texto: "Sacar una foto analogica", dificultad: "Media" },
  { texto: "Subirse a un colectivo al azar", dificultad: "Hardcore" },
  { texto: "Aprender a silbar con los dedos", dificultad: "Media" },
  { texto: "Ayudar a alguien sin que lo pida", dificultad: "Facil" },
  { texto: "Plantar algo y que no se muera en 48 horas", dificultad: "Media" },
  { texto: "Ir a un museo y mirar un cuadro aburrido 10 min", dificultad: "Facil" },
  { texto: "Escribir una carta a tu yo del futuro", dificultad: "Facil" },
  { texto: "Hacer 12 horas sin pantallas", dificultad: "Hardcore" },
  { texto: "Abrir una botella sin abridor", dificultad: "Media" }
];

const XP_STORAGE_KEY = "nonpc-xp";
const MISSION_STORAGE_KEY = "nonpc-last-mission";
const HISTORY_STORAGE_KEY = "nonpc-history";
const XP_PER_MISSION = 10;
const XP_PER_LEVEL = 100;
const MAX_HISTORY_ITEMS = 10;

const missionElement = document.getElementById("mission");
const difficultyElement = document.getElementById("difficulty");
const xpElement = document.getElementById("xp");
const levelElement = document.getElementById("level");
const progressTextElement = document.getElementById("progressText");
const progressBarElement = document.getElementById("progressBar");
const xpToastElement = document.getElementById("xpToast");
const historyListElement = document.getElementById("historyList");
const historyEmptyElement = document.getElementById("historyEmpty");
const historyCountElement = document.getElementById("historyCount");
const newMissionBtn = document.getElementById("newMissionBtn");
const chaosMissionBtn = document.getElementById("chaosMissionBtn");
const completeMissionBtn = document.getElementById("completeMissionBtn");

let xp = Number(localStorage.getItem(XP_STORAGE_KEY)) || 0;
let completedHistory = loadHistory();
let currentMission = loadSavedMission();
let audioContext;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {
      return null;
    });
  });
}

function loadHistory() {
  try {
    const rawHistory = JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY)) || [];
    return Array.isArray(rawHistory) ? rawHistory : [];
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

    return rawMission;
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

function getRandomMission(excludedText = "") {
  if (misiones.length === 1) {
    return misiones[0];
  }

  let nextMission = currentMission;

  while (!nextMission || nextMission.texto === excludedText) {
    const randomIndex = Math.floor(Math.random() * misiones.length);
    nextMission = misiones[randomIndex];
  }

  return nextMission;
}

function setMission(mission, animationName = "fade") {
  currentMission = mission;
  missionElement.classList.remove("fade", "chaos");

  requestAnimationFrame(() => {
    missionElement.textContent = currentMission.texto;
    difficultyElement.textContent = currentMission.dificultad;
    difficultyElement.className = `difficulty-badge ${getDifficultyClass(currentMission.dificultad)}`;
    missionElement.classList.add(animationName);
  });

  saveMission();
}

function loadInitialMission() {
  const hasValidMission = currentMission && misiones.some((mission) => mission.texto === currentMission.texto);
  const initialMission = hasValidMission ? currentMission : getRandomMission();
  setMission(initialMission);
}

function showXpToast() {
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
    xpTag.textContent = `+${XP_PER_MISSION} XP`;

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
    fecha: timestamp
  });

  completedHistory = completedHistory.slice(0, MAX_HISTORY_ITEMS);
  saveHistory();
  renderHistory();
}

function handleNewMission() {
  const nextMission = getRandomMission(currentMission ? currentMission.texto : "");
  setMission(nextMission, "fade");
}

function handleChaosMission() {
  const nextMission = getRandomMission(currentMission ? currentMission.texto : "");
  setMission(nextMission, "chaos");
}

function handleCompleteMission() {
  if (!currentMission) {
    return;
  }

  xp += XP_PER_MISSION;
  localStorage.setItem(XP_STORAGE_KEY, String(xp));
  updateStatsUI();
  addMissionToHistory(currentMission);
  showXpToast();
  playSuccessSound();
}

updateStatsUI();
loadInitialMission();
renderHistory();

newMissionBtn.addEventListener("click", handleNewMission);
chaosMissionBtn.addEventListener("click", handleChaosMission);
completeMissionBtn.addEventListener("click", handleCompleteMission);
