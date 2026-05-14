<script>
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

  let library = null
  let loadError = ''
  let loading = true

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

  onMount(async () => {
    try {
      library = await loadLibraryManifest()
      playerStore.setLibrary(library)
      playerStore.hydrateAudioFromState()
    } catch (error) {
      loadError = error instanceof Error ? error.message : 'manifest load failed'
    } finally {
      loading = false
    }
  })

  $: state = $playerStore
  $: query = state.searchQuery ?? ''

  $: homeTracks = library ? library.tracks.filter((track) => queryMatch(track, query)) : []
  $: authorCards = library ? library.artists.filter((artist) => artistMatches(artist, query)) : []

  $: selectedAuthorBase = library && state.selectedArtistId ? library.artistById.get(state.selectedArtistId) : null
  $: selectedAuthor = selectedAuthorBase ? getAuthorView(selectedAuthorBase, query) : null
  $: authorTracks = selectedAuthor
    ? selectedAuthor.albums.flatMap((album) => album.tracks)
    : []

  $: selectedAlbumBase = library && state.selectedAlbumId ? library.albumById.get(state.selectedAlbumId) : null
  $: selectedAlbum = selectedAlbumBase ? getAlbumView(selectedAlbumBase, query) : null
  $: albumTracks = selectedAlbum?.tracks ?? []

  $: currentTrack = library && state.currentTrackId ? library.trackById.get(state.currentTrackId) ?? null : null
  $: currentTimeLabel = formatSeconds(state.currentTime)
  $: durationLabel = formatSeconds(state.duration || currentTrack?.durationSec || 0)

  $: hideGlobal = state.activeScreen === 'nowPlaying'
</script>

{#if loading}
  <main class="state-view"><p>Загрузка библиотеки...</p></main>
{:else if loadError}
  <main class="state-view"><p>Ошибка: {loadError}</p></main>
{:else}
  {#if hideGlobal}
    <NowPlayingScreen
      {state}
      track={currentTrack}
      queueContext={state.queueContext}
      analyser={playerStore.getAnalyser()}
      on:back={() => playerStore.goBackFromNowPlaying()}
      on:seek={(event) => playerStore.seekTo(event.detail.value)}
      on:prev={() => playerStore.playPrev()}
      on:next={() => playerStore.playNext()}
      on:rewind={() => playerStore.skipBy(-10)}
      on:forward={() => playerStore.skipBy(10)}
      on:toggle={() => playerStore.togglePlayPause()}
      on:shuffle={() => playerStore.toggleShuffle()}
      on:repeat={() => playerStore.cycleRepeat()}
      on:mode={(event) => playerStore.setVisualizerMode(event.detail.mode)}
    />
  {:else}
    <main class="app-shell">
      <AppHeader value={query} on:search={(event) => playerStore.setSearchQuery(event.detail.value)} />

      <section class="screen-wrap">
        {#if state.activeScreen === 'home'}
          <HomeScreen tracks={homeTracks} currentTrackId={state.currentTrackId} on:play={(event) => playFromHome(event.detail.trackId)} />
        {:else if state.activeScreen === 'authors'}
          <AuthorsScreen artists={authorCards} on:open={(event) => playerStore.openAuthor(event.detail.artistId)} />
        {:else if state.activeScreen === 'author'}
          <AuthorScreen
            artist={selectedAuthor}
            currentTrackId={state.currentTrackId}
            on:play={(event) => playFromAuthor(event.detail.trackId)}
            on:openAlbum={(event) => playerStore.openAlbum(event.detail.albumId)}
          />
        {:else if state.activeScreen === 'album'}
          <AlbumScreen
            album={selectedAlbum}
            currentTrackId={state.currentTrackId}
            on:play={(event) => playFromAlbum(event.detail.trackId)}
          />
        {/if}
      </section>

      <MiniPlayer
        {state}
        track={currentTrack}
        {currentTimeLabel}
        {durationLabel}
        on:open={() => playerStore.openNowPlaying()}
        on:toggle={() => playerStore.togglePlayPause()}
        on:prev={() => playerStore.playPrev()}
        on:next={() => playerStore.playNext()}
        on:seek={(event) => playerStore.seekTo(event.detail.value)}
      />

      <BottomToolbar
        activeScreen={state.activeScreen}
        canOpenAuthor={Boolean(state.selectedArtistId)}
        canOpenAlbum={Boolean(state.selectedAlbumId)}
        on:go={(event) => playerStore.goToScreen(event.detail.screen)}
      />
    </main>
  {/if}
{/if}

<style>
  :global(*) {
    box-sizing: border-box;
  }

  :global(body) {
    margin: 0;
    min-height: 100vh;
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, sans-serif;
    background: linear-gradient(180deg, color-mix(in srgb, var(--positive, #ffffff) 97%, transparent), color-mix(in srgb, var(--prime, #dde8ff) 8%, transparent));
    background-attachment: fixed;
  }

  .app-shell {
    min-height: 100vh;
    display: grid;
    grid-template-rows: auto 1fr auto auto;
  }

  .screen-wrap {
    padding: 0.75em;
    overflow: auto;
  }

  .state-view {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 2em;
  }
</style>
