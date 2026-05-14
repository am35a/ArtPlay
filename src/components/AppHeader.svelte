<script>
  import { createEventDispatcher } from 'svelte'

  export let value = ''

  const dispatch = createEventDispatcher()

  function onInput(event) {
    dispatch('search', { value: event.currentTarget.value })
  }
</script>

<header class="app-header d_l_align-items--center d_l_border-width--thin d_l_border-color--negative--mute d_l_border-style--solid d_l_border-top-style--none d_l_border-end-end-radius--md d_l_border-end-start-radius--md backdrop-filter" style="--backdrop-filter: contrast(1.3) saturate(2) grayscale(.8) blur(1em);">
  <svg class="logo" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M6 10a7 7 0 1 1 13 3.6a10 10 0 0 1 -2 2a8 8 0 0 0 -2 3a4.5 4.5 0 0 1 -6.8 1.4" />
    <path d="M10 10a3 3 0 1 1 5 2.2" />
  </svg>
  <input
    type="search"
    placeholder="Поиск: треки, авторы, альбомы"
    value={value}
    on:input={onInput}
  />
</header>

<style>
  .app-header {
    position: sticky;
    top: 0;
    z-index: 20;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.75em;
    padding: 0.75em;
  }

  .logo {
    align-self: center;
    font-size: 1.1em;
  }
</style>
