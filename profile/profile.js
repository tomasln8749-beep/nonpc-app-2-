const COMMUNITY_USER_STORAGE_KEY = "community_username";
const USER_XP_STORAGE_KEY = "user_xp_map";
const COMPLETED_MISSIONS_STORAGE_KEY = "completed_missions";
const DAILY_STREAK_STORAGE_KEY = "daily_streak_state";
const ACTIVITIES_STORAGE_KEY = "activities";

const profileName = document.getElementById("profileName");
const profileXp = document.getElementById("profileXp");
const profileCompleted = document.getElementById("profileCompleted");
const profileStreak = document.getElementById("profileStreak");
const profileActivityCount = document.getElementById("profileActivityCount");
const profileActivityList = document.getElementById("profileActivityList");
const profileActivityEmpty = document.getElementById("profileActivityEmpty");

function loadJson(key, fallback) {
  try {
    const stored = JSON.parse(localStorage.getItem(key));
    return stored ?? fallback;
  } catch (error) {
    return fallback;
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

function renderProfile() {
  const username = localStorage.getItem(COMMUNITY_USER_STORAGE_KEY) || "anon";
  const xpMap = loadJson(USER_XP_STORAGE_KEY, {});
  const completedMissions = loadJson(COMPLETED_MISSIONS_STORAGE_KEY, []);
  const streakState = loadJson(DAILY_STREAK_STORAGE_KEY, { streak: 0 });
  const activities = loadJson(ACTIVITIES_STORAGE_KEY, []).filter((activity) => activity.userId === username).slice(0, 8);

  profileName.textContent = username;
  profileXp.textContent = `${Number(xpMap[username]) || 0} XP`;
  profileCompleted.textContent = String(completedMissions.filter((mission) => mission.completedBy === username).length);
  profileStreak.textContent = `${Number(streakState.streak) || 0} dias`;
  profileActivityCount.textContent = `${activities.length} eventos`;
  profileActivityList.innerHTML = "";

  if (activities.length === 0) {
    profileActivityEmpty.classList.remove("is-hidden");
    return;
  }

  profileActivityEmpty.classList.add("is-hidden");
  activities.forEach((activity) => {
    const card = document.createElement("article");
    card.className = "activity-card";

    const text = document.createElement("p");
    if (activity.type === "challenge_sent") {
      text.textContent = `${activity.userId} desafio a ${activity.targetUserId}`;
    } else if (activity.type === "streak_reached") {
      text.textContent = `${activity.userId} alcanzo racha de ${activity.streakCount} dias`;
    } else {
      text.textContent = `${activity.userId} completo una mision`;
    }

    const meta = document.createElement("div");
    meta.className = "idea-meta";
    meta.style.marginTop = "10px";
    meta.textContent = formatDate(activity.createdAt);

    card.append(text, meta);
    profileActivityList.appendChild(card);
  });
}

renderProfile();
