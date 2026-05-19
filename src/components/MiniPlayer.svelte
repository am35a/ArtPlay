<script>
  // @ts-nocheck
  
  let {
    state,
    track,
    currentTimeLabel,
    durationLabel,
    onOpen = null,
    onToggle = null,
    onPrev = null,
    onNext = null,
    onShuffle = null,
    onRepeat = null,
    onAuthor = null,
    onAlbum = null,
    onSeek = null,
  } = $props()

  function onContainerKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onOpen?.()
    }
  }

  function handleSeek(event) {
    const value = Number(event.currentTarget.value)
    onSeek?.(value)
  }

  const FALLBACK_IMG = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNjY2MiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik05IDE4VjVsMTItMnYxMyIvPjxjaXJjbGUgY3g9IjYiIGN5PSIxOCIgcj0iMyIvPjxjaXJjbGUgY3g9IjE4IiBjeT0iMTYiIHI9IjMiLz48L3N2Zz4='

  const progressMax = $derived(Number.isFinite(state.duration) && state.duration > 0 ? state.duration : 0)
  const progressValue = $derived(Number.isFinite(state.currentTime) ? state.currentTime : 0)
  const title = $derived(track ? `${track.title} — ${track.artistName}` : 'Ничего не играет')
</script>

<section
  class="d_l_text-align--center d_l_box-shadow--md d_l_padding--s2 d_l_border-radius--md"
  role="button"
  tabindex="0"
  onclick={() => onOpen?.()}
  onkeydown={onContainerKeydown}
  theme="light"
  style="margin: 0.25em 0.75em 0; --background-color: color-mix(in srgb, var(--positive) 90%, transparent)"
>
  <div class="d_l_display--inline-flex d_l_gap--md d_l_font-size--l3 d_l_align-items--center">
    <div class="d_l_display--inline-flex d_l_gap--s2 d_l_flex-wrap--wrap d_l_justify-content--start d_l_font-size--s2">
      <button class="d_l_padding-inline--s3 d_l_border-radius--oval d_l_background-color--transparent" type="button" aria-label="Перемешивание" onclick={(event) => { event.stopPropagation(); onShuffle?.() }}>
        {#if state.shuffle}
          <e-icon aria-hidden="true" style="--image: url(/icons/shuffle.svg)"></e-icon>
        {:else}
          <e-icon aria-hidden="true" style="--image: url(/icons/shuffle-off.svg)"></e-icon>
        {/if}
      </button>
      <button class="d_l_padding-inline--s3 d_l_border-radius--oval d_l_background-color--transparent" type="button" aria-label="Повтор" onclick={(event) => { event.stopPropagation(); onRepeat?.() }}>
        {#if state.repeatMode === 'off'}
          <e-icon aria-hidden="true" style="--image: url(/icons/repeat-off.svg)"></e-icon>
        {:else if state.repeatMode === 'all'}
          <e-icon aria-hidden="true" style="--image: url(/icons/repeat.svg)"></e-icon>
        {:else}
          <e-icon aria-hidden="true" style="--image: url(/icons/repeat-once.svg)"></e-icon>
        {/if}
      </button>
    </div>
    <button class="d_l_padding-inline--s3 d_l_border-radius--oval d_l_background-color--transparent" type="button" aria-label="Предыдущий трек" onclick={(event) => { event.stopPropagation(); onPrev?.() }}>
      <e-icon aria-hidden="true" style="--image: url(/icons/prev.svg)"></e-icon>
    </button>
    <button type="button" class="d_l_padding-inline--s3 d_l_border-radius--oval d_l_font-size--l2 prime" aria-label={state.isPlaying ? 'Пауза' : 'Воспроизвести'} onclick={(event) => { event.stopPropagation(); onToggle?.() }}>
      {#if state.isPlaying}
        <e-icon aria-hidden="true" style="--image: url(/icons/pause.svg)"></e-icon>
      {:else}
        <e-icon aria-hidden="true" style="--image: url(/icons/play.svg)"></e-icon>
      {/if}
    </button>
    <button class="d_l_padding-inline--s3 d_l_border-radius--oval d_l_background-color--transparent" type="button" aria-label="Следующий трек" onclick={(event) => { event.stopPropagation(); onNext?.() }}>
      <e-icon aria-hidden="true" style="--image: url(/icons/next.svg)"></e-icon>
    </button>
    <div class="d_l_display--inline-flex d_l_gap--s2 d_l_flex-wrap--wrap d_l_justify-content--end d_l_font-size--s2">
      <button class="d_l_padding-inline--s3 d_l_border-radius--oval d_l_background-color--transparent" type="button" aria-label="Открыть автора" onclick={(event) => { event.stopPropagation(); onAuthor?.() }} disabled={!track || state.activeScreen === 'author'}>
        <e-icon aria-hidden="true" style="--image: url(/icons/author.svg)"></e-icon>
      </button>
      <button class="d_l_padding-inline--s3 d_l_border-radius--oval d_l_background-color--transparent" type="button" aria-label="Открыть альбом" onclick={(event) => { event.stopPropagation(); onAlbum?.() }} disabled={!track || state.activeScreen === 'album'}>
        <e-icon aria-hidden="true" style="--image: url(/icons/album.svg)"></e-icon>
      </button>
    </div>
  </div>
  <div class="d_l_display--grid d_l_width--100 d_l_grid-template-columns--1 d_l_grid-template-rows--1 d_l_margin-top--s2">
    <div class="d_l_display--flex d_l_align-items--center d_l_grid-column--full d_l_grid-row--full" style="opacity: .5">
      <img
        class="object-fit--cover width height d_l_border-radius--s2"
        src={track?.cover ?? ''}
        alt={track?.albumTitle ?? 'cover'}
        style="--width: 2em; --height: 2em; --background-color: color-mix(in srgb, var(--positive) 70%, transparent)"
        loading="lazy"
        onerror={(e) => { if (e.currentTarget.src !== FALLBACK_IMG) e.currentTarget.src = FALLBACK_IMG }}
      />
      <div class="d_l_flex-grow--1 d_l_display--grid">
        <div class="d_l_overflow--hidden d_l_white-space--nowrap">
          <span class="d_l_display--inline-block d_l_width--100" style="animation: scroll-x 15s linear infinite">{title}</span>
        </div>
      </div>
      <small class="d_l_text-wrap--nowrap d_l_padding-right--s2">{currentTimeLabel} / {durationLabel}</small>
    </div>  
    <input
      class="d_l_background-color--transparent d_l_grid-column--full d_l_grid-row--full"
      type="range"
      min="0"
      max={progressMax}
      step="0.1"
      value={progressValue}
      onclick={(event) => event.stopPropagation()}
      oninput={handleSeek}
    />
  </div>
</section>

<style>
  :global {
    @keyframes scroll-x {
      0% { transform: translateX(100%); }
      100% { transform: translateX(-100%); }
    }
  }
</style>
