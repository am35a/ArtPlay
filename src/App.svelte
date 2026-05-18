<script>
  // @ts-nocheck
  
  import { onMount } from 'svelte'
  import { formatSeconds } from './lib/time.js'
  import { loadLibraryManifest, searchInLibrary } from './lib/library.js'
  import { playerStore } from './lib/player-store.js'

  import AppHeader from './components/AppHeader.svelte'
  import MiniPlayer from './components/MiniPlayer.svelte'
  import BottomToolbar from './components/BottomToolbar.svelte'

  import HomeScreen from './components/screens/HomeScreen.svelte'
  import AuthorsScreen from './components/screens/AuthorsScreen.svelte'
  import AuthorScreen from './components/screens/AuthorScreen.svelte'
  import AlbumScreen from './components/screens/AlbumScreen.svelte'
  import NowPlayingScreen from './components/screens/NowPlayingScreen.svelte'

  let library = $state(null)
  let loadError = $state('')
  let loading = $state(true)

  function queryMatch(entity, query) {
    return searchInLibrary(query, entity)
  }

  function artistMatches(artist, query) {
    if (!query.trim()) return true
    if (queryMatch(artist, query)) return true

    for (const album of artist.albums) {
      if (queryMatch(album, query)) return true
      for (const track of album.tracks) {
        if (queryMatch(track, query)) return true
      }
    }

    return false
  }

  function getAuthorView(artist, query) {
    if (!artist) return null
    const q = query.trim()
    if (!q) return artist

    const artistHit = queryMatch(artist, q)
    const albums = []

    for (const album of artist.albums) {
      const albumHit = queryMatch(album, q)
      const filteredTracks = album.tracks.filter((track) => queryMatch(track, q))
      if (artistHit || albumHit || filteredTracks.length > 0) {
        albums.push({
          ...album,
          tracks: artistHit || albumHit ? album.tracks : filteredTracks,
        })
      }
    }

    return {
      ...artist,
      albums,
    }
  }

  function getAlbumView(album, query) {
    if (!album) return null
    const q = query.trim()
    if (!q) return album

    if (queryMatch(album, q)) return album

    return {
      ...album,
      tracks: album.tracks.filter((track) => queryMatch(track, q)),
    }
  }

  function playFromHome(trackId) {
    const queueTrackIds = homeTracks.map((track) => track.id)
    playerStore.playTrack(trackId, {
      queueTrackIds,
      queueContext: { type: 'home', label: 'Главная' },
    })
  }

  function playFromAuthor(trackId) {
    const queueTrackIds = authorTracks.map((track) => track.id)
    playerStore.playTrack(trackId, {
      queueTrackIds,
      queueContext: {
        type: 'author',
        id: selectedAuthor?.id ?? null,
        label: selectedAuthor?.name ?? 'Автор',
      },
    })
  }

  function playFromAlbum(trackId) {
    const queueTrackIds = albumTracks.map((track) => track.id)
    playerStore.playTrack(trackId, {
      queueTrackIds,
      queueContext: {
        type: 'album',
        id: selectedAlbum?.id ?? null,
        label: selectedAlbum?.title ?? 'Альбом',
      },
    })
  }

  function onToolbarGo(screen) {
    if (screen === 'track') {
      if (!state.currentTrackId && homeTracks.length > 0) {
        playFromHome(homeTracks[0].id)
      }
      playerStore.openNowPlaying()
      return
    }

    playerStore.goToScreen(screen)
  }

  onMount(async () => {
    try {
      library = await loadLibraryManifest()
      playerStore.setLibrary(library)
      playerStore.hydrateAudioFromState()
      if ($playerStore.activeScreen === 'nowPlaying') {
        playerStore.ensureAnalyserReady()
      }
    } catch (error) {
      loadError = error instanceof Error ? error.message : 'манифест не загрузился'
    } finally {
      loading = false
    }
  })

  const state = $derived($playerStore)
  const query = $derived(state.searchQuery ?? '')

  const homeTracks = $derived(library ? library.tracks.filter((track) => queryMatch(track, query)) : [])
  const authorCards = $derived(library ? library.artists.filter((artist) => artistMatches(artist, query)) : [])

  const selectedAuthorBase = $derived(library && state.selectedArtistId ? library.artistById.get(state.selectedArtistId) : null)
  const selectedAuthor = $derived(selectedAuthorBase ? getAuthorView(selectedAuthorBase, query) : null)
  const authorTracks = $derived(selectedAuthor
    ? selectedAuthor.albums.flatMap((album) => album.tracks)
    : [])

  const selectedAlbumBase = $derived(library && state.selectedAlbumId ? library.albumById.get(state.selectedAlbumId) : null)
  const selectedAlbum = $derived(selectedAlbumBase ? getAlbumView(selectedAlbumBase, query) : null)
  const albumTracks = $derived(selectedAlbum?.tracks ?? [])

  const currentTrack = $derived(library && state.currentTrackId ? library.trackById.get(state.currentTrackId) ?? null : null)
  const currentTimeLabel = $derived(formatSeconds(state.currentTime))
  const durationLabel = $derived(formatSeconds(state.duration || currentTrack?.durationSec || 0))

  const hideGlobal = $derived(state.activeScreen === 'nowPlaying')
</script>

{#if loading}
  <main class="d_l_display--grid d_l_align-items--center d_l_justify-items--center d_l_padding--l2 min-height" style="--min-height: 100dvh"><p>Загрузка библиотеки...</p></main>
{:else if loadError}
  <main class="d_l_display--grid d_l_align-items--center d_l_justify-items--center d_l_padding--l2 min-height" style="--min-height: 100dvh"><p>Ошибка: {loadError}</p></main>
{:else}
  {#if hideGlobal}
    <main class="d_l_display--grid d_l_margin--auto min-height max-width grid-template-rows" style="--min-height: 100dvh; --max-width: 40em; --grid-template-rows: 1fr auto">
      <NowPlayingScreen
        {state}
        track={currentTrack}
        analyser={playerStore.getAnalyser()}
        onSeek={(value) => playerStore.seekTo(value)}
        onPrev={() => playerStore.playPrev()}
        onNext={() => playerStore.playNext()}
        onRewind={() => playerStore.skipBy(-10)}
        onForward={() => playerStore.skipBy(10)}
        onToggle={() => playerStore.togglePlayPause()}
        onShuffle={() => playerStore.toggleShuffle()}
        onRepeat={() => playerStore.cycleRepeat()}
        onMode={(mode) => playerStore.setVisualizerMode(mode)}
      />
      <BottomToolbar
        activeScreen={state.activeScreen}
        onGo={onToolbarGo}
      />
    </main>
  {:else}
    <main class="d_l_display--grid d_l_margin--auto min-height max-width grid-template-rows" style="--min-height: 100dvh; --max-width: 40em; --grid-template-rows: auto 1fr auto">
      <AppHeader value={query} onSearch={(value) => playerStore.setSearchQuery(value)} />

      <section class="d_l_padding--s1 d_l_overflow--auto">
        {#if state.activeScreen === 'home'}
          <HomeScreen tracks={homeTracks} currentTrackId={state.currentTrackId} onPlay={playFromHome} />
        {:else if state.activeScreen === 'authors'}
          <AuthorsScreen artists={authorCards} onOpen={(artistId) => playerStore.openAuthor(artistId)} />
        {:else if state.activeScreen === 'author'}
          <AuthorScreen
            artist={selectedAuthor}
            currentTrackId={state.currentTrackId}
            onPlay={playFromAuthor}
            onOpenAlbum={(albumId) => playerStore.openAlbum(albumId)}
          />
        {:else if state.activeScreen === 'album'}
          <AlbumScreen
            album={selectedAlbum}
            currentTrackId={state.currentTrackId}
            onPlay={playFromAlbum}
          />
        {/if}
      </section>

      <section
        class="d_l_position--sticky d_l_display--grid d_l_gap--s1 d_l_bottom--0 z-index"
        style="--z-index: 20"
      >
        <MiniPlayer
          {state}
          track={currentTrack}
          {currentTimeLabel}
          {durationLabel}
          onOpen={() => playerStore.openNowPlaying()}
          onToggle={() => playerStore.togglePlayPause()}
          onPrev={() => playerStore.playPrev()}
          onNext={() => playerStore.playNext()}
          onShuffle={() => playerStore.toggleShuffle()}
          onRepeat={() => playerStore.cycleRepeat()}
          onAuthor={() => playerStore.openCurrentTrackAuthor()}
          onAlbum={() => playerStore.openCurrentTrackAlbum()}
          onSeek={(value) => playerStore.seekTo(value)}
        />

        <BottomToolbar
          activeScreen={state.activeScreen}
          onGo={onToolbarGo}
        />
      </section>
    </main>
  {/if}
{/if}

<style>
  :global(body) {
    min-height: 100dvh;
    background: linear-gradient(-35deg, color-mix(in srgb, var(--positive) 90%, transparent), color-mix(in srgb, var(--prime) 10%, transparent));
    background-attachment: fixed;
  }
</style>
