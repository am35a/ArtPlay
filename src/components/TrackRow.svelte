<script>
  import { createEventDispatcher } from 'svelte'
  import { formatSeconds } from '../lib/time.js'

  export let track
  export let active = false

  const dispatch = createEventDispatcher()

  function onPlay() {
    dispatch('play', { trackId: track.id })
  }

  $: durationLabel = track.durationLabel ?? formatSeconds(track.durationSec)
</script>

<button class:success={active} class="track-row" type="button" onclick={onPlay}>
  <img class="track-cover" src={track.cover ?? ''} alt={track.albumTitle} />
  <span class="track-main d_l_line-height--1 d_l_font-size--s1">
    <strong class="track-title">{track.title}</strong>
    <small class="track-artist">{track.artistName}</small>
  </span>
  <span class="track-duration">{durationLabel}</span>
</button>

<style>
  .track-row {
    width: 100%;
    display: grid;
    grid-template-columns: 2.5em 1fr auto;
    gap: 0.75em;
    align-items: center;
    text-align: left;
    padding: 0.5em;
    border-radius: 0.75em;
  }

  .track-cover {
    width: 2.5em;
    height: 2.5em;
    border-radius: 0.25em;
    object-fit: cover;
    background: color-mix(in srgb, var(--positive, #ddd) 70%, transparent);
  }

  .track-main {
    min-width: 0;
    display: grid;
    gap: 0.5em;
  }

  .track-title,
  .track-artist {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .track-artist {
    opacity: 0.75;
  }

  .track-duration {
    font-variant-numeric: tabular-nums;
    opacity: 0.85;
  }
</style>
