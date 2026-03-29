const USER_XP_STORAGE_KEY = "user_xp_map";
const rankingList = document.getElementById("rankingList");
const rankingEmpty = document.getElementById("rankingEmpty");
const rankingCount = document.getElementById("rankingCount");

function loadUserXpMap() {
  try {
    const stored = JSON.parse(localStorage.getItem(USER_XP_STORAGE_KEY)) || {};
    return stored && typeof stored === "object" ? stored : {};
  } catch (error) {
    return {};
  }
}

function renderRanking() {
  const entries = Object.entries(loadUserXpMap())
    .map(([user, xp]) => ({ user, xp: Number(xp) || 0 }))
    .sort((a, b) => b.xp - a.xp);

  rankingList.innerHTML = "";
  rankingCount.textContent = `${entries.length} jugadores`;

  if (entries.length === 0) {
    rankingEmpty.classList.remove("is-hidden");
    return;
  }

  rankingEmpty.classList.add("is-hidden");
  entries.forEach((entry, index) => {
    const card = document.createElement("article");
    card.className = "idea-card";

    const top = document.createElement("div");
    top.className = "idea-top";

    const title = document.createElement("h3");
    title.textContent = `#${index + 1} - ${entry.user}`;

    const badge = document.createElement("div");
    badge.className = "badge badge-success";
    badge.textContent = `${entry.xp} XP`;

    top.append(title, badge);
    card.appendChild(top);
    rankingList.appendChild(card);
  });
}

renderRanking();
