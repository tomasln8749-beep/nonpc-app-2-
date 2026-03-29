const MISSION_IDEAS_STORAGE_KEY = "mission_ideas";
const MISSIONS_STORAGE_KEY = "missions";
const CHALLENGES_STORAGE_KEY = "challenges";
const COMMUNITY_USER_STORAGE_KEY = "community_username";
const COMPLETED_MISSIONS_STORAGE_KEY = "completed_missions";
const XP_STORAGE_KEY = "nonpc-xp";
const ACTIVITIES_STORAGE_KEY = "activities";
const SOCIAL_XP_RATE_LIMIT_KEY = "social_xp_rate_limit";
const USER_XP_STORAGE_KEY = "user_xp_map";
const CHALLENGE_EXPIRY_MS = 24 * 60 * 60 * 1000;
const VALIDATION_ACTION_XP = 5;
const COMMENT_ACTION_XP = 2;
const RECEIVE_VALIDATION_XP = 10;
const SOCIAL_ACTION_LIMIT_PER_MINUTE = 6;

const ideaForm = document.getElementById("ideaForm");
const usernameInput = document.getElementById("usernameInput");
const titleInput = document.getElementById("titleInput");
const descriptionInput = document.getElementById("descriptionInput");
const formStatus = document.getElementById("formStatus");
const ideasList = document.getElementById("ideasList");
const ideasEmpty = document.getElementById("ideasEmpty");
const ideasCount = document.getElementById("ideasCount");
const profilesList = document.getElementById("profilesList");
const profilesEmpty = document.getElementById("profilesEmpty");
const profilesCount = document.getElementById("profilesCount");
const completedMissionsList = document.getElementById("completedMissionsList");
const completedMissionsEmpty = document.getElementById("completedMissionsEmpty");
const completedMissionsCount = document.getElementById("completedMissionsCount");

let missionIdeas = loadMissionIdeas();
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
  }, 1800);
}

function loadRateLimitState() {
  try {
    const stored = JSON.parse(localStorage.getItem(SOCIAL_XP_RATE_LIMIT_KEY)) || {};
    return stored && typeof stored === "object" ? stored : {};
  } catch (error) {
    return {};
  }
}

function saveRateLimitState(state) {
  localStorage.setItem(SOCIAL_XP_RATE_LIMIT_KEY, JSON.stringify(state));
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

function canAwardSocialXp(username, actionType) {
  const now = Date.now();
  const state = loadRateLimitState();
  const entries = Array.isArray(state[username]) ? state[username] : [];
  const recentEntries = entries.filter((entry) => now - entry.timestamp < 60000);

  if (recentEntries.length >= SOCIAL_ACTION_LIMIT_PER_MINUTE) {
    state[username] = recentEntries;
    saveRateLimitState(state);
    return false;
  }

  recentEntries.push({
    actionType,
    timestamp: now
  });
  state[username] = recentEntries;
  saveRateLimitState(state);
  return true;
}

function addXpToUser(username, amount) {
  const map = loadUserXpMap();
  const nextXp = (Number(map[username]) || 0) + amount;
  map[username] = nextXp;
  saveUserXpMap(map);

  if (username === getCurrentUsername()) {
    localStorage.setItem(XP_STORAGE_KEY, String(nextXp));
  }

  return nextXp;
}

function awardXpToUser(username, amount, message, actionType) {
  if (!username) {
    return false;
  }

  if (!canAwardSocialXp(username, actionType)) {
    if (username === getCurrentUsername()) {
      formStatus.textContent = "Espera un momento antes de seguir sumando XP social.";
    }
    return false;
  }

  addXpToUser(username, amount);
  if (username === getCurrentUsername()) {
    showToast(`${message} +${amount} XP`);
  }
  return true;
}

function awardValidationReceiverXp(mission) {
  if (!mission || !mission.completedBy || mission.bonusGranted || mission.validations.length < 2) {
    return;
  }

  mission.bonusGranted = true;
  awardXpToUser(mission.completedBy, RECEIVE_VALIDATION_XP, "Recibiste validaciones.", "receive_validation");
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

function loadMissionsCollection() {
  try {
    const stored = JSON.parse(localStorage.getItem(MISSIONS_STORAGE_KEY)) || [];
    return Array.isArray(stored) ? stored : [];
  } catch (error) {
    return [];
  }
}

function saveMissionsCollection(missions) {
  localStorage.setItem(MISSIONS_STORAGE_KEY, JSON.stringify(missions));
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

function loadCompletedMissions() {
  try {
    const stored = JSON.parse(localStorage.getItem(COMPLETED_MISSIONS_STORAGE_KEY)) || [];
    return Array.isArray(stored)
      ? stored.map((mission) => ({
          id: mission.id,
          texto: mission.texto || "",
          dificultad: mission.dificultad || "Media",
          xp: Number(mission.xp) || 10,
          completedBy: mission.completedBy || "anon",
          completedAt: mission.completedAt || new Date().toISOString(),
          validations: Array.isArray(mission.validations) ? mission.validations : [],
          comments: Array.isArray(mission.comments) ? mission.comments : [],
          bonusGranted: Boolean(mission.bonusGranted)
        }))
      : [];
  } catch (error) {
    return [];
  }
}

function saveCompletedMissions(missions) {
  localStorage.setItem(COMPLETED_MISSIONS_STORAGE_KEY, JSON.stringify(missions));
}

function loadMissionIdeas() {
  try {
    const stored = JSON.parse(localStorage.getItem(MISSION_IDEAS_STORAGE_KEY)) || [];
    return Array.isArray(stored)
      ? stored.map((idea) => ({
          id: idea.id,
          title: idea.title || "",
          description: idea.description || "",
          createdBy: idea.createdBy || "anon",
          votes: Number(idea.votes) || 0,
          createdAt: idea.createdAt || new Date().toISOString(),
          approved: Boolean(idea.approved),
          votedBy: Array.isArray(idea.votedBy) ? idea.votedBy : [],
          comments: Array.isArray(idea.comments) ? idea.comments : []
        }))
      : [];
  } catch (error) {
    return [];
  }
}

function saveMissionIdeas() {
  localStorage.setItem(MISSION_IDEAS_STORAGE_KEY, JSON.stringify(missionIdeas));
}

function getCurrentUsername() {
  return usernameInput.value.trim();
}

function persistUsername() {
  const username = getCurrentUsername();
  if (!username) {
    return;
  }

  localStorage.setItem(COMMUNITY_USER_STORAGE_KEY, username);
}

function getSortedIdeas() {
  return [...missionIdeas].sort((a, b) => {
    if (b.votes !== a.votes) {
      return b.votes - a.votes;
    }

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
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

function createCommentItem(comment) {
  const wrapper = document.createElement("article");
  wrapper.className = "comment-item";

  const meta = document.createElement("div");
  meta.className = "comment-meta";
  meta.textContent = `${comment.createdBy} · ${formatDate(comment.createdAt)}`;

  const text = document.createElement("p");
  text.textContent = comment.text;

  wrapper.append(meta, text);
  return wrapper;
}

function createCommentForm(ideaId) {
  const form = document.createElement("form");
  form.className = "comment-form";

  const input = document.createElement("input");
  input.className = "input";
  input.type = "text";
  input.name = "comment";
  input.maxLength = 140;
  input.placeholder = "Deja un comentario corto";
  input.required = true;

  const button = document.createElement("button");
  button.className = "btn btn-secondary btn-small";
  button.type = "submit";
  button.textContent = "Comentar";

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const text = input.value.trim();
    const username = getCurrentUsername();
    if (!text) {
      return;
    }

    if (!username) {
      formStatus.textContent = "Escribe tu usuario antes de comentar.";
      usernameInput.focus();
      return;
    }

    const idea = missionIdeas.find((item) => item.id === ideaId);
    if (!idea) {
      return;
    }

    persistUsername();
    idea.comments.unshift({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      text,
      createdBy: username,
      createdAt: new Date().toISOString()
    });

    saveMissionIdeas();
    input.value = "";
    renderIdeas();
  });

  form.append(input, button);
  return form;
}

function createIdeaCard(idea) {
  const card = document.createElement("article");
  card.className = "idea-card";

  const top = document.createElement("div");
  top.className = "idea-top";

  const copy = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = idea.title;

  const meta = document.createElement("div");
  meta.className = "idea-meta";
  meta.textContent = `por ${idea.createdBy} · ${formatDate(idea.createdAt)}`;

  copy.append(title, meta);

  const badges = document.createElement("div");
  badges.className = "idea-badges";

  const votePill = document.createElement("div");
  votePill.className = "vote-pill";
  votePill.textContent = `${idea.votes} votos`;
  badges.appendChild(votePill);

  if (idea.approved) {
    const approvedBadge = document.createElement("div");
    approvedBadge.className = "status-pill status-pill-approved";
    approvedBadge.textContent = "Aprobada";
    badges.appendChild(approvedBadge);
  }

  top.append(copy, badges);

  const description = document.createElement("p");
  description.className = "idea-description";
  description.textContent = idea.description;

  const actions = document.createElement("div");
  actions.className = "idea-actions";

  const voteButton = document.createElement("button");
  voteButton.className = "btn btn-primary btn-small";
  voteButton.type = "button";
  voteButton.textContent = "Upvote";

  const currentUsername = getCurrentUsername();
  const alreadyVoted = currentUsername ? idea.votedBy.includes(currentUsername) : false;
  if (alreadyVoted) {
    voteButton.disabled = true;
    voteButton.textContent = "Ya votaste";
  }

  voteButton.addEventListener("click", () => {
    const username = getCurrentUsername();
    if (!username) {
      formStatus.textContent = "Escribe tu usuario antes de votar.";
      usernameInput.focus();
      return;
    }

    if (idea.votedBy.includes(username)) {
      return;
    }

    persistUsername();
    idea.votedBy.push(username);
    idea.votes += 1;
    saveMissionIdeas();
    renderIdeas();
  });

  const approveButton = document.createElement("button");
  approveButton.className = "btn btn-secondary btn-small";
  approveButton.type = "button";
  approveButton.textContent = idea.approved ? "Ya aprobada" : "Aprobar";
  approveButton.disabled = idea.approved;

  approveButton.addEventListener("click", () => {
    if (idea.approved) {
      return;
    }

    const missions = loadMissionsCollection();
    const alreadyExists = missions.some((mission) => mission.sourceIdeaId === idea.id);

    if (!alreadyExists) {
      missions.unshift({
        id: `mission-${idea.id}`,
        title: idea.title,
        description: idea.description,
        difficulty: "medium",
        xpReward: 50,
        createdBy: idea.createdBy,
        sourceIdeaId: idea.id,
        createdAt: new Date().toISOString()
      });
      saveMissionsCollection(missions);
    }

    idea.approved = true;
    saveMissionIdeas();
    renderIdeas();
  });

  actions.append(voteButton, approveButton);

  const commentsBlock = document.createElement("section");
  commentsBlock.className = "comments-block";

  const commentsTitle = document.createElement("div");
  commentsTitle.className = "comment-meta";
  commentsTitle.textContent = `Comentarios (${idea.comments.length})`;

  const commentsList = document.createElement("div");
  commentsList.className = "comments-list";

  if (idea.comments.length === 0) {
    const emptyComment = document.createElement("div");
    emptyComment.className = "helper-text";
    emptyComment.textContent = "Todavia no hay comentarios.";
    commentsList.appendChild(emptyComment);
  } else {
    idea.comments.forEach((comment) => {
      commentsList.appendChild(createCommentItem(comment));
    });
  }

  commentsBlock.append(commentsTitle, commentsList, createCommentForm(idea.id));

  card.append(top, description, actions, commentsBlock);
  return card;
}

function getMissionCatalog() {
  const approvedMissions = loadMissionsCollection();
  const baseIdeasAsMissions = missionIdeas.slice(0, 12).map((idea) => ({
    id: `idea-${idea.id}`,
    title: idea.title,
    description: idea.description
  }));

  const merged = [...approvedMissions, ...baseIdeasAsMissions];
  const unique = [];
  const seen = new Set();

  merged.forEach((mission) => {
    if (!mission?.id || seen.has(mission.id)) {
      return;
    }

    seen.add(mission.id);
    unique.push(mission);
  });

  return unique;
}

function getCommunityUsers() {
  const users = new Set();
  const currentUsername = getCurrentUsername();

  if (currentUsername) {
    users.add(currentUsername);
  }

  missionIdeas.forEach((idea) => {
    if (idea.createdBy) {
      users.add(idea.createdBy);
    }

    idea.comments.forEach((comment) => {
      if (comment.createdBy) {
        users.add(comment.createdBy);
      }
    });
  });

  loadCompletedMissions().forEach((mission) => {
    if (mission.completedBy) {
      users.add(mission.completedBy);
    }

    mission.validations.forEach((userId) => users.add(userId));
    mission.comments.forEach((comment) => users.add(comment.createdBy));
  });

  return [...users].sort((a, b) => a.localeCompare(b, "es"));
}

function createProfileCard(username) {
  const card = document.createElement("article");
  card.className = "idea-card";

  const title = document.createElement("h3");
  title.textContent = username;

  const meta = document.createElement("div");
  meta.className = "idea-meta";
  meta.textContent = username === getCurrentUsername() ? "Tu perfil actual" : "Perfil de la comunidad";

  const missionSelect = document.createElement("select");
  missionSelect.className = "input";

  const missionCatalog = getMissionCatalog();
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Elegi una mision";
  missionSelect.appendChild(placeholder);

  missionCatalog.forEach((mission) => {
    const option = document.createElement("option");
    option.value = mission.id;
    option.textContent = mission.title;
    missionSelect.appendChild(option);
  });

  const actionButton = document.createElement("button");
  actionButton.className = "btn btn-primary btn-small";
  actionButton.type = "button";
  actionButton.textContent = "Desafiar";
  actionButton.disabled = username === getCurrentUsername();

  actionButton.addEventListener("click", () => {
    const fromUserId = getCurrentUsername();
    const missionId = missionSelect.value;

    if (!fromUserId) {
      formStatus.textContent = "Escribe tu usuario antes de mandar desafios.";
      usernameInput.focus();
      return;
    }

    if (!missionId) {
      formStatus.textContent = `Elige una mision antes de desafiar a ${username}.`;
      return;
    }

    const mission = missionCatalog.find((item) => item.id === missionId);
    if (!mission) {
      return;
    }

    persistUsername();

    const challenges = loadChallenges();
    const createdAt = new Date().toISOString();
    challenges.unshift({
      id: `challenge-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      fromUserId,
      toUserId: username,
      missionId: mission.id,
      missionTitle: mission.title,
      status: "pending",
      createdAt,
      expiresAt: new Date(Date.now() + CHALLENGE_EXPIRY_MS).toISOString(),
      penaltyApplied: false
    });

    saveChallenges(challenges);
    logActivity({
      type: "challenge_sent",
      userId: fromUserId,
      targetUserId: username,
      missionId: mission.id
    });
    missionSelect.value = "";
    formStatus.textContent = `Desafio enviado a ${username}.`;
  });

  card.append(title, meta, missionSelect, actionButton);
  return card;
}

function renderProfiles() {
  const users = getCommunityUsers();
  const currentUsername = getCurrentUsername();
  const visibleUsers = users.filter((username) => username && username !== currentUsername);

  profilesList.innerHTML = "";
  profilesCount.textContent = `${visibleUsers.length} usuarios`;

  if (visibleUsers.length === 0) {
    profilesEmpty.classList.remove("is-hidden");
    return;
  }

  profilesEmpty.classList.add("is-hidden");
  visibleUsers.forEach((username) => {
    profilesList.appendChild(createProfileCard(username));
  });
}

function createCompletedMissionCard(mission) {
  const card = document.createElement("article");
  card.className = "idea-card";

  const top = document.createElement("div");
  top.className = "idea-top";

  const copy = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = mission.texto;

  const meta = document.createElement("div");
  meta.className = "idea-meta";
  meta.textContent = `por ${mission.completedBy} · ${formatDate(mission.completedAt)} · ${mission.dificultad}`;

  copy.append(title, meta);

  const badges = document.createElement("div");
  badges.className = "idea-badges";

  const validationsBadge = document.createElement("div");
  validationsBadge.className = "vote-pill";
  validationsBadge.textContent = `${mission.validations.length} validaciones`;
  badges.appendChild(validationsBadge);

  const commentsBadge = document.createElement("div");
  commentsBadge.className = "vote-pill";
  commentsBadge.textContent = `${mission.comments.length} comentarios`;
  badges.appendChild(commentsBadge);

  if (mission.bonusGranted) {
    const bonusBadge = document.createElement("div");
    bonusBadge.className = "status-pill status-pill-bonus";
    bonusBadge.textContent = `Bonus +${RECEIVE_VALIDATION_XP} XP`;
    badges.appendChild(bonusBadge);
  }

  top.append(copy, badges);

  const actions = document.createElement("div");
  actions.className = "idea-actions";

  const validateButton = document.createElement("button");
  validateButton.className = "btn btn-primary btn-small";
  validateButton.type = "button";
  validateButton.textContent = "Validar";

  const currentUsername = getCurrentUsername();
  const ownMission = currentUsername && currentUsername === mission.completedBy;
  const alreadyValidated = currentUsername ? mission.validations.includes(currentUsername) : false;

  if (ownMission) {
    validateButton.disabled = true;
    validateButton.textContent = "Tuya";
  } else if (alreadyValidated) {
    validateButton.disabled = true;
    validateButton.textContent = "Ya validaste";
  }

  validateButton.addEventListener("click", () => {
    const username = getCurrentUsername();
    if (!username) {
      formStatus.textContent = "Escribe tu usuario antes de validar misiones.";
      usernameInput.focus();
      return;
    }

    if (username === mission.completedBy || mission.validations.includes(username)) {
      return;
    }

    persistUsername();
    mission.validations.push(username);
    awardValidationReceiverXp(mission);
    saveCompletedMissions(loadCompletedMissions().map((item) => (item.id === mission.id ? mission : item)));
    awardXpToUser(username, VALIDATION_ACTION_XP, "Validaste una mision.", "validate");
    renderCompletedMissions();
  });

  actions.append(validateButton);

  const commentsBlock = document.createElement("section");
  commentsBlock.className = "comments-block";

  const commentsTitle = document.createElement("div");
  commentsTitle.className = "comment-meta";
  commentsTitle.textContent = `Comentarios (${mission.comments.length})`;

  const commentsList = document.createElement("div");
  commentsList.className = "comments-list";

  if (mission.comments.length === 0) {
    const empty = document.createElement("div");
    empty.className = "helper-text";
    empty.textContent = "Todavia no hay comentarios.";
    commentsList.appendChild(empty);
  } else {
    mission.comments.forEach((comment) => {
      commentsList.appendChild(createCommentItem(comment));
    });
  }

  const commentForm = document.createElement("form");
  commentForm.className = "comment-form";

  const input = document.createElement("input");
  input.className = "input";
  input.type = "text";
  input.maxLength = 140;
  input.placeholder = "Comenta esta mision completada";
  input.required = true;

  const button = document.createElement("button");
  button.className = "btn btn-secondary btn-small";
  button.type = "submit";
  button.textContent = "Comentar";

  commentForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = getCurrentUsername();
    const text = input.value.trim();
    if (!username) {
      formStatus.textContent = "Escribe tu usuario antes de comentar.";
      usernameInput.focus();
      return;
    }

    if (!text) {
      return;
    }

    persistUsername();
    mission.comments.unshift({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      text,
      createdBy: username,
      createdAt: new Date().toISOString()
    });

    saveCompletedMissions(loadCompletedMissions().map((item) => (item.id === mission.id ? mission : item)));
    awardXpToUser(username, COMMENT_ACTION_XP, "Comentario enviado.", "comment");
    input.value = "";
    renderCompletedMissions();
  });

  commentForm.append(input, button);
  commentsBlock.append(commentsTitle, commentsList, commentForm);

  card.append(top, actions, commentsBlock);
  return card;
}

function renderCompletedMissions() {
  const completedMissions = loadCompletedMissions().sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );

  completedMissionsList.innerHTML = "";
  completedMissionsCount.textContent = `${completedMissions.length} completadas`;

  if (completedMissions.length === 0) {
    completedMissionsEmpty.classList.remove("is-hidden");
    return;
  }

  completedMissionsEmpty.classList.add("is-hidden");
  completedMissions.forEach((mission) => {
    completedMissionsList.appendChild(createCompletedMissionCard(mission));
  });
}

function renderIdeas() {
  const sortedIdeas = getSortedIdeas();
  ideasList.innerHTML = "";
  ideasCount.textContent = `${sortedIdeas.length} ideas`;

  if (sortedIdeas.length === 0) {
    ideasEmpty.classList.remove("is-hidden");
  } else {
    ideasEmpty.classList.add("is-hidden");
    sortedIdeas.forEach((idea) => {
      ideasList.appendChild(createIdeaCard(idea));
    });
  }

  renderProfiles();
  renderCompletedMissions();
}

function handleIdeaSubmit(event) {
  event.preventDefault();

  const username = getCurrentUsername();
  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();

  if (!username) {
    formStatus.textContent = "Necesitas un usuario para publicar una idea.";
    usernameInput.focus();
    return;
  }

  if (!title || !description) {
    formStatus.textContent = "Completa titulo y descripcion antes de enviar.";
    return;
  }

  persistUsername();

  missionIdeas.unshift({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title,
    description,
    createdBy: username,
    votes: 0,
    createdAt: new Date().toISOString(),
    approved: false,
    votedBy: [],
    comments: []
  });

  saveMissionIdeas();
  titleInput.value = "";
  descriptionInput.value = "";
  formStatus.textContent = "Idea enviada. Ya esta compitiendo por votos.";
  renderIdeas();
}

function bootstrapCommunity() {
  const savedUsername = localStorage.getItem(COMMUNITY_USER_STORAGE_KEY);
  if (savedUsername) {
    usernameInput.value = savedUsername;
  }

  ensureToast();
  renderIdeas();
  ideaForm.addEventListener("submit", handleIdeaSubmit);
  usernameInput.addEventListener("change", () => {
    persistUsername();
    renderIdeas();
  });
}

bootstrapCommunity();
