<script>
  // @ts-nocheck
  
  import { formatSeconds } from '../lib/time.js'

  let { track, active = false, onPlay = null } = $props()

  function handlePlay() {
    onPlay?.(track.id)
  }

  const durationLabel = $derived(track.durationLabel ?? formatSeconds(track.durationSec))
</script>

<button
  class="d_l_display--grid grid-template-columns d_l_align-items--center d_l_text-align--start d_l_width--100 d_l_gap--s1 d_l_padding--s2 d_l_border-radius--s1"
  style="--grid-template-columns: 2.5em 1fr auto"
  class:success={active} type="button" onclick={handlePlay}
>
  <img
    class="track-cover object-fit--cover width height d_l_border-radius--s3"
    style="--background-color: color-mix(in srgb, var(--positive) 70%, transparent); --width: 2.5em; --height: 2.5em"
    src={track.cover ?? ''} alt={track.albumTitle}
  />
  <span class="element--truncate d_l_display--grid d_l_gap--s2 d_l_line-height--1 d_l_font-size--s1">
    <strong class="d_l_display--block element--truncate">{track.title}</strong>
    <small class="d_l_display--block element--truncate d_l_color--negative--dark">{track.artistName}</small>
  </span>
  <span class="track-duration d_l_color--negative--dark" style="font-variant-numeric: tabular-nums">{durationLabel}</span>
</button>