<script>
  // @ts-nocheck
  
  import { formatSeconds } from '../lib/time.js'

  let { track, active = false, onPlay = null } = $props()

  const FALLBACK_IMG = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNjY2MiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik05IDE4VjVsMTItMnYxMyIvPjxjaXJjbGUgY3g9IjYiIGN5PSIxOCIgcj0iMyIvPjxjaXJjbGUgY3g9IjE4IiBjeT0iMTYiIHI9IjMiLz48L3N2Zz4='

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
    loading="lazy"
    onerror={(e) => { if (e.currentTarget.src !== FALLBACK_IMG) e.currentTarget.src = FALLBACK_IMG }}
  />
  <span class="element--truncate d_l_display--grid d_l_gap--s2 d_l_line-height--1 d_l_font-size--s1">
    <strong class="d_l_display--block element--truncate">{track.title}</strong>
    <small class="d_l_display--block element--truncate d_l_color--negative--dark">{track.artistName}</small>
  </span>
  <span class="track-duration d_l_color--negative--dark" style="font-variant-numeric: tabular-nums">{durationLabel}</span>
</button>