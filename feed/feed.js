const ACTIVITIES_STORAGE_KEY = "activities";
const COMPLETED_MISSIONS_STORAGE_KEY = "completed_missions";

const activitiesList = document.getElementById("activitiesList");
const activitiesEmpty = document.getElementById("activitiesEmpty");
const activitiesCount = document.getElementById("activitiesCount");

function loadActivities() {
  try {
    const stored = JSON.parse(localStorage.getItem(ACTIVITIES_STORAGE_KEY)) || [];
    return Array.isArray(stored) ? stored : [];
  } catch (error) {
    return [];
  }
}

function loadCompletedMissions() {
  try {
    const stored = JSON.parse(localStorage.getItem(COMPLETED_MISSIONS_STORAGE_KEY)) || [];
    return Array.isArray(stored) ? stored : [];
  } catch (error) {
    return [];
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

function buildActivityText(activity, completedMissionsById) {
  if (activity.type === "mission_completed") {
    const mission = completedMissionsById.get(activity.missionId);
    const difficulty = mission?.dificultad || activity.missionDifficulty || "mision";
    return `${activity.userId} completo una mision ${difficulty}`;
  }

  if (activity.type === "challenge_sent") {
    return `${activity.userId} desafio a ${activity.targetUserId}`;
  }

  if (activity.type === "streak_reached") {
    return `${activity.userId} alcanzo racha de ${activity.streakCount} dias`;
  }

  return `${activity.userId} hizo algo en NoNPC`;
}

function createActivityCard(activity, completedMissionsById) {
  const card = document.createElement("article");
  card.className = "activity-card";

  const text = document.createElement("p");
  text.textContent = buildActivityText(activity, completedMissionsById);

  const meta = document.createElement("div");
  meta.className = "idea-meta";
  meta.style.marginTop = "10px";
  meta.textContent = formatDate(activity.createdAt);

  card.append(text, meta);
  return card;
}

function renderFeed() {
  const activities = loadActivities().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const completedMissions = loadCompletedMissions();
  const completedMissionsById = new Map(completedMissions.map((mission) => [mission.id, mission]));

  activitiesList.innerHTML = "";
  activitiesCount.textContent = `${activities.length} eventos`;

  if (activities.length === 0) {
    activitiesEmpty.classList.remove("is-hidden");
    return;
  }

  activitiesEmpty.classList.add("is-hidden");
  activities.forEach((activity) => {
    activitiesList.appendChild(createActivityCard(activity, completedMissionsById));
  });
}

renderFeed();
