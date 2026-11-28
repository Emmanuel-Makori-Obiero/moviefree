// Global Configuration & API Registration Elements
const API_KEY = "aa2cbaf25fa675ca83cf1262915dd3fc";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/";
const IMG_URL = IMG_BASE + "w342";
const SUGGESTION_IMG_URL = IMG_BASE + "w92";
// Neutral grey fallback (no third-party placeholder host).
const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 9"><rect width="16" height="9" fill="#f3f3f3"/></svg>',
  );

// "Today" is the real current date (was hardcoded to 2026-06-09).
function todayStart() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}
const CURRENT_DATE = todayStart();

// Criterion declares a 600 ms debounce on its live search input.
const SEARCH_DEBOUNCE_MS = 600;
const HERO_INTERVAL_MS = 6500;

/* =====================================================================
   LEGACY STREAM PLAYER (kept functional, NOT featured in the redesign)
   Lives in this block + the #video-modal markup at the bottom of
   index.html. Open with window.moviefreeLegacyPlayer.open(item).
   ===================================================================== */
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
  {
    id: "server5",
    label: "Cinezo (No Ads)",
    movie: (id) => `https://player.cinezo.live/embed/movie/${id}`,
    tv: (id, s, e) => `https://player.cinezo.live/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: "server6",
    label: "CineSrc (No Ads)",
    movie: (id) => `https://cinesrc.st/embed/movie/${id}`,
    tv: (id, s, e) => `https://cinesrc.st/embed/tv/${id}?s=${s}&e=${e}`,
  },
  {
    id: "server7",
    label: "PeeStream (No Ads)",
    movie: (id) => `https://peestream.in/embed/?tmdbId=${id}&type=movie`,
    tv: (id, s, e) => `https://peestream.in/embed/?tmdbId=${id}&type=show&season=${s}&episode=${e}`,
  },
  {
    id: "server8",
    label: "FlaxMovies (No Ads)",
    movie: (id) => `https://flaxmovies.xyz/embed/movie/${id}`,
    tv: (id, s, e) => `https://flaxmovies.xyz/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: "server9",
    label: "MoviesAPI (No Ads)",
    movie: (id) => `https://moviesapi.to/movie/${id}`,
    tv: (id, s, e) => `https://moviesapi.to/tv/${id}-${s}-${e}`,
  },
  {
    id: "server10",
    label: "VidSrc Embed",
    movie: (id, s, e, imdbId) => `https://vidsrc-embed.ru/embed/movie/${imdbId || id}`,
    tv: (id, s, e, imdbId) => `https://vidsrc-embed.ru/embed/tv/${imdbId || id}-${s}-${e}`,
  },
  {
    id: "server11",
    label: "VidEasy",
    movie: (id) => `https://player.videasy.net/movie/${id}`,
    tv: (id, s, e) => `https://player.videasy.net/tv/${id}/${s}/${e}`,
  },
  {
    id: "server12",
    label: "111Movies",
    movie: (id) => `https://111movies.com/movie/${id}`,
    tv: (id, s, e) => `https://111movies.com/tv/${id}/${s}/${e}`,
  },
  {
    id: "server13",
    label: "VidZee",
    movie: (id) => `https://player.vidzee.wtf/embed/movie/${id}`,
    tv: (id, s, e) => `https://player.vidzee.wtf/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: "server14",
    label: "Mapple",
    movie: (id) => `https://mapple.uk/watch/movie/${id}`,
    tv: (id, s, e) => `https://mapple.uk/watch/tv/${id}-${s}-${e}`,
  },
  {
    id: "server15",
    label: "PrimeSrc",
    movie: (id, s, e, imdbId) => `https://primesrc.me/embed/movie?imdb=${imdbId || id}`,
    tv: (id, s, e, imdbId) => `https://primesrc.me/embed/tv?imdb=${imdbId || id}&season=${s}&episode=${e}`,
  },
  {
    id: "server16",
    label: "AutoEmbed",
    movie: (id) => `https://player.autoembed.cc/embed/movie/${id}`,
    tv: (id, s, e) => `https://player.autoembed.cc/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: "server17",
    label: "VixSrc",
    movie: (id) => `https://vixsrc.to/movie/${id}`,
    tv: (id, s, e) => `https://vixsrc.to/tv/${id}/${s}/${e}`,
  },
  {
    id: "server18",
    label: "VidLove",
    movie: (id) => `https://player.vidlove.cc/embed/movie/${id}`,
    tv: (id, s, e) => `https://player.vidlove.cc/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: "server19",
    label: "VidFast",
    movie: (id) => `https://vidfast.vc/movie/${id}`,
    tv: (id, s, e) => `https://vidfast.vc/tv/${id}/${s}/${e}`,
  },
  {
    id: "server20",
    label: "Filmu",
    movie: (id) => `https://embed.filmu.in/movie/${id}`,
    tv: (id, s, e) => `https://embed.filmu.in/tv/${id}/${s}/${e}`,
  },
  {
    id: "server21",
    label: "VidCore",
    movie: (id) => `https://vidcore.net/movie/${id}`,
    tv: (id, s, e) => `https://vidcore.net/tv/${id}/${s}/${e}?theme=%23E50914`,
  },
  {
    id: "server22",
    label: "VAPlayer",
    movie: (id) => `https://vaplayer.ru/embed/movie/${id}?skin=netflix&color=ff0000`,
    tv: (id, s, e) => `https://vaplayer.ru/embed/tv/${id}/${s}/${e}?skin=netflix&color=ff0000`,
  },
  {
    id: "server23",
    label: "Vares",
    movie: (id) => `https://vares.app/movie/${id}`,
    tv: (id, s, e) => `https://vares.app/tv/${id}/${s}/${e}`,
  },
  {
    id: "server24",
    label: "VidKing",
    movie: (id) => `https://www.vidking.net/embed/movie/${id}`,
    tv: (id, s, e) => `https://www.vidking.net/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: "server25",
    label: "VidBolt",
    movie: (id) => `https://vidbolt.xyz/movie/${id}`,
    tv: (id, s, e) => `https://vidbolt.xyz/tv/${id}/${s}/${e}`,
  },
  {
    id: "server26",
    label: "VidNest",
    movie: (id) => `https://vidnest.fun/movie/${id}`,
    tv: (id, s, e) => `https://vidnest.fun/tv/${id}/${s}/${e}`,
  },
  {
    id: "server27",
    label: "VidSrc.su",
    movie: (id) => `https://vidsrc.su/movie/${id}?autoplay=true&colour=E50914`,
    tv: (id, s, e) => `https://vidsrc.su/tv/${id}/${s}/${e}?autoplay=true&colour=E50914`,
  },
  {
    id: "server28",
    label: "VidGod",
    movie: (id) => `https://vidgod.net/movie/${id}`,
    tv: (id, s, e) => `https://vidgod.net/tv/${id}/${s}/${e}`,
  },
  {
    id: "server29",
    label: "VidSrc.me",
    movie: (id) => `https://vidsrc.me/embed/movie?tmdb=${id}`,
    tv: (id, s, e) => `https://vidsrc.me/embed/tv?tmdb=${id}&season=${s}&episode=${e}`,
  },
  {
    id: "server30",
    label: "1Embed",
    movie: (id) => `https://1embed.cc/embed/movie/${id}`,
    tv: (id, s, e) => `https://1embed.cc/embed/tv/${id}/${s}/${e}`,
  },
];

function getMirrorIndexById(mirrorId) {
  const index = STREAM_MIRRORS.findIndex((mirror) => mirror.id === mirrorId);
  return index === -1 ? 0 : index;
}

function getActiveMirror() {
  return STREAM_MIRRORS[activeMirrorIndex] || STREAM_MIRRORS[0];
}

function buildStreamUrl(mirror, mediaType, mediaId, season, episode, imdbId) {
  if (!mirror || !mediaId) return "#";
  return mediaType === "movie"
    ? mirror.movie(mediaId, season, episode, imdbId)
    : mirror.tv(mediaId, season, episode, imdbId);
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

// Official broadcaster channels with free YouTube live streams.
const LIVE_CHANNELS = [
  { id: "citizen-tv", name: "Citizen TV", source: "Official YouTube", youtubeChannelId: "UChBQgieUidXV1CmDxSdRm3g", image: "https://yt3.googleusercontent.com/wj5XPSPtxg2oy9kdzdfRFRtyebgfB5mirkM8QmLR0TFqdzxga7iSWImBZo0DyQQ16zUvmDHr=s900-c-k-c0x00ffffff-no-rj", embedUrl: "https://citizen.digital/tv/citizen-tv-15", fallbackUrl: "https://citizen.digital/tv/citizen-tv-15" },
  { id: "ktn-news", name: "KTN News", source: "Official Dacast", youtubeChannelId: "UCKVsdeoHExltrWMuK0hOWmg", image: "https://yt3.googleusercontent.com/_mzOQ0PLJxAi8imGLd7sICwGcIN5sDxisZgMftoM4FW0_UuRRGHGCmcWhv8cqPqPcVQcpVKh=s900-c-k-c0x00ffffff-no-rj", embedUrl: "https://iframe.dacast.com/live/4cce2c4f-8e53-6687-c787-7fd4a00a24ad/26ad416e-bb72-9988-625c-5e6243e4ded1?autoplay=1", fallbackUrl: "https://www.standardmedia.co.ke/ktnnews/live" },
  { id: "ntv-kenya", name: "NTV Kenya", source: "Official YouTube", youtubeChannelId: "UCqBJ47FjJcl61fmSbcadAVg", image: "https://yt3.googleusercontent.com/BXqMO9VfeJGnU-D-0jdB-jVrbYXqFN4QX0ipmbF2QNKdy5nH6QZ3Sc4n0KIsOxbdXuTwGdGWfw=s900-c-k-c0x00ffffff-no-rj", embedUrl: "https://www.youtube.com/embed/6Qj6kqBhflc?autoplay=1&enablejsapi=1&loop=1", fallbackUrl: "https://ntvkenya.co.ke/live/ntv-kenya-livestream/" },
  { id: "tv47-kenya", name: "TV47 Kenya", source: "Official YouTube", youtubeChannelId: "UC_zA9UIWE1fB-jfFk_DBSYw", image: "https://yt3.googleusercontent.com/f-VHwTo8tlpmtZMJ4DOciWdcq9skkl2fDzn607b8e90tdGv4pupJh5YzXSD94n8czr6i9Mhs=s900-c-k-c0x00ffffff-no-rj", fallbackUrl: "https://www.tv47.digital/live-tv/" },
  { id: "kbc-channel-1", name: "KBC Channel 1", source: "Official Castr", youtubeChannelId: "UCypNjM5hP1qcUqQZe57jNfg", image: "https://yt3.googleusercontent.com/1fX-2HVqG-T8AaWdFKOJQ_L_JRupPb0ggP3ZrGqAq1i3CYry-vznzX9lbbg5zl0o2gCGzlYkQs8=s900-c-k-c0x00ffffff-no-rj", embedUrl: "https://player.castr.com/live_5414b5e06f2211f09948b13d179eaf9a", fallbackUrl: "https://www.kbc.co.ke/live/" },
  { id: "k24-tv", name: "K24TV", source: "Official YouTube", youtubeChannelId: "UCt3SE-Mvs3WwP7UW-PiFdqQ", image: "https://yt3.googleusercontent.com/CnPgPD_was9jSpyXOE3IEuuEtBAhyebPtXFoFb0WaIc3mrZSwT8snPU5yQtueoGpFDtTM-7U9A=s900-c-k-c0x00ffffff-no-rj", fallbackUrl: "https://k24.digital/" },
  { id: "inooro-tv", name: "iNooro TV", source: "Official Citizen", youtubeChannelId: "UCZlNMLTVNxzwB0axilK-rDw", image: "https://yt3.googleusercontent.com/-7KyJe8abxH2UV5egD5fd9VNT2BI-nHnJJT9JCVcSrzJeIcD2DrkSaBt4waEzlXByeazYqUBXHU=s900-c-k-c0x00ffffff-no-rj", embedUrl: "https://citizen.digital/tv/inooro-tv-live-14", fallbackUrl: "https://citizen.digital/tv/inooro-tv-live-14" },
];

const INTERNATIONAL_CHANNELS = [
  { id: "cnn-international", name: "CNN International", source: "Official YouTube", youtubeChannelId: "UCupvZG-5ko_eiXAupbDfxWw", image: "https://yt3.googleusercontent.com/wSqAf5WdxsGsl7ZMtlyfz3qKULo_URoFjmKky0gLThm_Jtu2wsVHMu-XzGZPAb-z8zeMBYUUMYA=s900-c-k-c0x00ffffff-no-rj", fallbackUrl: "https://edition.cnn.com/watch/cnn-stream" },
  { id: "bbc-news", name: "BBC News", source: "Official YouTube", youtubeChannelId: "UC16niRr50-MSBwiO3YDb3RA", image: "https://yt3.googleusercontent.com/v4JamQ9B-PUiJHjmZQs9UwTaoLQW8vijJMMpV5QvA2wHQ6iwWM8Q1s6O4jgTl0dtDigVWAi7SA=s900-c-k-c0x00ffffff-no-rj", fallbackUrl: "https://www.bbc.com/watch-live-news" },
  { id: "al-jazeera-english", name: "Al Jazeera English", source: "Official YouTube", youtubeChannelId: "UCNye-wNBqNL5ZzHSJj3l8Bg", image: "https://yt3.googleusercontent.com/XsTga3Nsfc1E6ZgC6HfHfzTG_3zhuZleOnsKxSK2aILMjwkkIm-0vdALFaU-yt0Lw07iLtbSifk=s900-c-k-c0x00ffffff-no-rj", fallbackUrl: "https://www.aljazeera.com/video/live/" },
  { id: "france-24-english", name: "France 24 English", source: "Official YouTube", youtubeChannelId: "UCQfwfsi5VrQ8yKZ-UWmAEFg", image: "https://yt3.googleusercontent.com/ytc/AIdro_n_QTJ5-GLGnftQFkb7Kp36W2eBH3H-7ZqTQxzFkkqGrIE=s900-c-k-c0x00ffffff-no-rj", fallbackUrl: "https://www.france24.com/en/live" },
];

function liveChannelUrl(channel) {
  const params = new URLSearchParams({
    channel: channel.youtubeChannelId,
    autoplay: "1",
    mute: "1",
    playsinline: "1",
    rel: "0",
    controls: "1",
  });
  return `https://www.youtube-nocookie.com/embed/live_stream?${params}`;
}
function liveChannelPageUrl(channel) {
  return `https://www.youtube.com/channel/${encodeURIComponent(channel.youtubeChannelId)}/live`;
}

// Legacy player state
let currentMediaId = null;
let currentMediaType = "movie";
let currentSeason = 1;
let currentEpisode = 1;
let currentServer = "server1";
let currentViewMode = "movie";
let cachedTrailerKey = null;
let activeMirrorIndex = 0;

const videoModal = document.getElementById("video-modal");
const videoPlayer = document.getElementById("video-player");
const modalMovieTitle = document.getElementById("modal-movie-title");
const closeModalBtn = document.getElementById("close-modal");
const modalMoviePoster = document.getElementById("modal-movie-poster");
const modalMovieRating = document.getElementById("modal-movie-rating");
const modalMovieDate = document.getElementById("modal-movie-date");
const modalMovieOverview = document.getElementById("modal-movie-overview");
const toggleMovieBtn = document.getElementById("toggle-movie");
const toggleTrailerBtn = document.getElementById("toggle-trailer");
const serverSelectionWrapper = document.getElementById("server-selection-wrapper");
const serverTogglesContainer = document.getElementById("server-toggles-container");
const downloadButton = document.getElementById("download-button");
const tvControlsContainer = document.getElementById("tv-controls-container");
const seasonSelect = document.getElementById("season-select");
const episodeSelect = document.getElementById("episode-select");

function updatePlayerSource() {
  if (!currentMediaId) return;
  if (currentViewMode === "trailer") {
    if (cachedTrailerKey) {
      videoPlayer.src = `https://www.youtube.com/embed/${encodeURIComponent(cachedTrailerKey)}?autoplay=1&rel=0`;
    } else {
      videoPlayer.src = "about:blank";
      alert("Trailer link unavailable for this title.");
      setMode("movie");
    }
    return;
  }
  const mirror = STREAM_MIRRORS.find((entry) => entry.id === currentServer);
  videoPlayer.src = buildStreamUrl(mirror, currentMediaType, currentMediaId, currentSeason, currentEpisode);
}

function setMode(mode) {
  currentViewMode = mode;
  const on = "text-xs font-bold px-4 py-2 rounded-lg transition-all text-white bg-cyan-500 shadow-md";
  const off = "text-xs font-bold px-4 py-2 rounded-lg transition-all text-slate-400 hover:text-white bg-transparent";
  toggleMovieBtn.className = mode === "movie" ? on : off;
  toggleTrailerBtn.className = mode === "movie" ? off : on;
  serverSelectionWrapper.classList.toggle("hidden", mode !== "movie");
  updatePlayerSource();
}

function cycleDownloadMirror() {
  activeMirrorIndex = (activeMirrorIndex + 1) % STREAM_MIRRORS.length;
  currentServer = getActiveMirror().id;
  generateServerUI();
  updatePlayerSource();
}

function updateDownloadButtonLink() {
  const icon = `<svg class="w-4 h-4 fill-none stroke-current" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>`;
  if (!currentMediaId) {
    downloadButton.href = "#";
    downloadButton.innerHTML = `${icon} Open Mirror`;
    return;
  }
  const mirror = getActiveMirror();
  downloadButton.href = buildStreamUrl(mirror, currentMediaType, currentMediaId, currentSeason, currentEpisode);
  downloadButton.innerHTML = `${icon} Open Mirror (${esc(mirror.label)})`;
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
  const externalBtn = document.createElement("a");
  externalBtn.href = buildStreamUrl(getActiveMirror(), currentMediaType, currentMediaId, currentSeason, currentEpisode);
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
  const rating = typeof item.vote_average === "number" ? item.vote_average.toFixed(1) : "N/A";
  modalMovieTitle.textContent = title;
  modalMoviePoster.src = item.poster_path ? IMG_URL + item.poster_path : PLACEHOLDER;
  modalMoviePoster.alt = `${title} Poster`;
  modalMovieRating.textContent = `Score: ${rating} / 10`;
  modalMovieDate.textContent = (item.release_date || item.first_air_date || "N/A").split("-")[0];
  modalMovieOverview.textContent = item.overview ? item.overview : "No summary description available.";
  videoModal.classList.remove("hidden");
  document.body.classList.add("overflow-hidden");
}

function closeModal() {
  if (videoModal.classList.contains("hidden")) return;
  videoModal.classList.add("hidden");
  videoPlayer.src = "";
  currentMediaId = null;
  cachedTrailerKey = null;
  document.body.classList.remove("overflow-hidden");
}

closeModalBtn.addEventListener("click", closeModal);
toggleMovieBtn.addEventListener("click", () => setMode("movie"));
toggleTrailerBtn.addEventListener("click", () => setMode("trailer"));
downloadButton.addEventListener("click", (e) => {
  if (!currentMediaId || downloadButton.href === "#") e.preventDefault();
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
window.moviefreeLegacyPlayer = { open: playContentFromObject, close: closeModal };
/* ======================= END LEGACY STREAM PLAYER ======================= */

/* ============================== UTILITIES ============================== */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function esc(value) {
  return String(value ?? "").replace(/[&<>"'`]/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "`": "&#96;",
  })[c]);
}

function highlight(text, query) {
  const tokens = String(query || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (!tokens.length) return esc(text);
  const re = new RegExp(`(${tokens.join("|")})`, "ig");
  return String(text ?? "")
    .split(re)
    .map((part, i) => (i % 2 ? `<mark>${esc(part)}</mark>` : esc(part)))
    .join("");
}

function img(size, path) {
  return path ? IMG_BASE + size + path : "";
}

function parseLocalDate(str) {
  if (!str) return null;
  const [y, m, d] = String(str).split("-").map(Number);
  if (!y) return null;
  return new Date(y, (m || 1) - 1, d || 1);
}

function fmtDate(str) {
  const d = parseLocalDate(str);
  return d ? d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase() : "";
}

function yearOf(item) {
  return (item.release_date || item.first_air_date || "").slice(0, 4);
}

function titleOf(item) {
  return item.title || item.name || "Untitled";
}

function typeOf(item) {
  if (item.media_type) return item.media_type;
  return item.title !== undefined ? "movie" : "tv";
}

function hrefOf(item) {
  return `?${typeOf(item)}=${item.id}`;
}

function checkIsUpcoming(item) {
  const d = parseLocalDate(item.release_date || item.first_air_date);
  return d ? d > todayStart() : false;
}

function truncate(text, n) {
  const s = String(text || "");
  return s.length > n ? s.slice(0, n).replace(/\s+\S*$/, "") + "…" : s;
}

const store = {
  get(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable */
    }
  },
};

/* ============================== TMDB DATA ============================== */
const requestCache = new Map();
async function tmdb(path, params = {}) {
  const qs = new URLSearchParams({ api_key: API_KEY, language: "en-US", ...params });
  const url = `${BASE_URL}${path}?${qs.toString()}`;
  if (requestCache.has(url)) return requestCache.get(url);
  const p = fetch(url).then((res) => {
    if (!res.ok) throw new Error(`TMDB request failed (${res.status})`);
    return res.json();
  });
  requestCache.set(url, p);
  p.catch(() => requestCache.delete(url));
  return p;
}

const withType = (type) => (list) => (list || []).map((x) => ({ ...x, media_type: x.media_type || type }));

async function getTrendingContent() {
  const data = await tmdb("/trending/all/day");
  return (data.results || []).filter((item) => item.media_type === "movie" || item.media_type === "tv");
}

async function searchAllContent(query, page = 1) {
  return tmdb("/search/multi", { query, page, include_adult: "false" });
}

// Server-side date bounds for the availability filter (client-side checkIsUpcoming still applies).
function isoDay(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function statusParams(status, type) {
  const today = todayStart();
  const tomorrow = new Date(today.getTime() + 864e5);
  const key = type === "tv" ? "first_air_date" : "primary_release_date";
  if (status === "upcoming") return { [`${key}.gte`]: isoDay(tomorrow) };
  if (status === "released") return { [`${key}.lte`]: isoDay(today) };
  return {};
}

async function fetchContentByGenre(genreId, page = 1, status = "all") {
  if (!genreId) return await getTrendingContent();
  const [movieData, tvData] = await Promise.all([
    tmdb("/discover/movie", { with_genres: genreId, sort_by: "popularity.desc", page, ...statusParams(status, "movie") }).catch(() => ({ results: [] })),
    tmdb("/discover/tv", { with_genres: genreId, sort_by: "popularity.desc", page, ...statusParams(status, "tv") }).catch(() => ({ results: [] })),
  ]);
  return [...withType("movie")(movieData.results), ...withType("tv")(tvData.results)].sort(
    (a, b) => b.popularity - a.popularity,
  );
}

async function fetchTvDetails(id) {
  try {
    return await tmdb(`/tv/${id}`);
  } catch {
    return null;
  }
}

async function fetchExternalIds(type, id) {
  try {
    const data = await tmdb(`/${type}/${id}/external_ids`);
    return data && data.imdb_id ? data.imdb_id : "";
  } catch {
    return "";
  }
}

async function fetchSeasonDetails(tvId, seasonNum) {
  try {
    return await tmdb(`/tv/${tvId}/season/${seasonNum}`);
  } catch {
    return null;
  }
}

function pickTrailer(videos) {
  const yt = (videos || []).filter((v) => v.site === "YouTube");
  return (
    yt.find((v) => v.type === "Trailer" && v.official) ||
    yt.find((v) => v.type === "Trailer") ||
    yt.find((v) => v.type === "Teaser") ||
    null
  );
}

async function getTrailerKey(type, id) {
  try {
    const data = await tmdb(`/${type}/${id}/videos`);
    const t = pickTrailer(data.results);
    return t ? t.key : null;
  } catch {
    return null;
  }
}

let genreNames = {};
async function loadGenreNames() {
  try {
    const [m, t] = await Promise.all([tmdb("/genre/movie/list"), tmdb("/genre/tv/list")]);
    [...(m.genres || []), ...(t.genres || [])].forEach((g) => (genreNames[g.id] = g.name));
  } catch {
    genreNames = {};
  }
}
function firstGenre(item) {
  const id = (item.genre_ids || [])[0];
  return id && genreNames[id] ? genreNames[id] : "";
}

/* ============================== WATCHLIST / RECENT (localStorage only) ============================== */
const WATCH_KEY = "moviefree:watchlist";
const RECENT_KEY = "moviefree:recent";
const slim = (item) => ({
  id: item.id,
  media_type: typeOf(item),
  title: item.title,
  name: item.name,
  backdrop_path: item.backdrop_path,
  poster_path: item.poster_path,
  release_date: item.release_date,
  first_air_date: item.first_air_date,
});
const itemIndex = new Map();
const keyOf = (item) => `${typeOf(item)}:${item.id}`;
function remember(items) {
  (items || []).forEach((it) => it && it.id && itemIndex.set(keyOf(it), it));
  return items;
}
function getWatchlist() {
  return store.get(WATCH_KEY, []);
}
function isSaved(type, id) {
  return getWatchlist().some((x) => x.media_type === type && String(x.id) === String(id));
}
function toggleSaved(item) {
  const list = getWatchlist();
  const type = typeOf(item);
  const i = list.findIndex((x) => x.media_type === type && String(x.id) === String(item.id));
  if (i >= 0) list.splice(i, 1);
  else list.unshift(slim(item));
  store.set(WATCH_KEY, list);
  updateWatchBadge();
  return i < 0;
}
function updateWatchBadge() {
  const n = getWatchlist().length;
  $$("[data-watch-count]").forEach((b) => {
    b.textContent = n;
    b.classList.toggle("hidden", !n);
  });
}
function pushRecent(item) {
  const list = store.get(RECENT_KEY, []).filter((x) => !(x.media_type === typeOf(item) && x.id === item.id));
  list.unshift(slim(item));
  store.set(RECENT_KEY, list.slice(0, 24));
}

/* ============================== ICONS ============================== */
const ICON = {
  play: `<svg width="56" height="64" viewBox="0 0 56 64" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M1 1.8 54.5 32 1 62.2z"/></svg>`,
  playXs: `<svg width="10" height="12" viewBox="0 0 56 64" fill="currentColor" aria-hidden="true"><path d="M1 1.8 54.5 32 1 62.2z"/></svg>`,
  heart: `<svg width="66" height="58" viewBox="0 0 66 58" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M33 56S1.5 37 1.5 17.5C1.5 8.5 8.6 1.5 17.4 1.5c6.6 0 12 3.8 15.6 9.8 3.6-6 9-9.8 15.6-9.8 8.8 0 15.9 7 15.9 16 0 19.5-31.5 38.5-31.5 38.5z"/></svg>`,
  left: `<svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M11 6H1.5M5.5 2 1.5 6l4 4"/></svg>`,
  right: `<svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M1 6h9.5M6.5 2l4 4-4 4"/></svg>`,
  arrowLong: `<svg width="40" height="22" viewBox="0 0 40 22" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M0 11h38M28 1l10 10-10 10"/></svg>`,
  ne: `<svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 9l6-6M4 3h5v5"/></svg>`,
  next: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3 12h17M14 6l6 6-6 6"/></svg>`,
  prev: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M21 12H4M10 6l-6 6 6 6"/></svg>`,
  watch: `<svg width="12" height="14" viewBox="0 0 56 64" fill="currentColor" aria-hidden="true"><path d="M2 2 55 32 2 62z"/></svg>`,
  plus: `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M6 0v12M0 6h12"/></svg>`,
};

/* ============================== CARD BUILDERS (NEON) ============================== */
function chipFor(item, ctx = {}) {
  const type = typeOf(item);
  if (ctx.chip === false) return "";
  if (ctx.chip) return ctx.chip;
  if (checkIsUpcoming(item)) {
    const date = fmtDate(item.release_date || item.first_air_date);
    return type === "tv" ? `Premieres ${date}` : `In Theaters ${date}`;
  }
  if (ctx.nowPlaying && ctx.nowPlaying.has(item.id)) return "In Theaters";
  if (type === "tv" && ctx.markTv) return "Series";
  return "";
}

function stillSrc(item, big) {
  if (item.backdrop_path) return img(big ? "w1280" : "w780", item.backdrop_path);
  if (item.poster_path) return img("w780", item.poster_path);
  return PLACEHOLDER;
}

// Phones keep the small TMDB files via sizes=; 4K and retina displays can pick original.
function tmdbSrcset(path, entries, sizes) {
  if (!path) return "";
  const list = entries.map(([size, w]) => `${img(size, path)} ${w}w`).join(", ");
  return `srcset="${list}" sizes="${sizes}"`;
}

function cardHTML(item, opts = {}) {
  remember([item]);
  const title = titleOf(item);
  const chip = chipFor(item, opts);
  const size = opts.size || "";
  const big = size === "xl" || size === "hero";
  const src = stillSrc(item, big);
  const cardSizes = size === "hero" ? "(max-width: 767px) 90vw, 89vw" : size === "xl" ? "(max-width: 767px) 86vw, 48vw" : "(max-width: 767px) 78vw, 30vw";
  const srcset = item.backdrop_path
    ? tmdbSrcset(item.backdrop_path, [["w780", 780], ["w1280", 1280], ["original", 3840]], cardSizes)
    : "";
  const rating = opts.rating && item.vote_average ? `<span class="rt" aria-label="TMDB score">${item.vote_average.toFixed(1)}</span>` : "";
  const sub = opts.sub ? `<div class="card-t-sub">${esc(opts.sub(item))}</div>` : "";
  const bigTitle = size === "hero" ? `<div class="card-bigtitle display">${esc(title)}</div>` : "";
  const play =
    size === "hero"
      ? `<button type="button" class="card-play" data-action="trailer" data-type="${typeOf(item)}" data-id="${item.id}" data-title="${esc(title)}" aria-label="Play trailer: ${esc(title)}">${ICON.play}</button>`
      : "";
  const year = yearOf(item);
  const watch =
    size !== "hero" && !checkIsUpcoming(item)
      ? `<button type="button" class="card-watch" ${watchAttrs(item)} aria-label="Watch now: ${esc(title)}">${ICON.watch}</button>`
      : "";
  return `
    <div class="card ${size ? "card--" + size : ""}">
      <a href="${hrefOf(item)}" data-link class="block">
        <div class="card-media">
          ${chip ? `<span class="card-chip">${esc(chip)}</span>` : ""}
          <img src="${src}" ${srcset} alt="" loading="lazy" decoding="async" />
          ${bigTitle}
        </div>
        ${size === "hero" ? "" : `<div class="card-t">${esc(title)}${rating}</div>${sub}`}
      </a>
      ${play}${watch}
    </div>`;
}
// Phones get w780 (Lighthouse mobile ~412px @1.75x); big screens w1280 / original.
function heroSrcset(path) {
  return `${img("w780", path)} 780w, ${img("w1280", path)} 1280w, ${img("original", path)} 3840w`;
}
let heroPreload = null;
function preloadHero(path) {
  if (heroPreload) heroPreload.remove();
  heroPreload = Object.assign(document.createElement("link"), { rel: "preload", as: "image" });
  heroPreload.setAttribute("imagesrcset", heroSrcset(path));
  heroPreload.setAttribute("imagesizes", "100vw");
  heroPreload.setAttribute("fetchpriority", "high");
  document.head.appendChild(heroPreload);
}
// Hero title size tier by length (chars): base, >18, >30, >45. fitDisplay() then guarantees <= 2 lines.
function titleTier(t) {
  const n = String(t || "").length;
  return n > 45 ? "ht-xxl" : n > 30 ? "ht-xl" : n > 18 ? "ht-l" : "";
}
const HEART_SM = `<svg width="18" height="16" viewBox="0 0 66 58" fill="none" stroke="currentColor" stroke-width="4" aria-hidden="true"><path d="M33 56S1.5 37 1.5 17.5C1.5 8.5 8.6 1.5 17.4 1.5c6.6 0 12 3.8 15.6 9.8 3.6-6 9-9.8 15.6-9.8 8.8 0 15.9 7 15.9 16 0 19.5-31.5 38.5-31.5 38.5z"/></svg>`;
function saveBtn(item, action, focusable) {
  const on = isSaved(typeOf(item), item.id);
  return `<button type="button" class="cta-save${on ? " is-saved" : ""}" data-action="${action}" data-type="${typeOf(item)}" data-id="${item.id}" aria-pressed="${on}" aria-label="${on ? "Remove from" : "Add to"} watchlist: ${esc(titleOf(item))}" ${focusable ? "" : 'tabindex="-1"'}>${HEART_SM}</button>`;
}
function syncSaveButtons() {
  $$(".cta-save").forEach((b) => {
    const on = isSaved(b.dataset.type, b.dataset.id);
    b.classList.toggle("is-saved", on);
    b.setAttribute("aria-pressed", String(on));
    b.setAttribute("aria-label", b.getAttribute("aria-label").replace(/^(Add to|Remove from)/, on ? "Remove from" : "Add to"));
  });
}
function watchAttrs(item, extra = "") {
  return `data-action="watch" data-type="${typeOf(item)}" data-id="${item.id}" data-title="${esc(titleOf(item))}"${extra}`;
}

function portraitHTML(person, sub) {
  const shot = person.profile_path
    ? tmdbSrcset(person.profile_path, [["w185", 185], ["w342", 342], ["h632", 632], ["original", 1000]], "(max-width: 767px) 42vw, (min-width: 2560px) 360px, (min-width: 1920px) 280px, 168px")
    : "";
  return `
    <div class="card card--portrait">
      <a href="?person=${person.id}" data-link class="block">
        <div class="card-media"><img src="${person.profile_path ? img("w342", person.profile_path) : PLACEHOLDER}" ${shot} alt="" loading="lazy" decoding="async" /></div>
        <div class="card-t">${esc(person.name)}</div>
        ${sub ? `<div class="card-t-sub">${esc(sub)}</div>` : ""}
      </a>
    </div>`;
}

let rowSeq = 0;
function rowSection(title, cardsHTML, { link, id, arrows = true } = {}) {
  const rid = id || `row-${++rowSeq}`;
  return `
    <section class="sec" aria-labelledby="${rid}-h">
      <div class="sec-head">
        <h2 id="${rid}-h" class="sec-title display">${esc(title)}</h2>
        ${
          arrows
            ? `<div class="sec-arrows"><button class="arrow-btn" type="button" data-action="row-prev" data-row="${rid}" aria-label="Previous: ${esc(title)}" disabled>${ICON.left}</button><button class="arrow-btn" type="button" data-action="row-next" data-row="${rid}" aria-label="Next: ${esc(title)}">${ICON.right}</button></div>`
            : ""
        }
        ${link ? `<a class="sec-link" href="${link}" data-link>View All</a>` : ""}
      </div>
      <div class="row" id="${rid}">${cardsHTML}</div>
    </section>`;
}

// Shrink a display title until its longest word fits its box (no mid-word breaks, no overflow).
// Hero titles also get at most 2 lines, and the whole hero copy (chip, title, tagline, actions)
// must fit between the navbar and the dots row.
function fitDisplay(root = document) {
  $$(".hero-title, .card-bigtitle, .pg-title, .sec-title", root).forEach((el) => {
    el.style.fontSize = "";
    if (!el.clientWidth) return;
    const isHero = el.classList.contains("hero-title");
    const copy = isHero ? el.closest(".hero-copy") : null;
    let size = parseFloat(getComputedStyle(el).fontSize);
    const min = isHero ? 28 : 22;
    const tooBig = () => {
      if (el.scrollWidth > el.clientWidth + 1) return true;
      if (!isHero) return false;
      const lh = parseFloat(getComputedStyle(el).lineHeight) || size * 0.9;
      if (el.offsetHeight > lh * 2 + 2) return true;
      if (copy) {
        const gap = parseFloat(getComputedStyle(copy).rowGap) || 0;
        const kids = [...copy.children].filter((k) => k.offsetParent !== null);
        const need = kids.reduce((h, k) => h + k.offsetHeight, 0) + gap * Math.max(0, kids.length - 1);
        if (need > copy.clientHeight + 1) return true;
      }
      return false;
    };
    let guard = 0;
    while (tooBig() && size > min && guard++ < 50) {
      size = Math.max(min, size * 0.94);
      el.style.fontSize = size + "px";
    }
  });
}
function wireRows(root) {
  requestAnimationFrame(() => fitDisplay(root));
  if (document.fonts && document.fonts.status !== "loaded") document.fonts.ready.then(() => fitDisplay(root));
  $$(".row", root).forEach((row) => {
    const update = () => {
      const prev = $(`[data-action="row-prev"][data-row="${row.id}"]`);
      const next = $(`[data-action="row-next"][data-row="${row.id}"]`);
      if (prev) prev.disabled = row.scrollLeft <= 4;
      if (next) next.disabled = row.scrollLeft + row.clientWidth >= row.scrollWidth - 4;
    };
    if (!row.dataset.wired) {
      row.addEventListener("scroll", update, { passive: true });
      row.dataset.wired = "1";
    }
    update();
  });
}

function scrollRow(id, dir) {
  const row = document.getElementById(id);
  if (!row) return;
  const card = row.firstElementChild;
  const step = card ? card.getBoundingClientRect().width + 4 : row.clientWidth * 0.8;
  row.scrollBy({ left: dir * step, behavior: reduceMotion.matches ? "auto" : "smooth" });
}

function errorBlock(msg) {
  return `<div class="px-[var(--gutter)] pt-[calc(var(--hdr-h)+120px)] pb-40"><h1 class="display text-[clamp(48px,7vw,96px)]">Something went wrong</h1><p class="mt-4 text-[15px] max-w-xl">${esc(msg)}</p><a class="btn-black mt-8" href="./" data-link>Back home</a></div>`;
}

/* ============================== HEADER (Criterion) ============================== */
const header = $("#site-header");
const stickyHeader = header.cloneNode(true);
stickyHeader.id = "site-header-sticky";
stickyHeader.classList.add("hdr--sticky");
stickyHeader.dataset.variant = "dark";
stickyHeader.setAttribute("inert", "");
stickyHeader.setAttribute("aria-hidden", "true");
header.after(stickyHeader);

function setHeaderVariant(variant) {
  header.classList.toggle("hdr--light", variant === "light");
  header.dataset.variant = variant;
}

// Criterion's inner-page sticky clone: scroll sampled after a 500 ms throttle; near-top zone =
// header height + 130 px; reveal after > 200 px net upward travel; hide 300 ms after downward
// travel or on re-entering the top zone; 500 ms transform cubic-bezier(.23,1,.32,1). No shrink.
let lastSampleY = window.scrollY;
let sampleTimer = null;
let hideTimer = null;
function showSticky() {
  clearTimeout(hideTimer);
  stickyHeader.classList.add("is-shown");
  document.documentElement.classList.add("hdr-shown");
  stickyHeader.removeAttribute("inert");
  stickyHeader.removeAttribute("aria-hidden");
}
function hideStickyNow() {
  clearTimeout(hideTimer);
  stickyHeader.classList.remove("is-shown");
  document.documentElement.classList.remove("hdr-shown");
  stickyHeader.setAttribute("inert", "");
  stickyHeader.setAttribute("aria-hidden", "true");
}
function scheduleHideSticky(delay = 300) {
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => {
    if (!stickyHeader.classList.contains("is-shown")) return;
    hideStickyNow();
    closeDropdown(true, stickyHeader);
  }, delay);
}
function sampleScroll() {
  sampleTimer = null;
  const y = window.scrollY;
  const topZone = header.offsetHeight + 130;
  if (y < topZone) scheduleHideSticky();
  else if (lastSampleY - y > 200) showSticky();
  else if (y > lastSampleY) scheduleHideSticky();
  lastSampleY = y;
}
window.addEventListener(
  "scroll",
  () => {
    if (!sampleTimer) sampleTimer = setTimeout(sampleScroll, 500);
  },
  { passive: true },
);

/* ---- Click dropdowns: state added 50 ms after open, 25 px / 250 ms ease-out, removed after 250 ms ---- */
let openDD = null;
function dropdownHTML(kind) {
  if (kind === "account") {
    return `<div class="dd-title">My MovieFree</div>
      <a class="dd-link" role="menuitem" href="?browse=watchlist" data-link>Watchlist</a>
      <a class="dd-link" role="menuitem" href="?browse=recent" data-link>Recently Viewed</a>
      <a class="dd-link" role="menuitem" href="?browse=all" data-link>Browse by Genre</a>
      <a class="dd-link" role="menuitem" href="https://www.themoviedb.org/" target="_blank" rel="noopener">Data from TMDB</a>`;
  }
  const list = getWatchlist();
  const items = list
    .slice(0, 3)
    .map((it) => `<a class="dd-item" role="menuitem" href="${hrefOf(it)}" data-link><img src="${stillSrc(it)}" alt="" /><span>${esc(titleOf(it))}</span></a>`)
    .join("");
  return `<div class="dd-title">Watchlist</div>
    ${list.length ? items + (list.length > 3 ? `<p class="dd-link">+ ${list.length - 3} more</p>` : "") : `<p class="dd-empty">You have no titles in your watchlist.</p>`}
    <div class="dd-actions"><a class="dd-btn" role="menuitem" href="?browse=watchlist" data-link>View List</a><a class="dd-btn dd-btn--gold" role="menuitem" href="?browse=movies" data-link>Browse</a></div>`;
}
function openDropdown(btn, kind) {
  if (openDD && openDD.btn === btn) return closeDropdown();
  closeDropdown(true);
  const el = document.createElement("div");
  el.className = "dd";
  el.setAttribute("role", "menu");
  el.innerHTML = dropdownHTML(kind);
  btn.parentElement.appendChild(el);
  btn.setAttribute("aria-expanded", "true");
  openDD = { el, btn };
  setTimeout(() => el.classList.add("is-open"), 50);
}
function closeDropdown(immediate = false, onlyIn) {
  if (!openDD) return;
  if (onlyIn && !onlyIn.contains(openDD.el)) return;
  const { el, btn } = openDD;
  openDD = null;
  btn.setAttribute("aria-expanded", "false");
  el.classList.remove("is-open");
  if (immediate) el.remove();
  else setTimeout(() => el.remove(), 250);
}

/* ---- Drawers (menu + search): active 50 ms after open; 1500 ms slide / 250 ms fade; hidden 500 ms after close ---- */
const scrim = $("#drawer-scrim");
const menuDrawer = $("#menu-drawer");
const searchDrawer = $("#search-drawer");
let activeDrawer = null;
let drawerReturnFocus = null;
let drawerCloseTimer = null;

function openDrawer(kind, trigger) {
  closeDropdown(true);
  const el = kind === "menu" ? menuDrawer : searchDrawer;
  if (activeDrawer === el) return;
  if (activeDrawer) {
    // Criterion swaps the dark menu panel for the white search panel.
    activeDrawer.classList.remove("is-active");
    activeDrawer.classList.add("hidden");
  } else {
    drawerReturnFocus = trigger || document.activeElement;
  }
  clearTimeout(drawerCloseTimer);
  activeDrawer = el;
  el.classList.remove("hidden");
  scrim.classList.remove("hidden");
  scrim.style.background = kind === "menu" ? "rgba(0,0,0,0.2)" : "";
  document.documentElement.style.overflow = "hidden";
  $$("[data-action='menu']").forEach((b) => b.setAttribute("aria-expanded", String(kind === "menu")));
  setTimeout(() => {
    el.classList.add("is-active");
    scrim.classList.add("is-active");
    if (kind === "search") {
      searchInput.focus({ preventScroll: true });
      if (searchInput.value) searchInput.select();
    } else {
      const first = $(".menu-link", el);
      if (first) first.focus({ preventScroll: true });
    }
  }, 50);
}

function closeDrawers({ restoreFocus = true } = {}) {
  if (!activeDrawer) return;
  const el = activeDrawer;
  activeDrawer = null;
  el.classList.remove("is-active");
  scrim.classList.remove("is-active");
  $$("[data-action='menu']").forEach((b) => b.setAttribute("aria-expanded", "false"));
  clearTimeout(drawerCloseTimer);
  drawerCloseTimer = setTimeout(() => {
    el.classList.add("hidden");
    scrim.classList.add("hidden");
    if (trailerModal.classList.contains("hidden")) document.documentElement.style.overflow = "";
  }, 500);
  if (restoreFocus && drawerReturnFocus && document.contains(drawerReturnFocus)) {
    drawerReturnFocus.focus({ preventScroll: true });
  }
  drawerReturnFocus = null;
}

function trapFocus(e, container) {
  const focusables = $$('a[href], button:not([disabled]), input:not([disabled]), select, [tabindex]:not([tabindex="-1"])', container).filter(
    (n) => n.offsetParent !== null || n === document.activeElement,
  );
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (!container.contains(document.activeElement)) {
    e.preventDefault();
    first.focus();
  } else if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

/* ============================== LIVE SEARCH (Criterion drawer) ============================== */
const searchForm = $("#search-form");
const searchInput = $("#search-input");
const topSearchForm = $("#top-search-form");
const topSearchInput = $("#top-search-input");
const topSearchSuggestions = $("#top-search-suggestions");
const suggestionsList = $("#suggestions-list");
let debounceTimer = null;
let suggestSeq = 0;
let activeSuggestion = -1;
let topSuggestTimer = null;
let topSuggestSeq = 0;

function suggestionMeta(item) {
  if (typeOf(item) === "person") {
    const known = (item.known_for || []).map(titleOf).slice(0, 2).join(", ");
    return `${esc(item.known_for_department || "Person")}${known ? `, <em>${esc(known)}</em>` : ""}`;
  }
  const y = yearOf(item);
  const g = firstGenre(item);
  return `${esc(y)}${y && g ? ", " : ""}${g ? `<em>${esc(g)}</em>` : ""}`;
}

function renderSuggestions(results, query) {
  const groups = [
    { label: "Films", type: "movie", max: 5 },
    { label: "Television", type: "tv", max: 3 },
    { label: "People", type: "person", max: 3 },
  ];
  remember(results);
  let idx = 0;
  const html = groups
    .map((g) => {
      const items = results.filter((r) => r.media_type === g.type).slice(0, g.max);
      if (!items.length) return "";
      const round = g.type === "person" ? "sugg-thumb--round" : "";
      return `<div class="sugg-group" role="group" aria-label="${g.label}"><div class="sugg-glabel" aria-hidden="true">${g.label}</div>${items
        .map((it) => {
          const thumbPath = g.type === "person" ? it.profile_path : it.poster_path;
          const thumb = thumbPath
            ? `<img class="sugg-thumb ${round}" src="${SUGGESTION_IMG_URL + thumbPath}" alt="" loading="lazy" />`
            : `<span class="sugg-thumb ${round}"></span>`;
          return `<a id="sugg-${idx++}" class="sugg-item" role="option" aria-selected="false" href="${hrefOf(it)}" data-link>${thumb}<span><span class="sugg-title">${highlight(titleOf(it), query)}</span><span class="sugg-meta">${suggestionMeta(it)}</span></span></a>`;
        })
        .join("")}</div>`;
    })
    .join("");
  const all = `<a id="sugg-${idx}" class="sugg-all" role="option" aria-selected="false" href="?q=${encodeURIComponent(query)}" data-link>See all results for “${esc(query)}” →</a>`;
  suggestionsList.innerHTML = html ? html + all : `<p class="sugg-none">No quick matches for “${esc(query)}”. Press Enter to search everything.</p>`;
  activeSuggestion = -1;
  searchInput.setAttribute("aria-expanded", html ? "true" : "false");
  searchInput.removeAttribute("aria-activedescendant");
}

function handleInputAutocomplete() {
  const query = searchInput.value.trim();
  clearTimeout(debounceTimer);
  if (!query) {
    suggestSeq++;
    suggestionsList.innerHTML = "";
    searchInput.setAttribute("aria-expanded", "false");
    return;
  }
  // As on Criterion, earlier suggestions stay visible until the next response lands.
  debounceTimer = setTimeout(async () => {
    const seq = ++suggestSeq;
    try {
      if (!Object.keys(genreNames).length) await loadGenreNames();
      const data = await searchAllContent(query);
      if (seq !== suggestSeq) return;
      renderSuggestions(data.results || [], query);
    } catch {
      if (seq === suggestSeq) suggestionsList.innerHTML = `<p class="sugg-none">Search is unavailable right now.</p>`;
    }
  }, SEARCH_DEBOUNCE_MS);
}

function moveSuggestion(delta) {
  const opts = $$('[role="option"]', suggestionsList);
  if (!opts.length) return;
  // -1 means "back in the text box"; cycles input -> options -> input.
  let next = activeSuggestion + delta;
  if (next >= opts.length) next = -1;
  if (next < -1) next = opts.length - 1;
  activeSuggestion = next;
  opts.forEach((o, i) => {
    const on = i === activeSuggestion;
    o.classList.toggle("is-active", on);
    o.setAttribute("aria-selected", String(on));
    if (on) o.scrollIntoView({ block: "nearest" });
  });
  if (activeSuggestion >= 0) searchInput.setAttribute("aria-activedescendant", opts[activeSuggestion].id);
  else searchInput.removeAttribute("aria-activedescendant");
}

searchInput.addEventListener("input", handleInputAutocomplete);
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") {
    e.preventDefault();
    moveSuggestion(1);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    moveSuggestion(-1);
  } else if (e.key === "Enter" && activeSuggestion >= 0) {
    e.preventDefault();
    const opt = $$('[role="option"]', suggestionsList)[activeSuggestion];
    if (opt) navigate(opt.getAttribute("href"));
  }
});
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const q = searchInput.value.trim();
  if (!q) return searchInput.focus();
  if (topSearchInput) topSearchInput.value = q;
  navigate(`?q=${encodeURIComponent(q)}`);
});
if (topSearchForm && topSearchInput) {
  topSearchInput.addEventListener("input", () => {
    const query = topSearchInput.value.trim();
    clearTimeout(topSuggestTimer);
    if (!query) {
      topSuggestSuggestions([]);
      return;
    }
    topSuggestTimer = setTimeout(async () => {
      const seq = ++topSuggestSeq;
      try {
        const data = await searchAllContent(query);
        if (seq === topSuggestSeq) topSuggestSuggestions(data.results || [], query);
      } catch {
        if (seq === topSuggestSeq) topSuggestSuggestions([]);
      }
    }, 180);
  });
  topSearchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") topSuggestSuggestions([]);
  });
  document.addEventListener("click", (e) => {
    if (!topSearchForm.contains(e.target)) topSuggestSuggestions([]);
  });
  topSearchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = topSearchInput.value.trim();
    if (!q) return topSearchInput.focus();
    topSuggestSuggestions([]);
    searchInput.value = q;
    navigate(`?q=${encodeURIComponent(q)}`);
  });
}

function topSuggestSuggestions(results, query = "") {
  if (!topSearchSuggestions) return;
  const items = results
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .filter((item, i, all) => all.findIndex((x) => x.id === item.id && x.media_type === item.media_type) === i)
    .slice(0, 6);
  topSearchSuggestions.innerHTML = items.length
    ? items.map((item) => {
        const poster = item.poster_path ? img("w92", item.poster_path) : PLACEHOLDER;
        return `<a class="top-suggestion" role="option" href="${hrefOf(item)}" data-link><img src="${poster}" alt="" loading="lazy" /><span><strong>${highlight(titleOf(item), query)}</strong><small>${typeOf(item) === "tv" ? "TV" : "MOVIE"}${yearOf(item) ? ` · ${esc(yearOf(item))}` : ""}</small></span></a>`;
      }).join("") + `<a class="top-suggestion top-suggestion--all" role="option" href="?q=${encodeURIComponent(query)}" data-link>See all results for “${esc(query)}” →</a>`
    : "";
  topSearchSuggestions.hidden = !items.length;
}

/* ============================== TRAILER MODAL (NEON) ============================== */
const trailerModal = $("#trailer-modal");
const trailerFrame = $("#trailer-frame");
let trailerReturnFocus = null;
let trailerSeq = 0;
async function openTrailer(type, id, title, trigger) {
  const seq = ++trailerSeq;
  trailerReturnFocus = trigger || document.activeElement;
  $("#trailer-title").textContent = title ? `${title} — Trailer` : "Trailer";
  trailerModal.classList.remove("hidden");
  document.documentElement.style.overflow = "hidden";
  document.documentElement.classList.add("modal-open");
  requestAnimationFrame(() => trailerModal.classList.add("is-open"));
  $(".tm-close", trailerModal).focus({ preventScroll: true });
  const key = await getTrailerKey(type, id);
  if (seq !== trailerSeq || trailerModal.classList.contains("hidden")) return;
  if (key) {
    trailerFrame.removeAttribute("srcdoc");
    trailerFrame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(key)}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
  } else {
    trailerFrame.srcdoc = `<body style="margin:0;display:grid;place-items:center;height:100vh;background:#000;color:#fff;font:700 13px system-ui;text-transform:uppercase">No trailer available for this title</body>`;
  }
}
function closeTrailer() {
  if (trailerModal.classList.contains("hidden")) return;
  trailerSeq++;
  trailerModal.classList.remove("is-open");
  trailerFrame.removeAttribute("srcdoc");
  trailerFrame.src = "about:blank";
  setTimeout(() => trailerModal.classList.add("hidden"), 300);
  if (!plState) document.documentElement.classList.remove("modal-open");
  if (!activeDrawer) document.documentElement.style.overflow = "";
  if (trailerReturnFocus && document.contains(trailerReturnFocus)) trailerReturnFocus.focus({ preventScroll: true });
}
trailerModal.addEventListener("click", (e) => {
  if (e.target === trailerModal) closeTrailer();
});

/* ============================== PLAYER (Netflix-inspired, full screen) ==============================
   Uses the same STREAM_MIRRORS as the legacy player (Server 1-30).
   Sandbox results (headless Chrome, 2026-11-12, sandbox="allow-scripts allow-same-origin
   allow-presentation allow-forms", then adding allow-modals / allow-popups / allow-popups-to-escape-sandbox /
   allow-top-navigation(-by-user-activation), then every token at once):
     VidLink    -> "Please Disable Sandbox" with every combination. Unsandboxed: plays (Fight Club).
     VidSrc     -> redirects to vidsrc.sh/sandbox.php "can't be embedded in a sandboxed frame". Unsandboxed:
                   player + a human-verification puzzle; tries to reach window.top (blocked by the browser).
     2Embed     -> "Sandbox not allowed. Remove sandbox from the iframe to play." Unsandboxed: its inner
                   host (vidsrc.buzz) answered 403 from the test machine.
     MultiEmbed -> redirects to streamingnow.mov, which sends X-Frame-Options: SAMEORIGIN behind a
                   Cloudflare challenge: refused to load with or without sandbox from the test machine.
   So `sandbox` is per server: a string is applied as-is; null means the mirror refuses any sandbox and
   is only loaded unsandboxed (chip marked "may show pop-ups"). The default server is the first one that
   plays sandboxed; none does today, so it falls back to Server 1, the only one that played in tests.
   A server the user picks is remembered. While the player is open a beforeunload guard makes the browser
   ask before any frame can navigate this tab away. */
const PLAYER_SANDBOX = "allow-scripts allow-same-origin allow-presentation allow-forms";
const MIRROR_SANDBOX = {
  server1: null,
  server2: null,
  server3: null,
  server4: null,
  server5: null,
  server6: null,
  server7: null,
  server8: null,
  server9: null,
  server10: null,
  server11: null,
  server12: null,
  server13: null,
  server14: null,
  server15: null,
  server16: null,
  server17: null,
  server18: null,
  server19: null,
  server20: null,
  server21: null,
  server22: null,
  server23: null,
  server24: null,
  server25: null,
  server26: null,
  server27: null,
  server28: null,
  server29: null,
  server30: null,
};
const PLAYER_SERVERS = STREAM_MIRRORS.map((m, i) => ({
  ...m,
  name: `Server ${i + 1}`,
  sandbox: m.id in MIRROR_SANDBOX ? MIRROR_SANDBOX[m.id] : PLAYER_SANDBOX,
}));
const SERVER_KEY = "moviefree:server";
const PROGRESS_KEY = "moviefree:progress";
const CHROME_IDLE_MS = 3000;
const LOAD_SLOW_MS = 12000;

const player = $("#player");
const plStage = $("#pl-stage");
const plLoading = $("#pl-loading");
const plEps = $("#pl-eps");
const plSeason = $("#pl-season");
let plState = null;
let plIdleTimer = null;
let plSlowTimer = null;
let plReturnFocus = null;
let plIgnorePop = false;
const coarsePointer = window.matchMedia("(pointer: coarse)");

function serverIndex() {
  const saved = PLAYER_SERVERS.findIndex((s) => s.id === store.get(SERVER_KEY, ""));
  if (saved >= 0) return saved; // only ever set by the user picking a chip
  const safe = PLAYER_SERVERS.findIndex((s) => s.sandbox);
  return safe >= 0 ? safe : 0;
}
function plGuard(e) {
  // Stops pop-under scripts in the mirror iframe from navigating the whole tab away silently.
  e.preventDefault();
  e.returnValue = "";
}

function renderServers() {
  const box = $("#pl-servers");
  box.innerHTML = PLAYER_SERVERS.map(
    (s, i) =>
      `<button type="button" class="pl-chip${s.sandbox ? "" : " is-open-frame"}" role="radio" aria-checked="${i === plState.server}" data-action="pl-server" data-i="${i}" title="${esc(s.label)}${s.sandbox ? " · sandboxed" : " · may show pop-ups"}">${esc(s.name)}${s.sandbox ? "" : `<span class="pl-chip-dot" aria-hidden="true"></span><span class="sr-only"> (may show pop-ups)</span>`}</button>`,
  ).join("");
  syncServerNote();
}
function syncServerNote() {
  const srv = PLAYER_SERVERS[plState.server];
  $("#pl-server-current").textContent = srv.name;
  $("#pl-note").textContent = srv.sandbox
    ? "If a server does not play, try another."
    : "If a server does not play, try another. • May show pop-ups: this server refuses a sandboxed frame.";
}

function toggleServers(force) {
  const panel = $("#pl-servers-panel");
  const open = typeof force === "boolean" ? force : panel.hidden;
  panel.hidden = !open;
  $("#pl-servers-btn").setAttribute("aria-expanded", String(open));
  wakeChrome();
}

function plHeading() {
  $("#pl-title").textContent = plState.title;
  const sub = $("#pl-sub");
  if (plState.type === "live") {
    sub.textContent = `Live TV · ${plState.sourceLabel || "Official stream"}`;
  } else if (plState.type === "tv") {
    const ep = plState.episodes.find((e) => e.episode_number === plState.episode);
    sub.textContent = `S${plState.season}:E${plState.episode}${ep && ep.name ? ` “${ep.name}”` : ""}`;
  } else sub.textContent = plState.year || "";
  document.title = `${plState.type === "tv" ? `${plState.title} S${plState.season}:E${plState.episode}` : plState.title} — Watch — MOVIEFREE`;
}

function syncLiveFallback() {
  const box = $("#pl-live-fallback");
  if (!box) return;
  const link = $("#pl-live-fallback-link");
  const youtubeLink = $("#pl-live-youtube-link");
  const isLive = Boolean(plState && plState.type === "live");
  box.hidden = !isLive;
  if (isLive && link) {
    link.href = plState.fallbackUrl || "#";
    link.hidden = !plState.fallbackUrl;
  }
  if (isLive && youtubeLink) {
    youtubeLink.href = plState.youtubeUrl || "#";
    youtubeLink.hidden = !plState.youtubeUrl;
  }
}

function loadSource() {
  if (!plState) return;
  const srv = plState.type === "live" ? null : PLAYER_SERVERS[plState.server];
  const url = plState.type === "live"
    ? plState.liveUrl
    : buildStreamUrl(srv, plState.type, plState.id, plState.season, plState.episode, plState.imdbId);
  // A fresh iframe per source: sandbox flags only apply on creation/navigation, and it drops mirror history.
  const f = document.createElement("iframe");
  f.className = "pl-frame";
  f.title = `${plState.title}${srv ? ` — ${srv.name}` : " — Live TV"}`;
  f.setAttribute("allow", "autoplay; fullscreen; encrypted-media; picture-in-picture");
  f.setAttribute("allowfullscreen", "");
  f.setAttribute("webkitallowfullscreen", "");
  f.setAttribute("referrerpolicy", "origin");
  if (srv && srv.sandbox) f.setAttribute("sandbox", srv.sandbox);
  f.addEventListener("load", () => {
    clearTimeout(plSlowTimer);
    setTimeout(() => player.classList.remove("is-loading"), 350);
  });
  plStage.replaceChildren(f);
  f.src = url;
  player.classList.add("is-loading");
  player.classList.remove("is-slow");
  $("#pl-loading-text").textContent = srv ? `Loading ${srv.name}` : "Starting official live broadcast";
  clearTimeout(plSlowTimer);
  plSlowTimer = setTimeout(() => {
    player.classList.add("is-slow");
    $("#pl-loading-text").textContent = srv ? `${srv.name} is slow. Try another server.` : "The official live broadcast is unavailable. Use a link below to watch it directly.";
  }, LOAD_SLOW_MS);
  plHeading();
  syncLiveFallback();
  syncNext();
  if (plState.type === "tv") {
    const prog = store.get(PROGRESS_KEY, {});
    prog[`tv:${plState.id}`] = { s: plState.season, e: plState.episode };
    store.set(PROGRESS_KEY, prog);
    $$(".pl-ep", plEps).forEach((li) => li.setAttribute("aria-current", String(Number(li.dataset.e) === plState.episode && Number(plSeason.value) === plState.season)));
  }
  wakeChrome();
}

function syncNext() {
  const btn = $("#pl-next");
  if (plState.type !== "tv") return (btn.hidden = true);
  btn.hidden = !nextEpisode();
}
function nextEpisode() {
  const { episodes, episode, season, seasons } = plState;
  const i = episodes.findIndex((e) => e.episode_number === episode);
  if (i >= 0 && i < episodes.length - 1) return { season, episode: episodes[i + 1].episode_number };
  const si = seasons.findIndex((s) => s.season_number === season);
  if (si >= 0 && si < seasons.length - 1) return { season: seasons[si + 1].season_number, episode: 1, newSeason: true };
  return null;
}

async function loadSeason(season, { list = true } = {}) {
  const s = await fetchSeasonDetails(plState.id, season);
  const eps = (s && s.episodes) || [];
  if (list) renderEpisodeList(season, eps);
  return eps;
}
function renderEpisodeList(season, eps) {
  plSeason.value = String(season);
  $("#pl-eps-list").innerHTML = eps.length
    ? eps
        .map(
          (ep) => `
      <li class="pl-ep" data-e="${ep.episode_number}" aria-current="${season === plState.season && ep.episode_number === plState.episode}">
        <button type="button" data-action="pl-ep" data-s="${season}" data-e="${ep.episode_number}">
          <span class="pl-ep-n">${ep.episode_number}</span>
          <span class="pl-ep-img"><img src="${ep.still_path ? img("w300", ep.still_path) : PLACEHOLDER}" ${ep.still_path ? tmdbSrcset(ep.still_path, [["w300", 300], ["original", 1280]], "(min-width: 1600px) 280px, 128px") : ""} alt="" loading="lazy" /><span class="pl-ep-play" aria-hidden="true">${ICON.playXs}</span></span>
          <span class="pl-ep-txt">
            <span class="pl-ep-t"><strong>${esc(ep.name || "Episode " + ep.episode_number)}</strong>${ep.runtime ? `<em>${esc(ep.runtime)}m</em>` : ""}</span>
            <span class="pl-ep-o">${esc(truncate(ep.overview || "", 150))}</span>
          </span>
        </button>
      </li>`,
        )
        .join("")
    : `<li class="pl-ep-empty">Episode list unavailable.</li>`;
}

async function goEpisode(season, episode) {
  if (season !== plState.season) {
    plState.season = season;
    plState.episodes = await loadSeason(season, { list: Number(plSeason.value) !== season });
  }
  plState.episode = episode;
  loadSource();
}

function openLiveChannel(channel, trigger) {
  if (!channel) return;
  openPlayer(
    { type: "live", id: channel.id, title: channel.name, sourceLabel: channel.source, liveUrl: channel.embedUrl || liveChannelUrl(channel), fallbackUrl: channel.fallbackUrl, youtubeUrl: liveChannelPageUrl(channel) },
    trigger,
  );
}

async function openPlayer({ type, id, title, season, episode, liveUrl, fallbackUrl, youtubeUrl, sourceLabel }, trigger) {
  if (!id) return;
  closeTrailer();
  closeDrawers({ restoreFocus: false });
  plReturnFocus = trigger || document.activeElement;
  plState = { type, id: String(id), imdbId: "", liveUrl: liveUrl || "", fallbackUrl: fallbackUrl || "", youtubeUrl: youtubeUrl || "", sourceLabel: sourceLabel || "Official stream", title: title || "", year: "", server: serverIndex(), season: 1, episode: 1, episodes: [], seasons: [] };
  const known = itemIndex.get(`${type}:${id}`) || itemIndex.get(`${type}:${Number(id)}`);
  if (known) {
    plState.title = plState.title || titleOf(known);
    plState.year = yearOf(known);
  }
  player.classList.toggle("is-tv", type === "tv");
  $("#pl-servers-wrap").hidden = type === "live";
  $("#pl-servers-panel").hidden = true;
  $("#pl-servers-btn").setAttribute("aria-expanded", "false");
  $("#pl-episodes-btn").hidden = type !== "tv";
  plEps.hidden = type !== "tv";
  player.classList.toggle("eps-open", type === "tv");
  $("#pl-episodes-btn").setAttribute("aria-expanded", String(type === "tv"));
  if (type === "tv") {
    plSeason.innerHTML = `<option value="">Loading seasons…</option>`;
    $("#pl-eps-list").innerHTML = `<li class="pl-ep-empty">Loading episodes…</li>`;
  }
  $("#pl-next").hidden = true;
  if (type !== "live") renderServers();
  player.classList.remove("hidden");
  document.documentElement.style.overflow = "hidden";
  document.documentElement.classList.add("modal-open");
  requestAnimationFrame(() => player.classList.add("is-open"));
  if (!history.state || !history.state.mfPlayer) history.pushState({ ...(history.state || {}), mfPlayer: 1 }, "", location.href);
  window.addEventListener("beforeunload", plGuard);
  $(".pl-back").focus({ preventScroll: true });
  showRotateHint();

  if (type === "live") {
    loadSource();
    return;
  }

  if (type === "tv") {
    player.classList.add("is-loading");
    $("#pl-loading-text").textContent = "Loading episodes";
    const d = await fetchTvDetails(id);
    if (!plState || plState.id !== String(id)) return;
    plState.title = plState.title || (d && d.name) || "";
    plState.seasons = ((d && d.seasons) || []).filter((s) => s.season_number > 0 && s.episode_count);
    const prog = store.get(PROGRESS_KEY, {})[`tv:${id}`];
    const first = plState.seasons[0] ? plState.seasons[0].season_number : 1;
    plState.season = Number(season) || (prog && prog.s) || first;
    plState.episode = Number(episode) || (prog && !season ? prog.e : 1) || 1;
    plSeason.innerHTML = plState.seasons.map((s) => `<option value="${s.season_number}">Season ${s.season_number}</option>`).join("") || `<option value="1">Season 1</option>`;
    plState.episodes = await loadSeason(plState.season);
    if (!plState || plState.id !== String(id)) return;
  }
  plState.imdbId = await fetchExternalIds(type, id);
  if (!plState || plState.id !== String(id)) return;
  loadSource();
}

function closePlayer({ fromPop = false } = {}) {
  if (!plState) return;
  plState = null;
  $("#pl-servers-wrap").hidden = false;
  clearTimeout(plIdleTimer);
  clearTimeout(plSlowTimer);
  window.removeEventListener("beforeunload", plGuard);
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  player.classList.remove("is-open", "is-idle", "is-loading", "is-slow");
  plStage.replaceChildren();
  setTimeout(() => !plState && player.classList.add("hidden"), 250);
  document.documentElement.classList.remove("modal-open");
  if (!activeDrawer) document.documentElement.style.overflow = "";
  const r = parseRoute();
  if (r.name === "detail") {
    const it = itemIndex.get(`${r.type}:${r.id}`) || itemIndex.get(`${r.type}:${Number(r.id)}`);
    if (it) document.title = `${titleOf(it)} — MOVIEFREE`;
    const prog = r.type === "tv" && store.get(PROGRESS_KEY, {})[`tv:${r.id}`];
    const label = $(".hero-cta .cta-watch span");
    if (prog && label) label.textContent = `Resume S${prog.s}:E${prog.e}`;
  }
  if (!fromPop && history.state && history.state.mfPlayer) {
    plIgnorePop = true;
    history.back();
  }
  if (plReturnFocus && document.contains(plReturnFocus)) plReturnFocus.focus({ preventScroll: true });
}

function toggleEpisodes(force) {
  const open = typeof force === "boolean" ? force : plEps.hidden;
  plEps.hidden = !open;
  player.classList.toggle("eps-open", open);
  $("#pl-episodes-btn").setAttribute("aria-expanded", String(open));
  if (open) {
    if (Number(plSeason.value) !== plState.season) renderEpisodeList(plState.season, plState.episodes);
    const cur = $(".pl-ep[aria-current='true']", plEps);
    if (cur) cur.scrollIntoView({ block: "center" });
    plSeason.focus({ preventScroll: true });
  }
  wakeChrome();
}

function toggleFullscreen() {
  if (document.fullscreenElement) return document.exitFullscreen().catch(() => {});
  const req = player.requestFullscreen || player.webkitRequestFullscreen;
  if (!req) return;
  Promise.resolve(req.call(player))
    .then(() => screen.orientation && screen.orientation.lock && screen.orientation.lock("landscape").catch(() => {}))
    .catch(() => {});
}
document.addEventListener("fullscreenchange", () => {
  $("#pl-fs-btn").setAttribute("aria-label", document.fullscreenElement ? "Exit full screen" : "Full screen");
});

// Chrome auto-hides after ~3s idle. The mirror iframe swallows mouse events, so edge "hot zones"
// and the window blur that happens when you click into the video wake it too.
function wakeChrome() {
  if (!plState) return;
  player.classList.remove("is-idle");
  clearTimeout(plIdleTimer);
  plIdleTimer = setTimeout(() => {
    const ae = document.activeElement;
    const keyboardInPlayer = ae && ae !== player && player.contains(ae);
    if (!plState || !plEps.hidden || player.querySelector(".pl-chrome:hover, .pl-back:hover") || keyboardInPlayer) return wakeChrome();
    player.classList.add("is-idle");
  }, CHROME_IDLE_MS);
}
player.addEventListener("mousemove", wakeChrome);
player.addEventListener("touchstart", wakeChrome, { passive: true });
player.addEventListener("keydown", wakeChrome);
window.addEventListener("blur", () => plState && setTimeout(wakeChrome, 0));

function showRotateHint() {
  const hint = $("#pl-rotate");
  hint.classList.remove("show");
  if (!coarsePointer.matches || window.innerWidth > window.innerHeight === true) return;
  void hint.offsetWidth;
  hint.classList.add("show");
}

plSeason.addEventListener("change", async () => {
  const s = Number(plSeason.value);
  const eps = await loadSeason(s, { list: false });
  if (plState) renderEpisodeList(s, eps);
});

/* ============================== ROUTER (query-string, client-side) ============================== */
const app = $("#app");
let routeToken = 0;
let heroTimer = null;

function parseRoute() {
  const p = new URLSearchParams(location.search);
  if (p.get("movie")) return { name: "detail", type: "movie", id: p.get("movie") };
  if (p.get("tv")) return { name: "detail", type: "tv", id: p.get("tv") };
  if (p.get("person")) return { name: "person", id: p.get("person") };
  if (p.has("q"))
    return {
      name: "search",
      q: (p.get("q") || "").trim(),
      view: p.get("view") || "",
      page: Math.max(1, parseInt(p.get("p") || "1", 10) || 1),
      sort: p.get("sort") || "relevance",
    };
  if (p.get("browse")) return { name: "browse", kind: p.get("browse"), genre: p.get("genre") || "", status: p.get("status") || "all" };
  return { name: "home" };
}

function navigate(url, { replace = false, keepScroll = false } = {}) {
  const target = new URL(url, location.href);
  history[replace ? "replaceState" : "pushState"]({}, "", target.pathname + target.search + target.hash);
  render({ keepScroll });
}

function stopHero() {
  clearInterval(heroTimer);
  heroTimer = null;
}

function render({ keepScroll = false } = {}) {
  const token = ++routeToken;
  stopHero();
  closeDrawers({ restoreFocus: false });
  closeDropdown(true);
  closeTrailer();
  if (plState) closePlayer({ fromPop: true });
  hideStickyNow();
  if (!keepScroll) window.scrollTo(0, 0);
  lastSampleY = window.scrollY;
  const route = parseRoute();
  setHeaderVariant(route.name === "home" || route.name === "detail" ? "light" : "dark");
  app.classList.remove("view-enter");
  void app.offsetWidth;
  app.classList.add("view-enter");
  const views = { home: viewHome, detail: viewDetail, person: viewPerson, search: viewSearch, browse: viewBrowse };
  return views[route.name](route, token)
    .then(() => token === routeToken && requestAnimationFrame(() => fitDisplay(app)))
    .catch((err) => {
      if (token !== routeToken) return;
      app.innerHTML = errorBlock(err && err.message ? err.message : "Please try again.");
    });
}

const live = (token) => token === routeToken;

/* ============================== VIEW: HOME (NEON) ============================== */
async function viewHome(route, token) {
  document.title = "MOVIEFREE — In theaters, coming soon and trending";
  const skRow = (t) =>
    `<section class="sec"><div class="sec-head"><h2 class="sec-title display">${t}</h2></div><div class="row">${'<div class="card card--xl"><div class="card-media sk"></div></div>'.repeat(3)}</div></section>`;
  app.innerHTML = `<section class="hero sk" aria-label="Loading featured titles"></section>${["In Theaters", "Coming Soon", "Trending Now"].map(skRow).join("")}`;

  getTrendingContent()
    .then((t) => {
      const first = t.filter((x) => x.media_type === "movie").slice(0, 4).find((x) => x.backdrop_path);
      if (first && live(token)) preloadHero(first.backdrop_path);
    })
    .catch(() => {});
  const [trending, nowPlaying, upcoming, topRated, tvPopular] = await Promise.all([
    getTrendingContent(),
    tmdb("/movie/now_playing", { region: "US" }).then((d) => withType("movie")(d.results)).catch(() => []),
    tmdb("/movie/upcoming", { region: "US" }).then((d) => withType("movie")(d.results)).catch(() => []),
    tmdb("/movie/top_rated").then((d) => withType("movie")(d.results)).catch(() => []),
    tmdb("/tv/popular").then((d) => withType("tv")(d.results)).catch(() => []),
  ]);
  if (!Object.keys(genreNames).length) await loadGenreNames();
  if (!live(token)) return;
  remember([...trending, ...nowPlaying, ...upcoming, ...topRated, ...tvPopular]);

  const nowSet = new Set(nowPlaying.map((m) => m.id));
  const soon = upcoming.filter((m) => checkIsUpcoming(m) && m.backdrop_path).sort((a, b) => (a.release_date > b.release_date ? 1 : -1));
  // Hero mix: trending films first, then what's in theaters, coming soon and trending series.
  const heroPool = [
    ...trending.filter((x) => x.media_type === "movie").slice(0, 4),
    ...nowPlaying.slice(0, 3),
    ...soon.slice(0, 2),
    ...trending.filter((x) => x.media_type === "tv").slice(0, 2),
  ];
  const heroItems = heroPool
    .filter((x, i, a) => x.backdrop_path && a.findIndex((y) => y.id === x.id && y.media_type === x.media_type) === i)
    .slice(0, window.innerWidth < 768 ? 7 : 10); // 7 dots keep 44px tap targets on phones
  const ctx = { nowPlaying: nowSet };
  const heroChip = (it) => {
    if (checkIsUpcoming(it)) return chipFor(it, ctx);
    if (nowSet.has(it.id)) return "In Theaters";
    return typeOf(it) === "tv" ? "Trending Series" : "Trending Now";
  };
  const nlStill = (topRated.find((m) => m.backdrop_path) || trending[0] || {}).backdrop_path;

  app.innerHTML = `
    <section class="hero on-dark" aria-roledescription="carousel" aria-label="Featured titles" id="hero">
      ${heroItems
        .map(
          (it, i) => `
        <div class="hero-slide ${i === 0 ? "is-active" : ""}" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${heroItems.length}" ${i === 0 ? "" : 'aria-hidden="true"'}>
          <img class="hero-img" src="${img("w1280", it.backdrop_path)}" srcset="${heroSrcset(it.backdrop_path)}" sizes="100vw" alt="" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" />
          <div class="hero-shade"></div>
          <div class="hero-copy">
            <div class="hero-chipwrap"><span class="chip">${esc(heroChip(it))}</span></div>
            <h2 class="hero-title display ${titleTier(titleOf(it))}"><a href="${hrefOf(it)}" data-link ${i === 0 ? "" : 'tabindex="-1"'}>${esc(titleOf(it))}</a></h2>
            <div class="hero-cta">
              ${checkIsUpcoming(it) ? "" : `<button type="button" class="cta-watch" ${watchAttrs(it)} ${i === 0 ? "" : 'tabindex="-1"'}>${ICON.watch}<span>Watch Now</span></button>`}
              <button type="button" class="cta-line" data-action="trailer" data-type="${typeOf(it)}" data-id="${it.id}" data-title="${esc(titleOf(it))}" ${i === 0 ? "" : 'tabindex="-1"'}>Trailer</button>
              ${saveBtn(it, "save-item", i === 0)}
            </div>
          </div>
        </div>`,
        )
        .join("")}
      <div class="hero-dots" role="tablist" aria-label="Choose featured title">
        ${heroItems.map((it, i) => `<button type="button" role="tab" class="hero-dot ${i === 0 ? "is-active" : ""}" data-action="hero-dot" data-i="${i}" aria-label="Show ${esc(titleOf(it))}" aria-selected="${i === 0}"></button>`).join("")}
      </div>
      <div class="hero-progress" id="hero-progress"></div>
    </section>

    ${nowPlaying.length ? rowSection("In Theaters", nowPlaying.filter((m) => m.backdrop_path).map((m) => cardHTML(m, { size: "xl", chip: "In Theaters" })).join(""), { link: "?browse=now-playing", id: "row-theaters" }) : ""}
    ${rowSection("TV Stations", LIVE_CHANNELS.map(liveChannelCardHTML).join(""), { link: "?browse=live-tv", id: "row-live-tv" })}
    ${soon.length ? rowSection("Coming Soon", soon.map((m) => cardHTML(m, { size: "hero" })).join(""), { link: "?browse=upcoming", id: "row-soon" }) : ""}
    ${tvPopular.length ? rowSection("Series", tvPopular.filter((m) => m.backdrop_path).map((m) => cardHTML(m, { markTv: true })).join(""), { link: "?browse=tv", id: "row-series" }) : ""}
    ${rowSection("Trending Now", trending.filter((m) => m.backdrop_path).map((m) => cardHTML(m, { ...ctx, markTv: true })).join(""), { link: "?browse=trending", id: "row-trending" })}
    ${topRated.length ? rowSection("Top Rated", topRated.filter((m) => m.backdrop_path).map((m) => cardHTML(m, { rating: true, chip: false })).join(""), { link: "?browse=top-rated", id: "row-top" }) : ""}

    <section class="sec" aria-label="Newsletter">
      <div class="nl">
        ${nlStill ? `<img src="${img("w1280", nlStill)}" ${tmdbSrcset(nlStill, [["w780", 780], ["w1280", 1280], ["original", 3840]], "100vw")} alt="" loading="lazy" />` : ""}
        <div class="nl-in">
          <div class="nl-word display"><span class="ol">MovieFree</span>Newsletter</div>
          <div>
            <form class="nl-form" data-newsletter novalidate>
              <label for="nl-email" class="sr-only">Email address</label>
              <input id="nl-email" type="email" placeholder="Enter your email address" autocomplete="off" />
              <button type="submit" aria-label="Subscribe (coming soon)">${ICON.arrowLong}</button>
            </form>
            <p class="nl-note" data-nl-note aria-live="polite"></p>
          </div>
        </div>
      </div>
    </section>`;

  wireRows(app);
  setupHero(heroItems);
  setFooterStill(topRated.find((m) => m.backdrop_path) || heroItems[1] || heroItems[0]);
}

let heroState = { items: [], i: 0 };
function setupHero(items) {
  heroState = { items, i: 0 };
  syncHeroActions();
  const hero = $("#hero");
  if (!hero || items.length < 2) return;
  hero.addEventListener("focusin", () => (heroState.focus = true));
  hero.addEventListener("focusout", () => (heroState.focus = false));
  hero.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    if (!e.target.closest(".hero-dot")) return;
    e.preventDefault();
    e.stopPropagation();
    showHero(heroState.i + (e.key === "ArrowRight" ? 1 : -1), true);
  });
  startHeroTimer();
}
function startHeroTimer() {
  stopHero();
  const bar = $("#hero-progress");
  if (reduceMotion.matches) return; // no auto-rotation when reduced motion is requested
  const restartBar = () => {
    if (!bar) return;
    bar.style.transition = "none";
    bar.style.width = "0";
    void bar.offsetWidth;
    bar.style.transition = `width ${HERO_INTERVAL_MS}ms linear`;
    bar.style.width = "100%";
  };
  restartBar();
  heroTimer = setInterval(() => {
    if (document.hidden || heroState.focus) return;
    showHero(heroState.i + 1);
    restartBar();
  }, HERO_INTERVAL_MS);
}
function showHero(i, manual = false) {
  const n = heroState.items.length;
  if (!n) return;
  heroState.i = ((i % n) + n) % n;
  $$(".hero-slide").forEach((s, k) => {
    const on = k === heroState.i;
    s.classList.toggle("is-active", on);
    s.toggleAttribute("aria-hidden", !on);
    $$(".hero-title a, .hero-cta button", s).forEach((a) => (a.tabIndex = on ? 0 : -1));
  });
  $$(".hero-dot").forEach((d, k) => {
    d.classList.toggle("is-active", k === heroState.i);
    d.setAttribute("aria-selected", String(k === heroState.i));
  });
  syncHeroActions();
  if (manual) startHeroTimer();
}
function syncHeroActions() {
  const it = heroState.items[heroState.i];
  if (!it) return;
  syncSaveButtons();
  const play = $(".hero-play");
  const heart = $(".hero-heart");
  if (play) play.setAttribute("aria-label", `${checkIsUpcoming(it) ? "Play trailer" : "Watch now"}: ${titleOf(it)}`);
  if (heart) {
    const saved = isSaved(typeOf(it), it.id);
    heart.classList.toggle("is-saved", saved);
    heart.setAttribute("aria-pressed", String(saved));
    heart.setAttribute("aria-label", `${saved ? "Remove from" : "Add to"} watchlist: ${titleOf(it)}`);
  }
}

/* ============================== VIEW: DETAIL (NEON film page) ============================== */
async function viewDetail(route, token) {
  const { type, id } = route;
  app.innerHTML = `<section class="hero sk"></section><section class="sec"><div class="dt-grid"><div class="dt-poster sk"></div><div></div><div></div></div></section>`;
  const append = type === "movie" ? "credits,videos,recommendations,similar,release_dates" : "credits,videos,recommendations,similar,content_ratings";
  const d = await tmdb(`/${type}/${encodeURIComponent(id)}`, { append_to_response: append });
  if (!Object.keys(genreNames).length) await loadGenreNames();
  if (!live(token)) return;
  const item = { ...d, media_type: type };
  remember([item]);
  pushRecent(item);
  const title = titleOf(item);
  document.title = `${title} — MOVIEFREE`;

  const crew = (d.credits && d.credits.crew) || [];
  const cast = ((d.credits && d.credits.cast) || []).slice(0, 18);
  const directors = type === "movie" ? crew.filter((c) => c.job === "Director") : d.created_by || [];
  const writers = type === "movie" ? crew.filter((c) => c.department === "Writing").filter((c, i, a) => a.findIndex((x) => x.id === c.id) === i).slice(0, 3) : [];
  const trailer = pickTrailer(d.videos && d.videos.results);
  const recSource = ((d.recommendations && d.recommendations.results) || []).length ? d.recommendations.results : (d.similar && d.similar.results) || [];
  const recs = withType(type)(recSource).filter((x) => x.backdrop_path);
  const released = d.release_date || d.first_air_date;
  const relDate = parseLocalDate(released);
  const daysSince = relDate ? (todayStart() - relDate) / 864e5 : 9999;
  let chip = yearOf(item);
  if (checkIsUpcoming(item)) chip = `${type === "tv" ? "Premieres" : "In Theaters"} ${fmtDate(released)}`;
  else if (type === "movie" && daysSince <= 45) chip = "In Theaters";
  else if (type === "tv" && d.in_production) chip = "Now Airing";
  const runtime =
    type === "movie"
      ? d.runtime
        ? `${Math.floor(d.runtime / 60)}h ${d.runtime % 60}m`
        : ""
      : d.episode_run_time && d.episode_run_time[0]
        ? `${d.episode_run_time[0]} min / episode`
        : "";
  let cert = "";
  if (type === "movie" && d.release_dates) {
    const us = (d.release_dates.results || []).find((r) => r.iso_3166_1 === "US");
    cert = us ? ((us.release_dates || []).find((x) => x.certification) || {}).certification || "" : "";
  } else if (d.content_ratings) {
    const us = (d.content_ratings.results || []).find((r) => r.iso_3166_1 === "US");
    cert = us ? us.rating : "";
  }
  const saved = isSaved(type, d.id);
  const people = (list) => list.map((p) => `<a href="?person=${p.id}" data-link>${esc(p.name)}</a>`).join("<br>");
  const originalTitle = d.original_title || d.original_name || "";
  const detailRows = [
    [type === "movie" ? "Directed by" : "Created by", people(directors)],
    ["Starring", people(cast.slice(0, 4))],
    ["Written by", people(writers)],
    ["Runtime", esc(runtime)],
    ["Seasons", type === "tv" ? esc(`${d.number_of_seasons || 0} seasons · ${d.number_of_episodes || 0} episodes`) : ""],
    ["Genres", esc((d.genres || []).map((g) => g.name).join(", "))],
    [type === "movie" ? "Release date" : "First aired", esc(fmtDate(released))],
    ["Rated", esc(cert)],
    ["TMDB score", d.vote_average ? esc(`${d.vote_average.toFixed(1)} / 10 · ${(d.vote_count || 0).toLocaleString()} votes`) : ""],
    ["Original title", originalTitle && originalTitle !== title ? esc(originalTitle) : ""],
  ].filter((r) => r[1]);
  const trailerAttrs = `data-action="trailer" data-type="${type}" data-id="${d.id}" data-title="${esc(title)}"`;
  const backdrop = d.backdrop_path;
  const canWatch = !checkIsUpcoming(item);
  const prog = type === "tv" ? store.get(PROGRESS_KEY, {})[`tv:${d.id}`] : null;
  const watchLabel = prog ? `Resume S${prog.s}:E${prog.e}` : type === "tv" ? "Watch S1:E1" : "Watch Now";

  app.innerHTML = `
    <section class="hero hero--detail on-dark" aria-label="${esc(title)}">
      <div class="hero-slide is-active">
        ${backdrop ? `<img class="hero-img" src="${img("w1280", backdrop)}" srcset="${heroSrcset(backdrop)}" sizes="100vw" alt="" fetchpriority="high" />` : ""}
        <div class="hero-shade"></div>
        <div class="hero-copy">
          <div class="hero-chipwrap"><span class="chip">${esc(chip)}</span></div>
          <h1 class="hero-title display ${titleTier(title)}">${esc(title)}</h1>
          ${d.tagline ? `<p class="hero-tagline">${esc(d.tagline)}</p>` : ""}
          <div class="hero-cta">
            ${canWatch ? `<button type="button" class="cta-watch" ${watchAttrs(item)}>${ICON.watch}<span>${esc(watchLabel)}</span></button>` : ""}
            ${trailer ? `<button type="button" class="cta-line" ${trailerAttrs}>Trailer</button>` : ""}
            ${saveBtn(item, "detail-save", true)}
          </div>
        </div>
      </div>
    </section>

    <section class="sec">
      <div class="dt-grid">
        <div><img class="dt-poster" src="${d.poster_path ? img("w500", d.poster_path) : PLACEHOLDER}" ${d.poster_path ? tmdbSrcset(d.poster_path, [["w342", 342], ["w500", 500], ["w780", 780], ["original", 2000]], "(min-width: 2560px) 640px, (min-width: 1920px) 460px, (max-width: 900px) 60vw, 240px") : ""} alt="${esc(title)} poster" /></div>
        <div>
          <h2 class="dt-h">Synopsis</h2>
          <p class="dt-syn">${esc(d.overview || "No synopsis available yet.")}</p>
          ${trailer ? `<button type="button" class="btn-line mt-10" ${trailerAttrs}>${ICON.playXs} Watch Trailer</button>` : ""}
        </div>
        <div>
          <h2 class="dt-h">Additional Details</h2>
          ${detailRows.map(([k, v]) => `<div class="dt-k">${esc(k)}</div><div class="dt-v">${v}</div>`).join("")}
        </div>
      </div>
    </section>

    ${type === "tv" ? tvSeasonsSection(d) : ""}
    ${cast.length ? rowSection("Cast", cast.map((p) => portraitHTML(p, p.character)).join(""), { id: "row-cast" }) : ""}
    ${recs.length ? rowSection("More Like This", recs.map((m) => cardHTML(m, { chip: false })).join(""), { id: "row-recs" }) : ""}
  `;
  wireRows(app);
  setFooterStill(recs[0] || item);
  if (type === "tv") {
    const firstSeason = (d.seasons || []).find((s) => s.season_number > 0);
    if (firstSeason) loadEpisodes(d.id, firstSeason.season_number, token);
  }
}

function tvSeasonsSection(d) {
  const seasons = (d.seasons || []).filter((s) => s.season_number > 0);
  if (!seasons.length) return "";
  return `
    <section class="sec" aria-labelledby="seasons-h">
      <div class="sec-head"><h2 id="seasons-h" class="sec-title display">Seasons</h2></div>
      <div class="px-[var(--gutter)] flex flex-wrap gap-1 mb-8" role="group" aria-label="Choose a season">
        ${seasons.map((s, i) => `<button type="button" class="pill pill--ink" data-action="season" data-tv="${d.id}" data-season="${s.season_number}" aria-pressed="${i === 0}">Season ${s.season_number} · ${s.episode_count || 0} eps</button>`).join("")}
      </div>
      <div class="px-[var(--gutter)]" id="episodes" aria-live="polite"></div>
    </section>`;
}

async function loadEpisodes(tvId, seasonNum, token = routeToken) {
  const box = $("#episodes");
  if (!box) return;
  box.innerHTML = `<div class="tv-ep"><div class="sk" style="aspect-ratio:16/9;border-radius:5px"></div><div></div></div>`;
  const s = await fetchSeasonDetails(tvId, seasonNum);
  if (!live(token) || !$("#episodes")) return;
  if (!s || !s.episodes) {
    box.innerHTML = `<p class="text-[13px]">Episode list unavailable.</p>`;
    return;
  }
  box.innerHTML = s.episodes
    .map(
      (ep) => `
      <article class="tv-ep">
        <button type="button" class="tv-ep-play" data-action="watch" data-type="tv" data-id="${esc(tvId)}" data-season="${esc(seasonNum)}" data-episode="${esc(ep.episode_number)}" aria-label="Play episode ${esc(ep.episode_number)}: ${esc(ep.name || "")}">
          <img src="${ep.still_path ? img("w300", ep.still_path) : PLACEHOLDER}" ${ep.still_path ? tmdbSrcset(ep.still_path, [["w300", 300], ["original", 1280]], "(max-width: 640px) 120px, (min-width: 2560px) 480px, (min-width: 1920px) 360px, 200px") : ""} alt="" loading="lazy" /><span aria-hidden="true">${ICON.watch}</span>
        </button>
        <div>
          <div class="dt-k">S${esc(seasonNum)} · E${esc(ep.episode_number)}${ep.air_date ? " — " + esc(fmtDate(ep.air_date)) : ""}${ep.runtime ? " · " + esc(ep.runtime) + " min" : ""}</div>
          <h3 class="text-[17px] font-bold uppercase leading-tight">${esc(ep.name || "Episode " + ep.episode_number)}</h3>
          <p class="text-[13px] leading-snug mt-2 max-w-3xl text-neutral-700">${esc(truncate(ep.overview, 320))}</p>
        </div>
      </article>`,
    )
    .join("");
}

/* ============================== VIEW: PERSON (NEON) ============================== */
async function viewPerson(route, token) {
  app.innerHTML = `<div class="pt-[calc(var(--hdr-h)+120px)] px-[var(--gutter)]"><div class="sk" style="height:160px;width:60%"></div></div>`;
  const d = await tmdb(`/person/${encodeURIComponent(route.id)}`, { append_to_response: "combined_credits" });
  if (!live(token)) return;
  document.title = `${d.name} — MOVIEFREE`;
  const all = ((d.combined_credits && d.combined_credits.cast) || []).concat((d.combined_credits && d.combined_credits.crew) || []);
  const credits = remember(
    all
      .filter((c, i, arr) => c.backdrop_path && arr.findIndex((x) => x.id === c.id && x.media_type === c.media_type) === i)
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 20),
  );
  const facts = [
    ["Known for", d.known_for_department],
    ["Born", fmtDate(d.birthday)],
    ["Place of birth", d.place_of_birth],
    ["Died", fmtDate(d.deathday)],
  ].filter((r) => r[1]);
  app.innerHTML = `
    <div style="padding-top:calc(var(--hdr-h) + clamp(60px, 8vw, 120px))">
      <div class="px-[var(--gutter)] mb-4"><span class="chip">${esc(d.known_for_department || "Person")}</span></div>
      <h1 class="pg-title display">${esc(d.name)}</h1>
    </div>
    <section class="sec" style="padding-top:clamp(56px,7vw,110px)">
      <div class="dt-grid">
        <div><img class="dt-poster" src="${d.profile_path ? img("h632", d.profile_path) : PLACEHOLDER}" ${d.profile_path ? tmdbSrcset(d.profile_path, [["w342", 342], ["h632", 632], ["original", 2000]], "(min-width: 2560px) 640px, (min-width: 1920px) 460px, (max-width: 900px) 60vw, 240px") : ""} alt="${esc(d.name)}" /></div>
        <div><h2 class="dt-h">Biography</h2><p class="dt-syn" style="font-size:16px;line-height:1.4">${esc(truncate(d.biography || "No biography available.", 1100))}</p></div>
        <div><h2 class="dt-h">Additional Details</h2>${facts.map(([k, v]) => `<div class="dt-k">${esc(k)}</div><div class="dt-v">${esc(v)}</div>`).join("")}</div>
      </div>
    </section>
    ${credits.length ? rowSection("Known For", credits.map((m) => cardHTML(m, { chip: false, sub: (x) => [yearOf(x), x.character || x.job].filter(Boolean).join(" · ") })).join(""), { id: "row-known" }) : ""}`;
  wireRows(app);
}

/* ============================== VIEW: SEARCH RESULTS (Criterion) ============================== */
function srHead(q) {
  return `
    <section class="sr-head">
      <form data-sr-form role="search" novalidate>
        <label class="s-label" for="sr-input">Search</label>
        <div class="s-field s-field--white">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="1.7" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.75"/><path d="M15.5 15.5 21 21"/></svg>
          <input id="sr-input" class="s-input" type="search" value="${esc(q)}" placeholder="Search" spellcheck="false" autocomplete="off" />
          <button class="s-submit" type="submit" aria-label="Search">${ICON.next}</button>
        </div>
      </form>
    </section>`;
}

const TYPE_LABEL = { movie: "Film", tv: "Television", person: "Person" };
const VIEW_LABEL = { movie: "View Film", tv: "View Series", person: "View Person" };

function postHTML(it, q) {
  const t = typeOf(it);
  const date = t === "person" ? "" : fmtDate(it.release_date || it.first_air_date);
  const known = (it.known_for || []).map(titleOf).slice(0, 3).join(", ");
  const excerpt = t === "person" ? `Known for ${it.known_for_department || "film"}${known ? " — " + known : ""}.` : truncate(it.overview, 300);
  return `
    <article class="sr-post">
      <h3 class="sr-post-h"><a href="${hrefOf(it)}" data-link>${esc(titleOf(it))}</a><span>${TYPE_LABEL[t] || ""}</span></h3>
      <p class="sr-post-p">${date ? `<span class="sr-post-d">${esc(date)} —</span>` : ""}${esc(excerpt)}</p>
      <a class="sr-post-v" href="${hrefOf(it)}" data-link>${VIEW_LABEL[t] || "View"}</a>
    </article>`;
}

function coverHTML(it, q) {
  const t = typeOf(it);
  const path = t === "person" ? it.profile_path : it.poster_path;
  const meta = t === "person" ? it.known_for_department || "" : [yearOf(it), firstGenre(it)].filter(Boolean).join(", ");
  return `<a class="sr-cover" href="${hrefOf(it)}" data-link>
      <img src="${path ? img("w342", path) : PLACEHOLDER}" ${path ? tmdbSrcset(path, [["w185", 185], ["w342", 342], ["w500", 500], ["original", 1000]], "(max-width: 640px) 46vw, (min-width: 1920px) 18vw, 14vw") : ""} alt="" loading="lazy" decoding="async" />
      <div class="sr-cover-t">${esc(titleOf(it))}</div>
      ${meta ? `<div class="sr-cover-m">${esc(meta)}</div>` : ""}
    </a>`;
}

function landHTML(it, q) {
  const path = it.backdrop_path || it.poster_path;
  const src = path ? img("w780", path) : PLACEHOLDER;
  return `<a class="sr-land" href="${hrefOf(it)}" data-link>
      <img src="${src}" ${path ? tmdbSrcset(path, [["w780", 780], ["w1280", 1280], ["original", 3840]], "(max-width: 640px) 46vw, 20vw") : ""} alt="" loading="lazy" decoding="async" />
      <div class="sr-cover-t">${esc(titleOf(it))}</div>
      ${yearOf(it) ? `<div class="sr-cover-m">${esc(yearOf(it))}</div>` : ""}
    </a>`;
}

function pagerHTML(page, total, hrefFor) {
  if (total <= 1) return "";
  return `<nav class="sr-pager" aria-label="Pagination">
      ${page > 1 ? `<a href="${hrefFor(page - 1)}" data-link aria-label="Previous page">${ICON.prev}</a>` : ""}
      <span aria-current="page">${page}</span><span class="of">of</span><span>${total}</span>
      ${page < total ? `<a href="${hrefFor(page + 1)}" data-link aria-label="Next page">${ICON.next}</a>` : ""}
    </nav>`;
}

// Mixed result list at 10 per page (Criterion's editorial page size) over TMDB's 20-per-page multi search.
async function mixedPage(q, page) {
  const data = await searchAllContent(q, Math.ceil(page / 2));
  const offset = page % 2 === 1 ? 0 : 10;
  const totalResults = Math.min(data.total_results || 0, 10000);
  const items = (data.results || []).slice(offset, offset + 10).filter((r) => ["movie", "tv", "person"].includes(r.media_type));
  return { items: remember(items), totalPages: Math.max(1, Math.ceil(totalResults / 10)), totalResults };
}

async function viewSearch(route, token) {
  const { q, view, page, sort } = route;
  document.title = q ? `Search: ${q} — MOVIEFREE` : "Search — MOVIEFREE";
  app.innerHTML =
    srHead(q) +
    `<section class="sr-body"><div class="sr-sechead"><span class="sr-seclabel">Searching…</span></div><div class="sr-covers">${'<div><div class="sk" style="aspect-ratio:2/3"></div></div>'.repeat(7)}</div></section>`;
  wireSrForm();
  searchInput.value = q;
  if (topSearchInput) topSearchInput.value = q;
  if (!q) {
    $(".sr-body", app).innerHTML = `<p class="sr-empty">Type a film, series or person above and press Enter.</p>`;
    return;
  }
  if (!Object.keys(genreNames).length) await loadGenreNames();
  if (view === "pages") return viewSearchPages(q, page, token);
  if (["films", "tv", "people"].includes(view)) return viewSearchAll(q, view, page, sort, token);

  const empty = { results: [], total_results: 0 };
  const [films, tv, people, mixed] = await Promise.all([
    tmdb("/search/movie", { query: q, include_adult: "false" }).catch(() => empty),
    tmdb("/search/tv", { query: q, include_adult: "false" }).catch(() => empty),
    tmdb("/search/person", { query: q, include_adult: "false" }).catch(() => empty),
    mixedPage(q, 1),
  ]);
  if (!live(token)) return;
  const f = remember(withType("movie")(films.results));
  const t = remember(withType("tv")(tv.results));
  const p = remember(withType("person")(people.results)).slice().sort((a, b) => Number(Boolean(b.profile_path)) - Number(Boolean(a.profile_path)));
  const body = $(".sr-body", app);

  if (!films.total_results && !tv.total_results && !people.total_results && !mixed.totalResults) {
    body.innerHTML = `<p class="sr-empty">No results for “<b>${esc(q)}</b>”.<br>Check the spelling, try fewer words, or browse <a class="sr-back" href="?browse=movies" data-link>All Films</a> and <a class="sr-back" href="?browse=trending" data-link>Trending</a>.</p>`;
    return;
  }

  const enc = encodeURIComponent(q);
  const viewAll = (v, n, limit) => (n > limit ? `<a class="sr-viewall" href="?q=${enc}&view=${v}" data-link>View All <i>${ICON.ne}</i></a>` : "");
  const section = (label, total, v, limit, inner) =>
    `<section class="sr-sec"><div class="sr-sechead"><h2 class="sr-seclabel">${label} <span>(${total.toLocaleString()})</span></h2>${viewAll(v, total, limit)}</div>${inner}</section>`;
  body.innerHTML = `
    ${f.length ? section("Films", films.total_results, "films", 7, `<div class="sr-covers">${f.slice(0, 7).map((x) => coverHTML(x, q)).join("")}</div>`) : ""}
    ${t.length ? section("Television", tv.total_results, "tv", 5, `<div class="sr-lands">${t.slice(0, 5).map((x) => landHTML(x, q)).join("")}</div>`) : ""}
    ${p.length ? section("People", people.total_results, "people", 7, `<div class="sr-covers">${p.slice(0, 7).map((x) => coverHTML(x, q)).join("")}</div>`) : ""}
    <section class="sr-sec" aria-label="All results" style="margin-top:80px">
      ${mixed.items.map((x) => postHTML(x, q)).join("")}
      ${pagerHTML(1, mixed.totalPages, (n) => `?q=${enc}&view=pages&p=${n}`)}
    </section>`;
}

async function viewSearchPages(q, page, token) {
  const data = await mixedPage(q, page);
  if (!live(token)) return;
  const enc = encodeURIComponent(q);
  $(".sr-body", app).innerHTML = `
    <div class="mb-14"><h1 class="sr-pagetitle">${esc(q)}</h1><a class="sr-back mt-4 inline-block" href="?q=${enc}" data-link>← Back to Search</a></div>
    ${data.items.length ? data.items.map((x) => postHTML(x, q)).join("") : `<p class="sr-empty">No more results.</p>`}
    ${pagerHTML(Math.min(page, data.totalPages), data.totalPages, (n) => (n === 1 ? `?q=${enc}` : `?q=${enc}&view=pages&p=${n}`))}`;
}

async function viewSearchAll(q, view, page, sort, token) {
  const endpoint = { films: "/search/movie", tv: "/search/tv", people: "/search/person" }[view];
  const type = { films: "movie", tv: "tv", people: "person" }[view];
  const label = { films: "Films", tv: "Television", people: "People" }[view];
  const data = await tmdb(endpoint, { query: q, page, include_adult: "false" });
  if (!live(token)) return;
  let items = remember(withType(type)(data.results));
  const dateOf = (x) => x.release_date || x.first_air_date || "";
  if (sort === "newest") items = [...items].sort((a, b) => dateOf(b).localeCompare(dateOf(a)));
  if (sort === "oldest") items = [...items].sort((a, b) => (dateOf(a) || "9999").localeCompare(dateOf(b) || "9999"));
  if (sort === "popular") items = [...items].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  const enc = encodeURIComponent(q);
  const href = (n, s = sort) => `?q=${enc}&view=${view}${n > 1 ? `&p=${n}` : ""}${s !== "relevance" ? `&sort=${s}` : ""}`;
  const sorts = type === "person" ? ["relevance", "popular"] : ["relevance", "newest", "oldest", "popular"];
  $(".sr-body", app).innerHTML = `
    <a class="sr-back" href="?q=${enc}" data-link>← Back to Search</a>
    <div class="sr-sechead" style="margin-top:28px;flex-wrap:wrap;gap:16px">
      <h1 class="sr-seclabel">Related ${label} <span>(${(data.total_results || 0).toLocaleString()})</span></h1>
      <div class="sr-sort" role="group" aria-label="Sort by">${sorts.map((s) => `<button type="button" data-action="sort" data-href="${href(1, s)}" aria-pressed="${s === sort}">${s}</button>`).join("")}</div>
    </div>
    ${items.length ? `<div class="sr-covers sr-covers--grid">${items.map((x) => coverHTML(x, q)).join("")}</div>` : `<p class="sr-empty">No ${label.toLowerCase()} match “<b>${esc(q)}</b>”.</p>`}
    <div style="margin-top:56px">${pagerHTML(page, Math.min(data.total_pages || 1, 500), (n) => href(n))}</div>`;
}

function wireSrForm() {
  const form = $("[data-sr-form]", app);
  if (!form) return;
  const input = $("#sr-input", form);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (q) navigate(`?q=${encodeURIComponent(q)}`);
    else input.focus();
  });
  // Criterion focuses the field when the results page is opened directly.
  setTimeout(() => {
    if (!activeDrawer && document.activeElement === document.body) input.focus({ preventScroll: true });
  }, 60);
}

/* ============================== VIEW: BROWSE (NEON catalogue + genre / availability filters) ============================== */
function liveChannelCardHTML(channel) {
  return `<article class="card card--station">
    <button type="button" class="block w-full text-left" data-action="live-channel" data-channel="${esc(channel.id)}" aria-label="Watch ${esc(channel.name)} live">
      <div class="card-media" style="position:relative;overflow:hidden;background:#111;display:flex;align-items:center;justify-content:center;min-height:0">
        ${channel.image ? `<img src="${esc(channel.image)}" alt="${esc(channel.name)} official channel" loading="lazy" referrerpolicy="no-referrer" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.82" onerror="this.hidden=true" />` : ""}
        <span style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.12),rgba(0,0,0,.7))"></span>
        <span class="card-chip" style="position:relative;z-index:1">LIVE</span>
        <span class="station-name display">${esc(channel.name)}</span>
      </div>
      <div class="card-t">${esc(channel.name)}</div>
      <div class="card-t-sub">${esc(channel.source)}</div>
    </button>
    ${channel.fallbackUrl ? `<a href="${esc(channel.fallbackUrl)}" target="_blank" rel="noopener noreferrer" class="block mt-2 text-[11px] font-bold underline">Official website</a>` : ""}
  </article>`;
}

async function viewLiveTv(route, token) {
  document.title = "Live TV — MOVIEFREE";
  app.innerHTML = `<div style="padding-top:calc(var(--hdr-h) + clamp(48px, 7vw, 110px))">
      <h1 class="pg-title display">Live TV</h1>
      <p class="px-[var(--gutter)] mt-4 text-[13px] font-bold uppercase">Official free streams from broadcaster YouTube channels</p>
    </div>
    <section style="padding-top:56px">
      <h2 class="px-[var(--gutter)] mb-5 text-[13px] font-bold uppercase">Kenya</h2>
      <div class="grid4">${LIVE_CHANNELS.map(liveChannelCardHTML).join("")}</div>
      <h2 class="px-[var(--gutter)] mt-14 mb-5 text-[13px] font-bold uppercase">International News</h2>
      <div class="grid4">${INTERNATIONAL_CHANNELS.map(liveChannelCardHTML).join("")}</div>
      <p class="px-[var(--gutter)] mt-8 text-[12px] text-slate-500">Streams depend on broadcaster schedules, regional restrictions, and embedding permissions. Official websites may have different availability.</p>
    </section>`;
  if (live(token)) requestAnimationFrame(() => fitDisplay(app));
}

const BROWSE = {
  all: { title: "All Titles", filters: true },
  movies: { title: "All Films", path: "/discover/movie", type: "movie", params: { sort_by: "popularity.desc" }, filters: true },
  "now-playing": { title: "In Theaters", path: "/movie/now_playing", type: "movie", params: { region: "US" }, chip: "In Theaters" },
  upcoming: { title: "Coming Soon", path: "/movie/upcoming", type: "movie", params: { region: "US" }, onlyUpcoming: true },
  "top-rated": { title: "Top Rated", path: "/movie/top_rated", type: "movie", rating: true },
  trending: { title: "Trending", path: "/trending/all/day", filters: true },
  tv: { title: "Television", path: "/discover/tv", type: "tv", params: { sort_by: "popularity.desc" }, filters: true },
  "tv-top": { title: "Top Rated Series", path: "/tv/top_rated", type: "tv", rating: true },
  watchlist: { title: "Watchlist", local: WATCH_KEY },
  recent: { title: "Recently Viewed", local: RECENT_KEY },
};
let browseState = null;

async function viewBrowse(route, token) {
  if (route.kind === "live-tv") return viewLiveTv(route, token);
  const cfg = BROWSE[route.kind] || BROWSE.movies;
  document.title = `${cfg.title} — MOVIEFREE`;
  const genreName = route.genre ? (GENRES.find((g) => g.id === route.genre) || {}).name : "";
  const statusName = { released: "Available Now", upcoming: "Upcoming / Unreleased" }[route.status] || "";
  const sub = [genreName, statusName].filter(Boolean).join(" · ");
  browseState = { route, cfg, page: 1, items: [], token };
  app.innerHTML = `
    <div style="padding-top:calc(var(--hdr-h) + clamp(48px, 7vw, 110px))">
      <h1 class="pg-title display">${esc(cfg.title)}</h1>
      ${sub ? `<p class="px-[var(--gutter)] mt-4 text-[13px] font-bold uppercase">${esc(sub)}</p>` : ""}
    </div>
    ${cfg.filters ? filterBarHTML(route) : ""}
    <section style="padding-top:56px">
      <div class="grid4" id="browse-grid">${'<div class="card"><div class="card-media sk"></div></div>'.repeat(8)}</div>
      <div class="flex justify-center mt-16" id="browse-more"></div>
    </section>`;
  if (!Object.keys(genreNames).length) await loadGenreNames();
  await loadBrowsePage(token);
}

function filterBarHTML(route) {
  const n = (route.genre ? 1 : 0) + (route.status !== "all" ? 1 : 0);
  return `
    <div class="mt-10 filter-sticky">
      <button type="button" class="filterbar" data-action="filter-toggle" aria-expanded="false" aria-controls="filter-panel">
        <span>Filter${n ? ` (${n})` : ""}</span>${ICON.plus}
      </button>
      <div class="filterpanel hidden on-dark" id="filter-panel">
        <div class="fp-h">Genre</div>
        <div>${GENRES.map((g) => `<button type="button" class="pill" data-action="set-filter" data-key="genre" data-val="${esc(g.id)}" aria-pressed="${route.genre === g.id}">${esc(g.name)}</button>`).join("")}</div>
        <div class="fp-h">Availability</div>
        <div>${[["all", "All Releases"], ["released", "Available Now"], ["upcoming", "Upcoming / Unreleased"]].map(([v, label]) => `<button type="button" class="pill" data-action="set-filter" data-key="status" data-val="${v}" aria-pressed="${route.status === v}">${label}</button>`).join("")}</div>
        ${n ? `<button type="button" class="mt-3 text-[11px] font-bold uppercase underline" data-action="clear-filters">Clear all</button>` : ""}
      </div>
    </div>`;
}

function applyStatus(list, status) {
  if (status === "released") return list.filter((item) => !checkIsUpcoming(item));
  if (status === "upcoming") return list.filter((item) => checkIsUpcoming(item));
  return list;
}

async function loadBrowsePage(token) {
  const st = browseState;
  if (!st || !live(token)) return;
  const { route, cfg } = st;
  let batch = [];
  let hasMore = false;
  if (cfg.local) {
    batch = store.get(cfg.local, []);
  } else if (route.kind === "all" || (route.kind === "trending" && route.genre)) {
    batch = route.genre ? await fetchContentByGenre(route.genre, st.page, route.status) : await getTrendingContent();
    hasMore = Boolean(route.genre) && st.page < 10;
  } else {
    const params = { ...(cfg.params || {}), page: st.page };
    if (cfg.path.startsWith("/discover")) {
      if (route.genre) params.with_genres = route.genre;
      Object.assign(params, statusParams(route.status, cfg.type));
    }
    const data = await tmdb(cfg.path, params);
    batch = cfg.type ? withType(cfg.type)(data.results) : (data.results || []).filter((x) => x.media_type !== "person");
    hasMore = st.page < Math.min(data.total_pages || 1, 20);
  }
  if (!live(token)) return;
  if (cfg.onlyUpcoming) batch = batch.filter((m) => checkIsUpcoming(m));
  batch = applyStatus(batch, route.status);
  remember(batch);
  const seen = new Set(st.items.map(keyOf));
  const fresh = batch.filter((x) => !seen.has(keyOf(x)));
  st.items.push(...fresh);
  const grid = $("#browse-grid");
  if (!grid) return;
  if (st.page === 1) grid.innerHTML = "";
  grid.insertAdjacentHTML("beforeend", fresh.map((m) => cardHTML(m, { chip: cfg.chip, rating: cfg.rating, markTv: true })).join(""));
  if (!st.items.length) {
    grid.outerHTML = cfg.local
      ? `<div class="text-center px-[var(--gutter)] py-10"><p class="display text-[clamp(44px,6vw,88px)]">${route.kind === "watchlist" ? "Your watchlist is empty" : "Nothing viewed yet"}</p><div class="mx-auto mt-10 grid gap-2 max-w-md"><a class="btn-black" href="?browse=movies" data-link>View Films</a><a class="btn-black" href="?browse=trending" data-link>What's Trending</a></div></div>`
      : `<div class="text-center px-[var(--gutter)] py-10"><p class="display text-[clamp(44px,6vw,88px)]">No titles match</p><button type="button" class="btn-black mt-10" data-action="clear-filters">Clear filters</button></div>`;
  }
  const more = $("#browse-more");
  if (more) more.innerHTML = hasMore ? `<button type="button" class="btn-black" data-action="load-more">Load More</button>` : "";
}

/* ============================== FOOTER WORDMARK (own outlined MOVIEFREE, TMDB still in the O) ============================== */
let footerStill = null;
function setFooterStill(item) {
  if (!item || !item.backdrop_path) return;
  footerStill = item;
  buildWordmark();
}

function buildWordmark() {
  const host = $("#ft-word");
  if (!host) return;
  const fs = 100;
  const canvas = buildWordmark.canvas || (buildWordmark.canvas = document.createElement("canvas"));
  const ctx = canvas.getContext("2d");
  ctx.font = `${fs}px Anton`;
  const capH = Math.round(ctx.measureText("M").actualBoundingBoxAscent || 74);
  const gap = 3;
  const tileW = Math.round(capH * 0.78);
  const parts = [];
  let x = 0;
  "MOVIEFREE".split("").forEach((ch, i) => {
    if (i === 1) {
      parts.push({ tile: true, x, w: tileW });
      x += tileW + gap;
      return;
    }
    const w = ctx.measureText(ch).width;
    parts.push({ ch, x, w });
    x += w + gap;
  });
  const W = Math.ceil(x - gap);
  const it = footerStill;
  const t = parts[1];
  const r = tileW * 0.3;
  const capLine1 = it ? esc(titleOf(it).toUpperCase().slice(0, 24)) : "";
  const capLine2 = it ? esc([yearOf(it), typeOf(it) === "tv" ? "Series" : "Film"].filter(Boolean).join(", ")) : "";
  host.innerHTML = `<svg viewBox="0 0 ${W} ${capH}" width="100%" aria-hidden="true" style="display:block;overflow:visible">
    <defs>
      <filter id="ft-inline" x="-2%" y="-2%" width="104%" height="104%">
        <feMorphology in="SourceAlpha" operator="erode" radius="3.4" result="e1"/>
        <feMorphology in="SourceAlpha" operator="erode" radius="4.9" result="e2"/>
        <feComposite in="e1" in2="e2" operator="out" result="ring"/>
        <feFlood flood-color="#fff" result="white"/>
        <feComposite in="white" in2="ring" operator="in" result="line"/>
        <feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="line"/></feMerge>
      </filter>
      <clipPath id="ft-clip"><rect x="${t.x}" y="0" width="${tileW}" height="${capH}" rx="${r}" ry="${r}"/></clipPath>
    </defs>
    <rect x="${t.x}" y="0" width="${tileW}" height="${capH}" rx="${r}" fill="#111"/>
    ${it ? `<image href="${img("w780", it.backdrop_path)}" x="${t.x - tileW * 0.7}" y="0" width="${tileW * 2.4}" height="${capH}" preserveAspectRatio="xMidYMid slice" clip-path="url(#ft-clip)"/>` : ""}
    <rect x="${t.x}" y="0" width="${tileW}" height="${capH}" rx="${r}" fill="rgba(0,0,0,.2)"/>
    ${it ? `<g class="ft-cap" fill="#fff" font-family="Inter Tight, sans-serif" font-size="3.4"><text x="${t.x + tileW * 0.12}" y="${capH * 0.5}" font-weight="700">${capLine1}</text><text x="${t.x + tileW * 0.12}" y="${capH * 0.5 + 4.6}">${capLine2}</text></g>` : ""}
    <g filter="url(#ft-inline)" font-family="Anton, Impact, sans-serif" font-size="${fs}" fill="#000">
      ${parts.filter((p) => !p.tile).map((p) => `<text x="${p.x.toFixed(2)}" y="${capH}">${p.ch}</text>`).join("")}
    </g>
  </svg>`;
}

/* ============================== GLOBAL EVENTS ============================== */
document.addEventListener("click", (e) => {
  const act = e.target.closest("[data-action]");
  if (act) {
    const a = act.dataset.action;
    switch (a) {
      case "search":
        e.preventDefault();
        return openDrawer("search", act);
      case "menu":
        e.preventDefault();
        return openDrawer("menu", act);
      case "install-app":
        e.preventDefault();
        return installWebApp();
      case "close-drawer":
        return closeDrawers();
      case "watchlist":
      case "account":
        return openDropdown(act, a);
      case "trailer":
        e.preventDefault();
        return openTrailer(act.dataset.type, act.dataset.id, act.dataset.title, act);
      case "close-trailer":
        return closeTrailer();
      case "watch":
        e.preventDefault();
        return openPlayer({ type: act.dataset.type, id: act.dataset.id, title: act.dataset.title, season: act.dataset.season, episode: act.dataset.episode }, act);
      case "live-channel": {
        e.preventDefault();
        const channel = [...LIVE_CHANNELS, ...INTERNATIONAL_CHANNELS].find((item) => item.id === act.dataset.channel);
        return openLiveChannel(channel, act);
      }
      case "hero-play": {
        const it = heroState.items[heroState.i];
        if (!it) return;
        if (checkIsUpcoming(it)) return openTrailer(typeOf(it), it.id, titleOf(it), act);
        return openPlayer({ type: typeOf(it), id: it.id, title: titleOf(it) }, act);
      }
      case "close-player":
        return closePlayer();
      case "pl-server":
        if (!plState) return;
        plState.server = Number(act.dataset.i);
        store.set(SERVER_KEY, PLAYER_SERVERS[plState.server].id);
        $$(".pl-chip").forEach((c) => c.setAttribute("aria-checked", String(c === act)));
        syncServerNote();
        toggleServers(false);
        return loadSource();
      case "pl-servers":
        return plState && toggleServers();
      case "pl-episodes":
        return plState && toggleEpisodes();
      case "pl-fullscreen":
        return toggleFullscreen();
      case "pl-next": {
        const n = plState && nextEpisode();
        if (n) goEpisode(n.season, n.episode);
        return;
      }
      case "pl-ep":
        if (!plState) return;
        goEpisode(Number(act.dataset.s), Number(act.dataset.e));
        if (window.innerWidth < 768) toggleEpisodes(false);
        return;
      case "hero-trailer": {
        const it = heroState.items[heroState.i];
        if (it) openTrailer(typeOf(it), it.id, titleOf(it), act);
        return;
      }
      case "save-item": {
        const it = itemIndex.get(`${act.dataset.type}:${act.dataset.id}`) || itemIndex.get(`${act.dataset.type}:${Number(act.dataset.id)}`);
        if (it) toggleSaved(it);
        return syncSaveButtons();
      }
      case "hero-save": {
        const it = heroState.items[heroState.i];
        if (it) toggleSaved(it);
        return syncHeroActions();
      }
      case "detail-save": {
        const r = parseRoute();
        const it = itemIndex.get(`${r.type}:${r.id}`) || itemIndex.get(`${r.type}:${Number(r.id)}`);
        if (!it) return;
        const on = toggleSaved(it);
        act.classList.toggle("is-saved", on);
        act.setAttribute("aria-pressed", String(on));
        act.setAttribute("aria-label", `${on ? "Remove from" : "Add to"} watchlist`);
        return;
      }
      case "hero-dot":
        return showHero(Number(act.dataset.i), true);
      case "row-prev":
        return scrollRow(act.dataset.row, -1);
      case "row-next":
        return scrollRow(act.dataset.row, 1);
      case "season":
        $$("[data-action='season']").forEach((b) => b.setAttribute("aria-pressed", String(b === act)));
        return loadEpisodes(act.dataset.tv, act.dataset.season);
      case "filter-toggle": {
        const panel = $("#filter-panel");
        const open = panel.classList.toggle("hidden") === false;
        act.setAttribute("aria-expanded", String(open));
        return;
      }
      case "set-filter": {
        const url = new URL(location.href);
        if (act.dataset.val && act.dataset.val !== "all") url.searchParams.set(act.dataset.key, act.dataset.val);
        else url.searchParams.delete(act.dataset.key);
        return navigate(url.search || "./", { replace: true });
      }
      case "clear-filters": {
        const url = new URL(location.href);
        url.searchParams.delete("genre");
        url.searchParams.delete("status");
        return navigate(url.search || "./", { replace: true });
      }
      case "load-more":
        if (browseState) {
          browseState.page++;
          act.disabled = true;
          act.textContent = "Loading…";
          loadBrowsePage(browseState.token);
        }
        return;
      case "sort":
        return navigate(act.dataset.href, { replace: true });
    }
  }

  if (openDD && !openDD.el.contains(e.target)) closeDropdown();

  const link = e.target.closest("a[href]");
  if (link && !link.target && !link.hasAttribute("download") && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
    const url = new URL(link.href, location.href);
    if (url.origin === location.origin && url.pathname === location.pathname && !url.hash) {
      e.preventDefault();
      navigate(url.search || url.pathname);
    }
  }
});

scrim.addEventListener("click", () => closeDrawers());

document.addEventListener("submit", (e) => {
  if (!e.target.closest("[data-newsletter]")) return;
  // Visual only: the newsletter form never sends anything anywhere.
  e.preventDefault();
  const note = $("[data-nl-note]");
  if (note) note.textContent = "The MOVIEFREE newsletter is coming soon. Nothing was sent.";
});

/* D-pad / arrow keys move between real controls. Enter and Space still activate buttons and links. */
function spatialNavScope() {
  if (plState) return player;
  if (activeDrawer) return activeDrawer;
  if (trailerModal && !trailerModal.classList.contains("hidden")) return trailerModal;
  if (videoModal && !videoModal.classList.contains("hidden")) return videoModal;
  if (openDD && openDD.el) return openDD.el;
  return document;
}

function isSpatialTarget(el) {
  if (!el || el.tabIndex < 0 || el.disabled) return false;
  if (el.closest("[hidden], [inert], [aria-hidden='true']")) return false;
  if (el.classList.contains("sr-only")) return false;
  const style = getComputedStyle(el);
  if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) return false;
  const box = el.getBoundingClientRect();
  return box.width >= 4 && box.height >= 4;
}

function spatialItems(scope) {
  const root = scope === document ? document : scope;
  return $$('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])', root).filter(isSpatialTarget);
}

function spatialCenter(el) {
  const box = el.getBoundingClientRect();
  return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
}

function pickSpatial(current, items, dir) {
  const from = spatialCenter(current);
  let best = null;
  let bestScore = Infinity;
  items.forEach((el) => {
    if (el === current) return;
    const to = spatialCenter(el);
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    let primary = 0;
    let secondary = 0;
    if (dir === "right") { primary = dx; secondary = Math.abs(dy); }
    else if (dir === "left") { primary = -dx; secondary = Math.abs(dy); }
    else if (dir === "down") { primary = dy; secondary = Math.abs(dx); }
    else { primary = -dy; secondary = Math.abs(dx); }
    if (primary < 8) return;
    const horizontal = dir === "left" || dir === "right";
    if (horizontal && secondary > primary * 0.9 + 40) return;
    if (!horizontal && secondary > primary * 4 + 160) return;
    const score = primary + secondary * (horizontal ? 3 : 0.45);
    if (score < bestScore) {
      bestScore = score;
      best = el;
    }
  });
  return best;
}

function focusSpatial(el) {
  el.focus({ preventScroll: true });
  const card = el.closest(".card, .tv-ep, .pl-ep") || el;
  card.scrollIntoView({ block: "nearest", inline: "nearest", behavior: reduceMotion.matches ? "auto" : "smooth" });
}

function isTypingField(el) {
  if (!el || !el.closest) return false;
  const tag = el.tagName;
  if (tag === "TEXTAREA" || tag === "SELECT") return true;
  if (tag === "INPUT" && el.type !== "button" && el.type !== "submit" && el.type !== "checkbox" && el.type !== "radio") return true;
  return el.isContentEditable;
}

document.addEventListener("keydown", (e) => {
  const dir = { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down" }[e.key];
  if (!dir || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
  if (isTypingField(e.target) && (dir === "left" || dir === "right")) return;
  if (e.target.closest && e.target.closest(".hero-dot") && (dir === "left" || dir === "right")) return;
  const scope = spatialNavScope();
  const items = spatialItems(scope);
  if (!items.length) return;
  const current = document.activeElement;
  const inside = current && items.includes(current);
  if (!inside) {
    if (dir === "down" || dir === "right") {
      e.preventDefault();
      focusSpatial(items[0]);
    }
    return;
  }
  const next = pickSpatial(current, items, dir);
  if (!next) return;
  e.preventDefault();
  focusSpatial(next);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (plState) return plEps.hidden ? closePlayer() : toggleEpisodes(false);
    if (!videoModal.classList.contains("hidden")) return closeModal();
    if (!trailerModal.classList.contains("hidden")) return closeTrailer();
    if (activeDrawer) return closeDrawers();
    if (openDD) {
      const btn = openDD.btn;
      closeDropdown();
      return btn.focus();
    }
    const panel = $("#filter-panel");
    if (panel && !panel.classList.contains("hidden")) {
      panel.classList.add("hidden");
      const t = $("[data-action='filter-toggle']");
      if (t) t.setAttribute("aria-expanded", "false");
    }
    return;
  }
  if (e.key === "Tab") {
    if (plState) trapFocus(e, player);
    else if (activeDrawer) trapFocus(e, activeDrawer);
    else if (!trailerModal.classList.contains("hidden")) trapFocus(e, trailerModal);
  }
});

window.addEventListener("popstate", () => {
  if (plIgnorePop) {
    plIgnorePop = false;
    return;
  }
  if (plState) return closePlayer({ fromPop: true });
  render();
});

let resizeRaf = null;
window.addEventListener("resize", () => {
  cancelAnimationFrame(resizeRaf);
  resizeRaf = requestAnimationFrame(() => {
    wireRows(app);
    fitDisplay(app);
  });
});

/* ============================== INSTALLABLE WEB APP ============================== */
let deferredInstallPrompt = null;

function isStandaloneMode() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

function updateInstallButtons() {
  const standalone = isStandaloneMode();
  $$('[data-action="install-app"]').forEach((button) => {
    button.hidden = standalone;
    button.setAttribute("aria-hidden", String(standalone));
  });
}

async function installWebApp() {
  if (activeDrawer) closeDrawers();
  if (isStandaloneMode()) return;
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    updateInstallButtons();
    return;
  }
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  alert(ios
    ? "To install MOVIEFREE on iPhone or iPad: tap Share, then choose Add to Home Screen."
    : "To install MOVIEFREE, open your browser menu and choose Install app or Add to Home Screen. If that option is unavailable, bookmark this site for quick access.");
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  updateInstallButtons();
});
window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;
  updateInstallButtons();
});
window.matchMedia("(display-mode: standalone)").addEventListener?.("change", updateInstallButtons);
updateInstallButtons();
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}

/* ============================== INIT ============================== */
function initMenuGenres() {
  const box = $("#menu-genres");
  if (!box) return;
  box.innerHTML = GENRES.filter((g) => g.id)
    .map((g) => `<a class="menu-link" href="?browse=all&amp;genre=${encodeURIComponent(g.id)}" data-link>${esc(g.name)}</a>`)
    .join("");
}

async function initApp() {
  $("#ft-year").textContent = new Date().getFullYear();
  initMenuGenres();
  updateWatchBadge();
  await render();
  if (!footerStill) {
    getTrendingContent()
      .then((t) => setFooterStill(t.find((x) => x.backdrop_path)))
      .catch(() => buildWordmark());
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(buildWordmark);
}

initApp();
