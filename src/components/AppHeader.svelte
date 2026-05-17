<script>
  // @ts-nocheck
  
  let { value = '', onSearch = null } = $props()

  function onInput(event) {
    onSearch?.(event.currentTarget.value)
  }
</script>

<header
  class="d_l_position--sticky d_l_display--grid d_l_align-items--center d_l_top--0 d_l_gap--s1 d_l_padding--s1 d_l_border-width--thin d_l_border-color--negative--mute d_l_border-style--solid d_l_border-top-style--none d_l_border-end-end-radius--md d_l_border-end-start-radius--md backdrop-filter z-index grid-template-columns"
  style="--backdrop-filter: contrast(1.3) saturate(2) grayscale(.8) blur(1em); --z-index: 20; --grid-template-columns: auto 1fr"
>
  <e-icon class="d_l_font-size--l3" aria-hidden="true" style="--image: url(/icons/logo.svg)"></e-icon>
  <input
    type="search"
    placeholder="Поиск: треки, авторы, альбомы"
    value={value}
    oninput={onInput}
  />
</header>