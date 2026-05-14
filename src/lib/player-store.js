import { get, writable } from 'svelte/store'
import { formatSeconds } from './time.js'

const STORAGE_KEY = 'artplay-player-state-v1'

const REPEAT_STEPS = ['off', 'one', 'all']

const initialState = {
  activeScreen: 'home',
  previousScreenStack: [],
  searchQuery: '',
  selectedArtistId: null,
  selectedAlbumId: null,
  currentTrackId: null,
  queueTrackIds: [],
  queueContext: null,
  currentTime: 0,
  duration: 0,
  isPlaying: false,
  volume: 1,
  muted: false,
  shuffle: false,
  repeatMode: 'off',
  visualizerMode: 'spectrum',
}

function loadPersistedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    return parsed
  } catch {
    return null
  }
}

function pickPersisted(state) {
  return {
    activeScreen: state.activeScreen,
    selectedArtistId: state.selectedArtistId,
    selectedAlbumId: state.selectedAlbumId,
    currentTrackId: state.currentTrackId,
    queueTrackIds: state.queueTrackIds,
    queueContext: state.queueContext,
    currentTime: state.currentTime,
    duration: state.duration,
    volume: state.volume,
    muted: state.muted,
    shuffle: state.shuffle,
    repeatMode: state.repeatMode,
    visualizerMode: state.visualizerMode,
  }
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function createPlayerStore() {
  const persisted = loadPersistedState()
  const seed = {
    ...initialState,
    ...(persisted ?? {}),
    activeScreen: ['home', 'authors', 'author', 'album', 'nowPlaying'].includes(persisted?.activeScreen)
      ? persisted.activeScreen
      : 'home',
    repeatMode: REPEAT_STEPS.includes(persisted?.repeatMode) ? persisted.repeatMode : 'off',
    volume: Number.isFinite(persisted?.volume) ? clamp(persisted.volume, 0, 1) : 1,
    currentTime: Number.isFinite(persisted?.currentTime) ? Math.max(0, persisted.currentTime) : 0,
    duration: Number.isFinite(persisted?.duration) ? Math.max(0, persisted.duration) : 0,
    previousScreenStack: [],
    queueTrackIds: Array.isArray(persisted?.queueTrackIds) ? persisted.queueTrackIds : [],
  }

  const { subscribe, update } = writable(seed)

  let saveTimer = null
  let library = null
  let audioContext = null
  let sourceNode = null
  let analyser = null

  const audio = new Audio()
  audio.preload = 'metadata'
  audio.volume = seed.volume
  audio.muted = seed.muted

  function queuePersist(state) {
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pickPersisted(state)))
    }, 250)
  }

  subscribe((state) => {
    queuePersist(state)
  })

  function patch(changes) {
    update((state) => ({ ...state, ...changes }))
  }

  function setLibrary(nextLibrary) {
    library = nextLibrary

    update((state) => {
      const next = { ...state }
      const allTrackIds = library.tracks.map((track) => track.id)

      if (next.selectedArtistId && !library.artistById.has(next.selectedArtistId)) {
        next.selectedArtistId = null
      }

      if (next.selectedAlbumId && !library.albumById.has(next.selectedAlbumId)) {
        next.selectedAlbumId = null
      }

      if (next.currentTrackId && !library.trackById.has(next.currentTrackId)) {
        next.currentTrackId = null
        next.isPlaying = false
        next.currentTime = 0
        next.duration = 0
      }

      next.queueTrackIds = (next.queueTrackIds ?? []).filter((id) => library.trackById.has(id))

      if (!next.currentTrackId && allTrackIds.length > 0) {
        const firstTrack = library.trackById.get(allTrackIds[0])
        next.currentTrackId = firstTrack?.id ?? null
        next.currentTime = 0
        next.duration = Number.isFinite(firstTrack?.durationSec) ? firstTrack.durationSec : 0
      }

      if (next.queueTrackIds.length === 0 && allTrackIds.length > 0) {
        next.queueTrackIds = allTrackIds
        if (!next.queueContext) {
          next.queueContext = { type: 'home', label: 'Главная' }
        }
      }

      return next
    })
  }

  function getTrack(trackId) {
    if (!library || !trackId) return null
    return library.trackById.get(trackId) ?? null
  }

  function ensureAudioGraph() {
    if (!audioContext) {
      audioContext = new AudioContext()
    }

    if (!sourceNode) {
      sourceNode = audioContext.createMediaElementSource(audio)
      analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      sourceNode.connect(analyser)
      analyser.connect(audioContext.destination)
    }
  }

  function ensureAnalyserReady() {
    try {
      ensureAudioGraph()
      return true
    } catch {
      return false
    }
  }

  async function playAudio() {
    try {
      ensureAudioGraph()
      if (audioContext.state !== 'running') {
        await audioContext.resume()
      }
      await audio.play()
      patch({ isPlaying: true })
    } catch {
      patch({ isPlaying: false })
    }
  }

  function pauseAudio() {
    audio.pause()
    patch({ isPlaying: false })
  }

  function loadTrackToAudio(trackId, seekTo = 0) {
    const track = getTrack(trackId)
    if (!track) return false

    audio.src = track.file

    if (Number.isFinite(seekTo) && seekTo > 0) {
      const setLater = () => {
        audio.currentTime = seekTo
        audio.removeEventListener('loadedmetadata', setLater)
      }
      audio.addEventListener('loadedmetadata', setLater)
    }

    patch({
      currentTrackId: trackId,
      duration: Number.isFinite(track.durationSec) ? track.durationSec : 0,
      currentTime: Number.isFinite(seekTo) ? Math.max(0, seekTo) : 0,
    })

    return true
  }

  function getQueueNextTrackId(state) {
    const queue = state.queueTrackIds
    if (!queue.length) return null
    if (!state.currentTrackId) return queue[0]

    if (state.shuffle) {
      if (queue.length === 1) return queue[0]
      let candidate = queue[Math.floor(Math.random() * queue.length)]
      let guard = 10
      while (candidate === state.currentTrackId && guard > 0) {
        candidate = queue[Math.floor(Math.random() * queue.length)]
        guard -= 1
      }
      return candidate
    }

    const index = queue.indexOf(state.currentTrackId)
    if (index === -1) return queue[0]
    if (index < queue.length - 1) return queue[index + 1]

    if (state.repeatMode === 'all') return queue[0]
    return null
  }

  function getQueuePrevTrackId(state) {
    const queue = state.queueTrackIds
    if (!queue.length) return null
    if (!state.currentTrackId) return queue[0]

    if (state.shuffle) {
      if (queue.length === 1) return queue[0]
      let candidate = queue[Math.floor(Math.random() * queue.length)]
      let guard = 10
      while (candidate === state.currentTrackId && guard > 0) {
        candidate = queue[Math.floor(Math.random() * queue.length)]
        guard -= 1
      }
      return candidate
    }

    const index = queue.indexOf(state.currentTrackId)
    if (index > 0) return queue[index - 1]
    if (state.repeatMode === 'all') return queue[queue.length - 1]
    return queue[0]
  }

  function setTrackQueue(queueTrackIds, queueContext) {
    const list = Array.isArray(queueTrackIds) ? queueTrackIds.filter((id) => getTrack(id)) : []
    patch({ queueTrackIds: list, queueContext: queueContext ?? null })
  }

  async function playTrack(trackId, options = {}) {
    const track = getTrack(trackId)
    if (!track) return

    const queueTrackIds = Array.isArray(options.queueTrackIds) ? options.queueTrackIds : null
    if (queueTrackIds) {
      setTrackQueue(queueTrackIds, options.queueContext ?? null)
    } else {
      const state = get(playerStore)
      if (!state.queueTrackIds.length) {
        setTrackQueue([trackId], options.queueContext ?? null)
      }
    }

    if (options.fromScreen) {
      patch({ activeScreen: options.fromScreen })
    }

    const seekTo = Number.isFinite(options.seekTo) ? options.seekTo : 0
    const loaded = loadTrackToAudio(trackId, seekTo)
    if (!loaded) return

    await playAudio()
  }

  async function playNext() {
    const state = get(playerStore)
    const nextId = getQueueNextTrackId(state)

    if (!nextId) {
      pauseAudio()
      patch({ currentTime: state.duration })
      return
    }

    const loaded = loadTrackToAudio(nextId, 0)
    if (!loaded) return
    await playAudio()
  }

  async function playPrev() {
    const state = get(playerStore)

    if (state.currentTime > 3) {
      seekTo(0)
      return
    }

    const prevId = getQueuePrevTrackId(state)
    if (!prevId) {
      seekTo(0)
      return
    }

    const loaded = loadTrackToAudio(prevId, 0)
    if (!loaded) return
    await playAudio()
  }

  async function togglePlayPause() {
    const state = get(playerStore)

    if (!state.currentTrackId) {
      const first = state.queueTrackIds[0]
      if (!first) return
      const loaded = loadTrackToAudio(first, 0)
      if (!loaded) return
      await playAudio()
      return
    }

    if (audio.paused) {
      if (!audio.src) {
        const loaded = loadTrackToAudio(state.currentTrackId, state.currentTime)
        if (!loaded) return
      }
      await playAudio()
    } else {
      pauseAudio()
    }
  }

  function seekTo(seconds) {
    const target = Number.isFinite(seconds) ? Math.max(0, seconds) : 0
    if (!Number.isFinite(audio.duration)) {
      audio.currentTime = target
      patch({ currentTime: target })
      return
    }

    const clamped = clamp(target, 0, audio.duration)
    audio.currentTime = clamped
    patch({ currentTime: clamped })
  }

  function skipBy(delta) {
    const state = get(playerStore)
    seekTo(state.currentTime + delta)
  }

  function setVolume(value) {
    const volume = clamp(Number(value), 0, 1)
    audio.volume = volume
    patch({ volume })
  }

  function toggleMute() {
    const next = !audio.muted
    audio.muted = next
    patch({ muted: next })
  }

  function toggleShuffle() {
    update((state) => ({ ...state, shuffle: !state.shuffle }))
  }

  function cycleRepeat() {
    update((state) => {
      const index = REPEAT_STEPS.indexOf(state.repeatMode)
      const next = REPEAT_STEPS[(index + 1) % REPEAT_STEPS.length]
      return { ...state, repeatMode: next }
    })
  }

  function setVisualizerMode(mode) {
    if (mode !== 'spectrum' && mode !== 'oscilloscope') return
    patch({ visualizerMode: mode })
  }

  function setSearchQuery(value) {
    patch({ searchQuery: value ?? '' })
  }

  function goToScreen(screen) {
    if (!['home', 'authors', 'author', 'album', 'nowPlaying'].includes(screen)) return

    update((state) => {
      if (screen === 'author' && !state.selectedArtistId) return state
      if (screen === 'album' && !state.selectedAlbumId) return state
      return { ...state, activeScreen: screen }
    })
  }

  function openAuthor(artistId) {
    update((state) => ({
      ...state,
      selectedArtistId: artistId,
      activeScreen: 'author',
    }))
  }

  function openAlbum(albumId) {
    const album = library?.albumById.get(albumId)
    update((state) => ({
      ...state,
      selectedAlbumId: albumId,
      selectedArtistId: album?.artistId ?? state.selectedArtistId,
      activeScreen: 'album',
    }))
  }

  function openCurrentTrackAuthor() {
    const state = get(playerStore)
    const track = getTrack(state.currentTrackId)
    if (!track) return
    openAuthor(track.artistId)
  }

  function openCurrentTrackAlbum() {
    const state = get(playerStore)
    const track = getTrack(state.currentTrackId)
    if (!track) return
    openAlbum(track.albumId)
  }

  function openNowPlaying() {
    ensureAnalyserReady()
    update((state) => {
      if (!state.currentTrackId) return state
      if (state.activeScreen === 'nowPlaying') return state
      return {
        ...state,
        previousScreenStack: [...state.previousScreenStack, state.activeScreen],
        activeScreen: 'nowPlaying',
      }
    })
  }

  function goBackFromNowPlaying() {
    update((state) => {
      if (state.activeScreen !== 'nowPlaying') return state
      const stack = [...state.previousScreenStack]
      const prev = stack.pop() ?? 'home'
      return {
        ...state,
        previousScreenStack: stack,
        activeScreen: prev,
      }
    })
  }

  function hydrateAudioFromState() {
    const state = get(playerStore)
    const track = getTrack(state.currentTrackId)
    if (!track) return

    loadTrackToAudio(track.id, state.currentTime)
    pauseAudio()
  }

  audio.addEventListener('timeupdate', () => {
    patch({ currentTime: audio.currentTime || 0 })
  })

  audio.addEventListener('loadedmetadata', () => {
    const state = get(playerStore)
    const fallback = getTrack(state.currentTrackId)?.durationSec
    patch({ duration: Number.isFinite(audio.duration) ? audio.duration : fallback ?? 0 })
  })

  audio.addEventListener('durationchange', () => {
    const state = get(playerStore)
    const fallback = getTrack(state.currentTrackId)?.durationSec
    patch({ duration: Number.isFinite(audio.duration) ? audio.duration : fallback ?? 0 })
  })

  audio.addEventListener('play', () => {
    patch({ isPlaying: true })
  })

  audio.addEventListener('pause', () => {
    patch({ isPlaying: false })
  })

  audio.addEventListener('ended', async () => {
    const state = get(playerStore)

    if (state.repeatMode === 'one') {
      seekTo(0)
      await playAudio()
      return
    }

    const nextId = getQueueNextTrackId(state)
    if (!nextId) {
      pauseAudio()
      patch({ currentTime: state.duration })
      return
    }

    const loaded = loadTrackToAudio(nextId, 0)
    if (!loaded) return
    await playAudio()
  })

  const playerStore = {
    subscribe,
    setLibrary,
    hydrateAudioFromState,
    setSearchQuery,
    goToScreen,
    openAuthor,
    openAlbum,
    openCurrentTrackAuthor,
    openCurrentTrackAlbum,
    ensureAnalyserReady,
    openNowPlaying,
    goBackFromNowPlaying,
    setTrackQueue,
    playTrack,
    playNext,
    playPrev,
    togglePlayPause,
    seekTo,
    skipBy,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
    setVisualizerMode,
    getCurrentTrack() {
      const state = get(playerStore)
      return getTrack(state.currentTrackId)
    },
    getQueueTracks() {
      const state = get(playerStore)
      return state.queueTrackIds.map((id) => getTrack(id)).filter(Boolean)
    },
    getAnalyser() {
      return analyser
    },
    getDurationLabel() {
      return formatSeconds(get(playerStore).duration)
    },
    getCurrentTimeLabel() {
      return formatSeconds(get(playerStore).currentTime)
    },
  }

  return playerStore
}

export const playerStore = createPlayerStore()
