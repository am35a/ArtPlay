<script>
  // @ts-nocheck
  
  let { value = '', onSearch = null } = $props()

  function onInput(event) {
    onSearch?.(event.currentTarget.value)
  }
</script>

<header class="app-header d_l_align-items--center d_l_border-width--thin d_l_border-color--negative--mute d_l_border-style--solid d_l_border-top-style--none d_l_border-end-end-radius--md d_l_border-end-start-radius--md backdrop-filter" style="--backdrop-filter: contrast(1.3) saturate(2) grayscale(.8) blur(1em)">
  <e-icon class="d_l_font-size--l3" aria-hidden="true" style="--image: url(/icons/logo.svg)"></e-icon>
  <input
    type="search"
    placeholder="Поиск: треки, авторы, альбомы"
    value={value}
    oninput={onInput}
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
</style>

