// Global Configuration & API Registration Elements
const API_KEY = "aa2cbaf25fa675ca83cf1262915dd3fc";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w342";
const SUGGESTION_IMG_URL = "https://image.tmdb.org/t/p/w92";
const PLACEHOLDER =
  "https://via.placeholder.com/342x513/1a1f3a/00d4ff?text=No+Poster";

// NEW HIGH-UPTIME BACKEND MATRIX (Tested & Active Alternates)
const SERVERS = {
  server1: "https://vidlink.pro/movie", // VidLink: High uptime, bypasses strict cross-origin errors
  server2: "https://vidsrc.icu/embed/movie", // Alternative high-speed player cluster
  server3: "https://multiembed.mov/directstream.php?video_id=", // Raw cloud-locker stream distributor
  server4: "https://play.lonelil.ru/embed/movie", // Isolated off-shore mirror player network
};

// Application Runtime Tracking State Vectors
let activeMoviesCache = [];
let currentMovieId = null;
let currentServer = "server1";
let currentViewMode = "movie";
let cachedTrailerKey = null;
let debounceTimer = null;

// Application DOM Mapping Registries
const headerTitle = document.getElementById("header-title");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
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

// Asynchronously pull daily metadata records from TMDB Catalogs
async function getTrendingMovies() {
  const url = `${BASE_URL}/trending/movie/day?api_key=${encodeURIComponent(API_KEY)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP Error Status: ${res.status}`);
  const data = await res.json();
  return data.results || [];
}

// Interrogate remote search registries via TMDB API Endpoint pathways
async function searchMovies(query) {
  const url = `${BASE_URL}/search/movie?api_key=${encodeURIComponent(API_KEY)}&query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Search path breakdown error: ${res.status}`);
  const data = await res.json();
  return data.results || [];
}

// Retrieve the corresponding YouTube identifier keys for movie trailers
async function getMovieTrailerKey(id) {
  const url = `${BASE_URL}/movie/${id}/videos?api_key=${encodeURIComponent(API_KEY)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const videos = data.results || [];

    // Scan payloads for high-priority elements labeled as official trailers or teasers
    const trailer = videos.find(
      (v) =>
        v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser"),
    );
    return trailer ? trailer.key : null;
  } catch (err) {
    console.error("Trailer processing pathway anomaly logged:", err);
    return null;
  }
}

// Render player configurations smoothly inside structural viewports
function updatePlayerSource() {
  if (!currentMovieId) return;

  if (currentViewMode === "trailer") {
    if (cachedTrailerKey) {
      videoPlayer.src = `https://www.youtube.com/embed/${cachedTrailerKey}?autoplay=1&rel=0`;
    } else {
      videoPlayer.src = "about:blank";
      alert(
        "High Definition trailer link unavailable for this specific index entry.",
      );
      setMode("movie");
    }
    return;
  }

  // Inject High-Uptime Cluster source rules parameters
  if (currentServer === "server1") {
    videoPlayer.src = `${SERVERS.server1}/${currentMovieId}`;
  } else if (currentServer === "server2") {
    videoPlayer.src = `${SERVERS.server2}/${currentMovieId}`;
  } else if (currentServer === "server3") {
    videoPlayer.src = `${SERVERS.server3}${currentMovieId}`; // MultiEmbed formats queries directly
  } else if (currentServer === "server4") {
    videoPlayer.src = `${SERVERS.server4}/${currentMovieId}`;
  }
}

// Handle layout toggling between functional movie streaming streams and trailer feeds
function setMode(mode) {
  currentViewMode = mode;
  if (mode === "movie") {
    toggleMovieBtn.className =
      "text-xs font-bold px-3 py-1.5 rounded-full transition-all text-white bg-cyan-500 shadow-md shadow-cyan-500/20";
    toggleTrailerBtn.className =
      "text-xs font-bold px-3 py-1.5 rounded-full transition-all text-slate-400 hover:text-white bg-transparent";
    serverSelectionWrapper.classList.remove("hidden");
  } else {
    toggleTrailerBtn.className =
      "text-xs font-bold px-3 py-1.5 rounded-full transition-all text-white bg-cyan-500 shadow-md shadow-cyan-500/20";
    toggleMovieBtn.className =
      "text-xs font-bold px-3 py-1.5 rounded-full transition-all text-slate-400 hover:text-white bg-transparent";
    serverSelectionWrapper.classList.add("hidden");
  }
  updatePlayerSource();
}

// Assemble dynamic server connection node controls + Direct Play Link Fallback
function generateServerUI() {
  serverTogglesContainer.innerHTML = "";
  const serverNames = {
    server1: "VidLink (Fast)",
    server2: "Cloud Player",
    server3: "Direct Multi",
    server4: "Off-Shore Mix",
  };

  // Build the inline iFrame server select toggle layout interfaces
  Object.keys(SERVERS).forEach((key) => {
    const btn = document.createElement("button");
    btn.textContent = serverNames[key];
    btn.className =
      key === currentServer
        ? "text-xs font-bold px-3 py-1.5 rounded-lg bg-cyan-500 text-white transition-all shadow-md shadow-cyan-500/20"
        : "text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700/60 hover:text-white transition-all";

    btn.addEventListener("click", () => {
      if (currentServer === key) return;
      currentServer = key;
      generateServerUI();
      updatePlayerSource();
    });
    serverTogglesContainer.appendChild(btn);
  });

  // NEVER-FAIL FALLBACK: Opens stream in a separate browser window tab
  const externalBtn = document.createElement("a");
  externalBtn.href =
    currentServer === "server3"
      ? `${SERVERS.server3}${currentMovieId}`
      : `${SERVERS[currentServer]}/${currentMovieId}`;
  externalBtn.target = "_blank";
  externalBtn.textContent = "🚀 Open Stream in New Tab";
  externalBtn.className =
    "text-xs font-bold px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-md shadow-purple-600/20 flex items-center gap-1";

  serverTogglesContainer.appendChild(externalBtn);
}

// Map selected target dataset components directly into view modal nodes
async function playMovieFromObject(movie) {
  if (!movie) return;

  if (!activeMoviesCache.some((m) => m.id === movie.id)) {
    activeMoviesCache.push(movie);
  }

  currentMovieId = movie.id;
  currentServer = "server1";
  currentViewMode = "movie";

  // Asynchronously download matching YouTube trailer references in background runtime channels
  cachedTrailerKey = await getMovieTrailerKey(movie.id);

  setMode("movie");
  generateServerUI();

  const { title, poster_path, overview, vote_average, release_date } = movie;
  const rating =
    typeof vote_average === "number" ? vote_average.toFixed(1) : "N/A";
  const posterUrl = poster_path ? IMG_URL + poster_path : PLACEHOLDER;
  const releaseYear = release_date ? release_date.split("-")[0] : "N/A";

  modalMovieTitle.textContent = title;
  modalMoviePoster.src = posterUrl;
  modalMoviePoster.alt = `${title} Poster`;
  modalMovieRating.textContent = `${rating} / 10`;
  modalMovieDate.textContent = releaseYear;
  modalMovieOverview.textContent = overview
    ? overview
    : "No summary data fields available.";

  videoModal.classList.remove("hidden");
  document.body.classList.add("overflow-hidden");
  suggestionsDropdown.classList.add("hidden");
}

function playMovie(id) {
  const movie = activeMoviesCache.find((m) => m.id === id);
  playMovieFromObject(movie);
}

// Generate Live Search Dropdown nodes inside current document layouts
function renderSuggestions(movies) {
  suggestionsList.innerHTML = "";
  if (!movies.length) {
    suggestionsDropdown.classList.add("hidden");
    return;
  }

  movies.slice(0, 6).forEach((movie) => {
    const { title, poster_path, release_date, vote_average } = movie;
    const releaseYear = release_date ? `(${release_date.split("-")[0]})` : "";
    const rating =
      typeof vote_average === "number" && vote_average > 0
        ? `⭐ ${vote_average.toFixed(1)}`
        : "";
    const thumbUrl = poster_path
      ? SUGGESTION_IMG_URL + poster_path
      : PLACEHOLDER;

    const row = document.createElement("div");
    row.className =
      "flex items-center gap-3 p-3 hover:bg-slate-800/80 cursor-pointer transition-colors group";
    row.innerHTML = `
      <img src="${thumbUrl}" class="w-10 h-14 object-cover rounded bg-slate-800 border border-slate-700/50 flex-shrink-0" onerror="this.src='${PLACEHOLDER}'"/>
      <div class="flex-1 min-w-0">
        <h4 class="text-white font-semibold text-sm truncate group-hover:text-cyan-400 transition-colors">${title}</h4>
        <p class="text-xs text-slate-400 mt-0.5">${releaseYear} <span class="text-cyan-400/70 ml-2">${rating}</span></p>
      </div>
    `;

    row.addEventListener("click", () => {
      searchInput.value = title;
      playMovieFromObject(movie);
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
      const suggestions = await searchMovies(query);
      renderSuggestions(suggestions);
    } catch (err) {
      console.error(err);
    }
  }, 300);
}

function closeModal() {
  videoModal.classList.add("hidden");
  videoPlayer.src = "";
  currentMovieId = null;
  cachedTrailerKey = null;
  document.body.classList.remove("overflow-hidden");
}

// Generate functional display catalog item cards on interactive matrices
function renderMovies(movies, isSearch = false) {
  movieGrid.innerHTML = "";
  if (!movies.length) {
    statusMessage.textContent =
      "No matching movie titles discovered. Refine query keys.";
    spinnerContainer.classList.add("hidden");
    return;
  }

  statusMessage.textContent = isSearch
    ? `${movies.length} result(s) found.`
    : "Trending Movies Today";

  movies.forEach((movie) => {
    const { id, title, poster_path, vote_average } = movie;
    const rating =
      typeof vote_average === "number" ? vote_average.toFixed(1) : "N/A";
    const posterUrl = poster_path ? IMG_URL + poster_path : PLACEHOLDER;

    const card = document.createElement("div");
    card.className = "movie-card group cursor-pointer";
    card.innerHTML = `
      <div class="relative overflow-hidden rounded-xl bg-slate-800/50 border border-cyan-500/20 transition-all duration-300 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/30 hover:-translate-y-2">
        <div class="aspect-[2/3] overflow-hidden bg-slate-800">
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
    card.addEventListener("click", () => playMovie(id));
    movieGrid.appendChild(card);
  });
  spinnerContainer.classList.add("hidden");
}

async function handleSearch(e) {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (!query) return;

  suggestionsDropdown.classList.add("hidden");
  movieGrid.innerHTML = "";
  spinnerContainer.classList.remove("hidden");
  searchButton.disabled = true;

  try {
    const movies = await searchMovies(query);
    activeMoviesCache = movies;
    renderMovies(movies, true);
  } catch (err) {
    statusMessage.textContent = "Search query execution processing failure.";
    spinnerContainer.classList.add("hidden");
  } finally {
    searchButton.disabled = false;
  }
}

async function initApp() {
  movieGrid.innerHTML = "";
  spinnerContainer.classList.remove("hidden");
  try {
    const trending = await getTrendingMovies();
    activeMoviesCache = trending;
    renderMovies(trending, false);
  } catch (err) {
    statusMessage.textContent = "Catalog synchronization failed.";
    spinnerContainer.classList.add("hidden");
  }
}

// Runtime Execution Event Interceptors Assignment
searchForm.addEventListener("submit", handleSearch);
searchInput.addEventListener("input", handleInputAutocomplete);
closeModalBtn.addEventListener("click", closeModal);

toggleMovieBtn.addEventListener("click", () => setMode("movie"));
toggleTrailerBtn.addEventListener("click", () => setMode("trailer"));

document.addEventListener("click", (e) => {
  if (!searchForm.contains(e.target))
    suggestionsDropdown.classList.add("hidden");
});

headerTitle.addEventListener("click", () => {
  searchInput.value = "";
  initApp();
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

initApp();
