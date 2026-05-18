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

  const progressMax = $derived(Number.isFinite(state.duration) && state.duration > 0 ? state.duration : 0)
  const progressValue = $derived(Number.isFinite(state.currentTime) ? state.currentTime : 0)
  const title = $derived(track ? `${track.title} — ${track.artistName}` : 'Ничего не играет')
</script>

<section
  class="mini-player d_l_text-align--center d_l_box-shadow--md bottom"
  style="--d_p_bottom: 5.5em; --d_l_bottom: 4em;"
  role="button"
  tabindex="0"
  onclick={() => onOpen?.()}
  onkeydown={onContainerKeydown}
  theme="light"
>
    <div class="mini-controls d_l_font-size--l3 d_l_align-items--center">
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
        <button class="d_l_padding-inline--s3 d_l_border-radius--oval d_l_background-color--transparent" type="button" aria-label="Открыть автора" onclick={(event) => { event.stopPropagation(); onAuthor?.() }} disabled={!track}>
          <e-icon aria-hidden="true" style="--image: url(/icons/author.svg)"></e-icon>
        </button>
        <button class="d_l_padding-inline--s3 d_l_border-radius--oval d_l_background-color--transparent" type="button" aria-label="Открыть альбом" onclick={(event) => { event.stopPropagation(); onAlbum?.() }} disabled={!track}>
          <e-icon aria-hidden="true" style="--image: url(/icons/album.svg)"></e-icon>
        </button>
      </div>

    </div>

  <div class="mini-progress">
    <div class="d_l_display--flex d_l_align-items--center">
      <img class="mini-cover" src={track?.cover ?? ''} alt={track?.albumTitle ?? 'cover'} />
      <div class="mini-text d_l_flex-grow--1">
        <div class="marquee-wrap">
          <span class="marquee">{title}</span>
        </div>
      </div>
      <small class="d_l_text-wrap--nowrap d_l_padding-right--s2">{currentTimeLabel} / {durationLabel}</small>
    </div>  
    <input
      class="d_l_background-color--transparent"
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
  .mini-player {
    position: sticky;
    z-index: 15;
    padding: 0.5em;
    margin: 0.75em 0.75em 0;
    border-radius: 1em;
    background: color-mix(in srgb, var(--positive) 92%, transparent);
  }

  .mini-cover {
    width: 2em;
    height: 2em;
    border-radius: 0.5em;
    object-fit: cover;
    background: color-mix(in srgb, var(--positive) 70%, transparent);
  }

  .mini-text {
    min-width: 0;
    display: grid;
    gap: 0.1em;
  }

  .marquee-wrap {
    overflow: hidden;
    white-space: nowrap;
  }

  .marquee {
    width: 100%;
    display: inline-block;
    animation: svelte-1jla3sy-scroll-x 15s linear infinite;
  }

  .mini-controls {
    display: inline-flex;
    gap: 1em;
  }

  .mini-progress {
    width: 100%;
    margin-top: 0.4em;
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr;
  }
  .mini-progress > :first-child {
    opacity: .5;
  }
  .mini-progress > * {
    grid-column: 1 / -1;
    grid-row: 1 / -1;
  }

  @keyframes scroll-x {
    0% { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
  }
</style>
