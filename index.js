// Global Configuration & API Registration Elements
const API_KEY = "aa2cbaf25fa675ca83cf1262915dd3fc";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w342";
const SUGGESTION_IMG_URL = "https://image.tmdb.org/t/p/w92";
const PLACEHOLDER =
  "https://via.placeholder.com/342x513/1a1f3a/00d4ff?text=No+Poster";

// Fixed Application Reference Point
const CURRENT_DATE = new Date("2026-06-09");

// Verified streaming mirrors (player + external open button share the same URLs)
const STREAM_MIRRORS = [
  {
    id: "server1",
    label: "VidLink (Fast)",
    movie: (id) => `https://vidlink.pro/movie/${id}`,
    tv: (id, s, e) => `https://vidlink.pro/tv/${id}/${s}/${e}`,
  },
  {
    id: "server2",
    label: "VidSrc Pro",
    movie: (id) => `https://vidsrc.to/embed/movie/${id}`,
    tv: (id, s, e) => `https://vidsrc.to/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: "server3",
    label: "2Embed",
    movie: (id) => `https://2embed.cc/embed/${id}`,
    tv: (id, s, e) => `https://2embed.cc/embedtv/${id}&s=${s}&e=${e}`,
  },
  {
    id: "server4",
    label: "MultiEmbed",
    movie: (id) => `https://multiembed.mov/?video_id=${id}&tmdb=1`,
    tv: (id, s, e) =>
      `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}`,
  },
];

function getMirrorIndexById(mirrorId) {
  const index = STREAM_MIRRORS.findIndex((mirror) => mirror.id === mirrorId);
  return index === -1 ? 0 : index;
}

function getActiveMirror() {
  return STREAM_MIRRORS[activeMirrorIndex] || STREAM_MIRRORS[0];
}

function buildStreamUrl(mirror, mediaType, mediaId, season, episode) {
  if (!mirror || !mediaId) return "#";
  return mediaType === "movie"
    ? mirror.movie(mediaId)
    : mirror.tv(mediaId, season, episode);
}

// Unified Cross-Media Mapping Table for Popular Genres
const GENRES = [
  { id: "", name: "All Genres" },
  { id: "28|12|10759", name: "Action & Adventure" },
  { id: "16", name: "Animation" },
  { id: "35", name: "Comedy" },
  { id: "18", name: "Drama" },
  { id: "14|878|10765", name: "Sci-Fi & Fantasy" },
  { id: "27", name: "Horror" },
  { id: "9648|53", name: "Mystery & Thriller" },
  { id: "10749", name: "Romance" },
];

// Application Runtime Tracking State Vectors
let activeMoviesCache = [];
let currentMediaId = null;
let currentMediaType = "movie";
let currentSeason = 1;
let currentEpisode = 1;
let currentServer = "server1";
let currentViewMode = "movie";
let cachedTrailerKey = null;
let debounceTimer = null;
let currentStatusFilter = "all";
let lastStatusLabel = "Trending Content Today";
let activeMirrorIndex = 0;

// Application DOM Mapping Registries
const headerTitle = document.getElementById("header-title");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const genreFilter = document.getElementById("genre-filter");
const statusFilter = document.getElementById("status-filter");
const movieGrid = document.getElementById("movie-grid");
const statusMessage = document.getElementById("status-message");
const spinnerContainer = document.getElementById("spinner-container");

// Autocomplete Sub-layout Element Pointer References
const suggestionsDropdown = document.getElementById("suggestions-dropdown");
const suggestionsList = document.getElementById("suggestions-list");

// Modal Component Element Registries
const videoModal = document.getElementById("video-modal");
const videoPlayer = document.getElementById("video-player");
const modalMovieTitle = document.getElementById("modal-movie-title");
const closeModalBtn = document.getElementById("close-modal");
const modalMoviePoster = document.getElementById("modal-movie-poster");
const modalMovieRating = document.getElementById("modal-movie-rating");
const modalMovieDate = document.getElementById("modal-movie-date");
const modalMovieOverview = document.getElementById("modal-movie-overview");

// Mode Switch Configuration Anchors
const toggleMovieBtn = document.getElementById("toggle-movie");
const toggleTrailerBtn = document.getElementById("toggle-trailer");
const serverSelectionWrapper = document.getElementById(
  "server-selection-wrapper",
);
const serverTogglesContainer = document.getElementById(
  "server-toggles-container",
);
const downloadButton = document.getElementById("download-button");

// TV Interactive Control Element References
const tvControlsContainer = document.getElementById("tv-controls-container");
const seasonSelect = document.getElementById("season-select");
const episodeSelect = document.getElementById("episode-select");

function initGenreFilterOptions() {
  genreFilter.innerHTML = "";
  GENRES.forEach((g) => {
    const opt = document.createElement("option");
    opt.value = g.id;
    opt.textContent = g.name;
    genreFilter.appendChild(opt);
  });
}

function checkIsUpcoming(item) {
  const dateStr = item.release_date || item.first_air_date;
  if (!dateStr) return false;
  const targetDate = new Date(dateStr);
  return targetDate > CURRENT_DATE;
}

function filterAndRenderCache() {
  let displayList = [...activeMoviesCache];
  if (currentStatusFilter === "released") {
    displayList = displayList.filter((item) => !checkIsUpcoming(item));
  } else if (currentStatusFilter === "upcoming") {
    displayList = displayList.filter((item) => checkIsUpcoming(item));
  }
  renderGridCards(displayList, lastStatusLabel);
}

async function getTrendingContent() {
  const url = `${BASE_URL}/trending/all/day?api_key=${encodeURIComponent(API_KEY)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP Error Status: ${res.status}`);
  const data = await res.json();
  return (data.results || []).filter(
    (item) => item.media_type === "movie" || item.media_type === "tv",
  );
}

async function searchAllContent(query) {
  const url = `${BASE_URL}/search/multi?api_key=${encodeURIComponent(API_KEY)}&query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Search path breakdown error: ${res.status}`);
  const data = await res.json();
  return (data.results || []).filter(
    (item) => item.media_type === "movie" || item.media_type === "tv",
  );
}

async function fetchContentByGenre(genreId) {
  if (!genreId) return await getTrendingContent();
  const movieUrl = `${BASE_URL}/discover/movie?api_key=${encodeURIComponent(API_KEY)}&with_genres=${genreId}&sort_by=popularity.desc`;
  const tvUrl = `${BASE_URL}/discover/tv?api_key=${encodeURIComponent(API_KEY)}&with_genres=${genreId}&sort_by=popularity.desc`;

  const [movieRes, tvRes] = await Promise.all([fetch(movieUrl), fetch(tvUrl)]);
  const movieData = movieRes.ok ? await movieRes.json() : { results: [] };
  const tvData = tvRes.ok ? await tvRes.json() : { results: [] };

  const movies = (movieData.results || []).map((m) => ({
    ...m,
    media_type: "movie",
  }));
  const tvShows = (tvData.results || []).map((t) => ({
    ...t,
    media_type: "tv",
  }));

  return [...movies, ...tvShows].sort((a, b) => b.popularity - a.popularity);
}

async function fetchTvDetails(id) {
  const url = `${BASE_URL}/tv/${id}?api_key=${encodeURIComponent(API_KEY)}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  return await res.json();
}

async function fetchSeasonDetails(tvId, seasonNum) {
  const url = `${BASE_URL}/tv/${tvId}/season/${seasonNum}?api_key=${encodeURIComponent(API_KEY)}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  return await res.json();
}

async function getTrailerKey(type, id) {
  const url = `${BASE_URL}/${type}/${id}/videos?api_key=${encodeURIComponent(API_KEY)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const videos = data.results || [];
    const trailer = videos.find(
      (v) =>
        v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser"),
    );
    return trailer ? trailer.key : null;
  } catch (err) {
    console.error("Trailer path error logged:", err);
    return null;
  }
}

function updatePlayerSource() {
  if (!currentMediaId) return;

  if (currentViewMode === "trailer") {
    if (cachedTrailerKey) {
      videoPlayer.src = `https://www.youtube.com/embed/${cachedTrailerKey}?autoplay=1&rel=0`;
    } else {
      videoPlayer.src = "about:blank";
      alert("Trailer link unavailable for this title.");
      setMode("movie");
    }
    return;
  }

  const mirror = STREAM_MIRRORS.find((entry) => entry.id === currentServer);
  videoPlayer.src = buildStreamUrl(
    mirror,
    currentMediaType,
    currentMediaId,
    currentSeason,
    currentEpisode,
  );
}

function setMode(mode) {
  currentViewMode = mode;
  if (mode === "movie") {
    toggleMovieBtn.className =
      "text-xs font-bold px-4 py-2 rounded-lg transition-all text-white bg-cyan-500 shadow-md";
    toggleTrailerBtn.className =
      "text-xs font-bold px-4 py-2 rounded-lg transition-all text-slate-400 hover:text-white bg-transparent";
    serverSelectionWrapper.classList.remove("hidden");
  } else {
    toggleTrailerBtn.className =
      "text-xs font-bold px-4 py-2 rounded-lg transition-all text-white bg-cyan-500 shadow-md";
    toggleMovieBtn.className =
      "text-xs font-bold px-4 py-2 rounded-lg transition-all text-slate-400 hover:text-white bg-transparent";
    serverSelectionWrapper.classList.add("hidden");
  }
  updatePlayerSource();
}

function cycleDownloadMirror() {
  activeMirrorIndex = (activeMirrorIndex + 1) % STREAM_MIRRORS.length;
  currentServer = getActiveMirror().id;
  generateServerUI();
  updatePlayerSource();
}

function updateDownloadButtonLink() {
  if (!currentMediaId) {
    downloadButton.href = "#";
    downloadButton.innerHTML = `
      <svg class="w-4 h-4 fill-none stroke-current" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
      Open Mirror
    `;
    return;
  }

  const mirror = getActiveMirror();
  downloadButton.href = buildStreamUrl(
    mirror,
    currentMediaType,
    currentMediaId,
    currentSeason,
    currentEpisode,
  );
  downloadButton.innerHTML = `
    <svg class="w-4 h-4 fill-none stroke-current" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
    Open Mirror (${mirror.label})
  `;
}

function generateServerUI() {
  serverTogglesContainer.innerHTML = "";
  activeMirrorIndex = getMirrorIndexById(currentServer);

  STREAM_MIRRORS.forEach((mirror) => {
    const btn = document.createElement("button");
    btn.textContent = mirror.label;
    btn.className =
      mirror.id === currentServer
        ? "text-xs font-bold px-3 py-2.5 rounded-xl bg-cyan-500 text-white transition-all shadow-md shadow-cyan-500/20"
        : "text-xs font-bold px-3 py-2.5 rounded-xl bg-slate-800 text-slate-400 hover:bg-slate-700/60 hover:text-white transition-all";

    btn.addEventListener("click", () => {
      if (currentServer === mirror.id) return;
      currentServer = mirror.id;
      activeMirrorIndex = getMirrorIndexById(mirror.id);
      generateServerUI();
      updatePlayerSource();
    });
    serverTogglesContainer.appendChild(btn);
  });

  const activeMirror = getActiveMirror();
  const externalBtn = document.createElement("a");
  externalBtn.href = buildStreamUrl(
    activeMirror,
    currentMediaType,
    currentMediaId,
    currentSeason,
    currentEpisode,
  );
  externalBtn.target = "_blank";
  externalBtn.rel = "noopener noreferrer";
  externalBtn.textContent = "Open Stream";
  externalBtn.className =
    "text-xs font-bold px-3 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-md shadow-purple-600/20 flex items-center justify-center gap-1 sm:col-span-2 mt-1";
  serverTogglesContainer.appendChild(externalBtn);

  updateDownloadButtonLink();
}

async function setupTvControls(tvId) {
  seasonSelect.innerHTML = "";
  episodeSelect.innerHTML = "";

  const showData = await fetchTvDetails(tvId);
  if (!showData || !showData.seasons || showData.seasons.length === 0) {
    tvControlsContainer.classList.add("hidden");
    return;
  }

  const validSeasons = showData.seasons.filter((s) => s.season_number > 0);
  validSeasons.forEach((s) => {
    const opt = document.createElement("option");
    opt.value = s.season_number;
    opt.textContent = `Season ${s.season_number} (${s.episode_count} Eps)`;
    seasonSelect.appendChild(opt);
  });

  currentSeason = validSeasons[0] ? validSeasons[0].season_number : 1;

  async function loadEpisodesForSeason(seasonNum) {
    episodeSelect.innerHTML = "";
    const seasonData = await fetchSeasonDetails(tvId, seasonNum);
    if (!seasonData || !seasonData.episodes) return;

    seasonData.episodes.forEach((ep) => {
      const opt = document.createElement("option");
      opt.value = ep.episode_number;
      opt.textContent = `Ep ${ep.episode_number}: ${ep.name || "Episode " + ep.episode_number}`;
      episodeSelect.appendChild(opt);
    });
    currentEpisode = 1;
    generateServerUI();
    updatePlayerSource();
  }

  seasonSelect.onchange = async (e) => {
    currentSeason = parseInt(e.target.value);
    await loadEpisodesForSeason(currentSeason);
  };

  episodeSelect.onchange = (e) => {
    currentEpisode = parseInt(e.target.value);
    generateServerUI();
    updatePlayerSource();
  };

  await loadEpisodesForSeason(currentSeason);
  tvControlsContainer.classList.remove("hidden");
}

async function playContentFromObject(item) {
  if (!item) return;
  if (!activeMoviesCache.some((m) => m.id === item.id)) {
    activeMoviesCache.push(item);
  }

  currentMediaId = item.id;
  currentMediaType = item.media_type || (item.title ? "movie" : "tv");
  currentServer = "server1";
  activeMirrorIndex = 0;
  currentViewMode = "movie";
  currentSeason = 1;
  currentEpisode = 1;

  cachedTrailerKey = await getTrailerKey(currentMediaType, item.id);
  setMode("movie");

  if (currentMediaType === "tv") {
    await setupTvControls(item.id);
  } else {
    tvControlsContainer.classList.add("hidden");
    generateServerUI();
  }

  const title = item.title || item.name;
  const rating =
    typeof item.vote_average === "number"
      ? item.vote_average.toFixed(1)
      : "N/A";
  const posterUrl = item.poster_path ? IMG_URL + item.poster_path : PLACEHOLDER;
  const releaseYear = (item.release_date || item.first_air_date || "N/A").split(
    "-",
  )[0];

  modalMovieTitle.textContent = title;
  modalMoviePoster.src = posterUrl;
  modalMoviePoster.alt = `${title} Poster`;
  modalMovieRating.textContent = `Score: ${rating} / 10`;
  modalMovieDate.textContent = releaseYear;
  modalMovieOverview.textContent = item.overview
    ? item.overview
    : "No summary description available.";

  videoModal.classList.remove("hidden");
  document.body.classList.add("overflow-hidden");
  suggestionsDropdown.classList.add("hidden");
}

function playContent(id, type) {
  const item = activeMoviesCache.find(
    (m) =>
      m.id === id &&
      (m.media_type === type || (!m.media_type && type === "movie")),
  );
  playContentFromObject(item);
}

function renderSuggestions(items) {
  suggestionsList.innerHTML = "";
  if (!items.length) {
    suggestionsDropdown.classList.add("hidden");
    return;
  }

  items.slice(0, 6).forEach((item) => {
    const title = item.title || item.name;
    const release_date = item.release_date || item.first_air_date;
    const typeLabel = item.media_type === "tv" ? "TV" : "Movie";
    const releaseYear = release_date ? `(${release_date.split("-")[0]})` : "";
    const rating =
      typeof item.vote_average === "number" && item.vote_average > 0
        ? `Score: ${item.vote_average.toFixed(1)}`
        : "";
    const thumbUrl = item.poster_path
      ? SUGGESTION_IMG_URL + item.poster_path
      : PLACEHOLDER;

    const row = document.createElement("div");
    row.className =
      "flex items-center gap-3 p-3 hover:bg-slate-800/80 cursor-pointer transition-colors group";
    row.innerHTML = `
      <img src="${thumbUrl}" class="w-10 h-14 object-cover rounded bg-slate-800 border border-slate-700/50 flex-shrink-0" onerror="this.src='${PLACEHOLDER}'"/>
      <div class="flex-1 min-w-0">
        <h4 class="text-white font-semibold text-sm truncate group-hover:text-cyan-400 transition-colors">${title}</h4>
        <p class="text-xs text-slate-400 mt-0.5">${releaseYear} <span class="text-slate-500 px-1 font-bold text-[10px] bg-slate-800 border border-slate-700 rounded ml-1">${typeLabel}</span> <span class="text-amber-400 font-medium ml-2">${rating}</span></p>
      </div>
    `;
    row.addEventListener("click", () => {
      searchInput.value = title;
      playContentFromObject(item);
    });
    suggestionsList.appendChild(row);
  });
  suggestionsDropdown.classList.remove("hidden");
}

function handleInputAutocomplete() {
  const query = searchInput.value.trim();
  clearTimeout(debounceTimer);
  if (!query) {
    suggestionsDropdown.classList.add("hidden");
    return;
  }
  debounceTimer = setTimeout(async () => {
    try {
      const suggestions = await searchAllContent(query);
      renderSuggestions(suggestions);
    } catch (err) {
      console.error(err);
    }
  }, 300);
}

function closeModal() {
  videoModal.classList.add("hidden");
  videoPlayer.src = "";
  currentMediaId = null;
  cachedTrailerKey = null;
  document.body.classList.remove("overflow-hidden");
}

function renderGridCards(items, labelMessage = "Trending Content Today") {
  movieGrid.innerHTML = "";
  statusMessage.textContent = labelMessage;

  if (!items.length) {
    statusMessage.textContent = `No matches found under this availability criteria.`;
    spinnerContainer.classList.add("hidden");
    return;
  }

  items.forEach((item) => {
    const { id, vote_average } = item;
    const title = item.title || item.name;
    const type = item.media_type || "movie";
    const rating =
      typeof vote_average === "number" ? vote_average.toFixed(1) : "N/A";
    const posterUrl = item.poster_path
      ? IMG_URL + item.poster_path
      : PLACEHOLDER;

    const isUpcoming = checkIsUpcoming(item);
    const badgeText = isUpcoming
      ? "UPCOMING"
      : type === "tv"
        ? "SERIES"
        : "MOVIE";
    let badgeClass = "bg-cyan-500/10 border-cyan-500/30 text-cyan-300";
    if (isUpcoming) {
      badgeClass = "bg-amber-500/20 border-amber-500/40 text-amber-300";
    } else if (type === "tv") {
      badgeClass = "bg-purple-500/20 border-purple-500/40 text-purple-300";
    }

    const card = document.createElement("div");
    card.className = "movie-card group cursor-pointer";
    card.innerHTML = `
      <div class="relative overflow-hidden rounded-xl bg-slate-800/50 border border-cyan-500/20 transition-all duration-300 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/30 hover:-translate-y-2">
        <div class="aspect-[2/3] overflow-hidden bg-slate-800 relative">
          <span class="absolute top-2 left-2 z-10 text-[10px] font-extrabold px-2 py-0.5 rounded border backdrop-blur-md ${badgeClass}">${badgeText}</span>
          <img src="${posterUrl}" onerror="this.src='${PLACEHOLDER}'" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:brightness-125" loading="lazy" />
        </div>
        <div class="p-4 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent">
          <h3 class="font-bold text-white text-sm md:text-base truncate mb-2 group-hover:text-cyan-300 transition-colors" title="${title}">${title}</h3>
          <div class="flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-3 py-1.5 w-fit">
            <svg class="w-4 h-4 fill-amber-400 text-amber-400" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <span class="text-cyan-300 font-bold text-sm">${rating}</span>
          </div>
        </div>
      </div>
    `;
    card.addEventListener("click", () => playContent(id, type));
    movieGrid.appendChild(card);
  });
  spinnerContainer.classList.add("hidden");
}

async function handleSearch(e) {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (!query) return;

  suggestionsDropdown.classList.add("hidden");
  genreFilter.value = "";
  movieGrid.innerHTML = "";
  spinnerContainer.classList.remove("hidden");
  searchButton.disabled = true;

  try {
    const data = await searchAllContent(query);
    activeMoviesCache = data;
    lastStatusLabel = `${data.length} result(s) found for "${query}"`;
    filterAndRenderCache();
  } catch (err) {
    statusMessage.textContent = "Search query execution processing failure.";
    spinnerContainer.classList.add("hidden");
  } finally {
    searchButton.disabled = false;
  }
}

async function handleGenreChange(e) {
  const targetGenreId = e.target.value;
  const targetedGenreName = e.target.options[e.target.selectedIndex].text;

  searchInput.value = "";
  suggestionsDropdown.classList.add("hidden");
  movieGrid.innerHTML = "";
  spinnerContainer.classList.remove("hidden");

  try {
    const sortedData = await fetchContentByGenre(targetGenreId);
    activeMoviesCache = sortedData;
    lastStatusLabel = targetGenreId
      ? `Displaying: ${targetedGenreName}`
      : "Trending Content Today";
    filterAndRenderCache();
  } catch (err) {
    statusMessage.textContent =
      "Error filtering entries by targeted genre index.";
    spinnerContainer.classList.add("hidden");
  }
}

function handleStatusChange(e) {
  currentStatusFilter = e.target.value;
  filterAndRenderCache();
}

async function initApp() {
  movieGrid.innerHTML = "";
  spinnerContainer.classList.remove("hidden");
  initGenreFilterOptions();
  try {
    const trending = await getTrendingContent();
    activeMoviesCache = trending;
    lastStatusLabel = "Trending Content Today";
    filterAndRenderCache();
  } catch (err) {
    statusMessage.textContent = "Catalog synchronization failed.";
    spinnerContainer.classList.add("hidden");
  }
}

searchForm.addEventListener("submit", handleSearch);
searchInput.addEventListener("input", handleInputAutocomplete);
genreFilter.addEventListener("change", handleGenreChange);
statusFilter.addEventListener("change", handleStatusChange);
closeModalBtn.addEventListener("click", closeModal);

toggleMovieBtn.addEventListener("click", () => setMode("movie"));
toggleTrailerBtn.addEventListener("click", () => setMode("trailer"));

downloadButton.addEventListener("click", (e) => {
  if (!currentMediaId || downloadButton.href === "#") {
    e.preventDefault();
  }
});

downloadButton.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  cycleDownloadMirror();
});

downloadButton.addEventListener("auxclick", (e) => {
  if (e.button === 1) {
    e.preventDefault();
    cycleDownloadMirror();
  }
});

document.addEventListener("click", (e) => {
  if (!searchForm.contains(e.target))
    suggestionsDropdown.classList.add("hidden");
});

headerTitle.addEventListener("click", () => {
  searchInput.value = "";
  genreFilter.value = "";
  statusFilter.value = "all";
  currentStatusFilter = "all";
  initApp();
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

initApp();
