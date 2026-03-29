const MISSION_STORAGE_KEY = "nonpc-last-mission";
const DAILY_MISSION_STORAGE_KEY = "misionDiaria";
const HISTORY_STORAGE_KEY = "nonpc-history";
const ACTIVE_MISSIONS_STORAGE_KEY = "active_missions";
const COMMUNITY_USER_STORAGE_KEY = "community_username";

const lastMissionTitle = document.getElementById("lastMissionTitle");
const lastMissionMeta = document.getElementById("lastMissionMeta");
const dailyMissionPreview = document.getElementById("dailyMissionPreview");
const dailyMissionPreviewMeta = document.getElementById("dailyMissionPreviewMeta");
const activeMissionCount = document.getElementById("activeMissionCount");
const recentMissionCount = document.getElementById("recentMissionCount");
const recentMissionsList = document.getElementById("recentMissionsList");
const recentMissionsEmpty = document.getElementById("recentMissionsEmpty");

function loadJson(key, fallback) {
  try {
    const stored = JSON.parse(localStorage.getItem(key));
    return stored ?? fallback;
  } catch (error) {
    return fallback;
  }
}

function renderMissionsPage() {
  const lastMission = loadJson(MISSION_STORAGE_KEY, null);
  if (lastMission?.texto) {
    lastMissionTitle.textContent = lastMission.texto;
    lastMissionMeta.textContent = `${lastMission.dificultad || "Media"} - ${lastMission.xp || 0} XP`;
  }

  const dailyMission = loadJson(DAILY_MISSION_STORAGE_KEY, null);
  if (dailyMission?.mision?.texto) {
    dailyMissionPreview.textContent = dailyMission.mision.texto;
    dailyMissionPreviewMeta.textContent = `${dailyMission.mision.xp || 30} XP - ${dailyMission.fecha}`;
  }

  const username = localStorage.getItem(COMMUNITY_USER_STORAGE_KEY) || "anon";
  const activeMissions = loadJson(ACTIVE_MISSIONS_STORAGE_KEY, {});
  const userActiveMissions = Array.isArray(activeMissions[username]) ? activeMissions[username] : [];
  activeMissionCount.textContent = String(userActiveMissions.length);

  const history = loadJson(HISTORY_STORAGE_KEY, []);
  recentMissionCount.textContent = `${history.length} items`;
  recentMissionsList.innerHTML = "";

  if (!Array.isArray(history) || history.length === 0) {
    recentMissionsEmpty.classList.remove("is-hidden");
    return;
  }

  recentMissionsEmpty.classList.add("is-hidden");
  history.slice(0, 8).forEach((mission) => {
    const card = document.createElement("article");
    card.className = "idea-card";

    const top = document.createElement("div");
    top.className = "idea-top";

    const title = document.createElement("h3");
    title.textContent = mission.texto;

    const badge = document.createElement("div");
    badge.className = "badge badge-primary";
    badge.textContent = `+${mission.xp || 0} XP`;

    const meta = document.createElement("div");
    meta.className = "idea-meta";
    meta.textContent = `${mission.dificultad || "Media"} - ${mission.fecha || "Reciente"}`;

    top.append(title, badge);
    card.append(top, meta);
    recentMissionsList.appendChild(card);
  });
}

renderMissionsPage();
