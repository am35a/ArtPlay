# CONTEXT.md — Чекпойнт состояния

## Статус проекта
Все базовые фичи реализованы, проект проходит `pnpm run build`. Текущая сессия — UI/UX доработки и оптимизация.

## Сессия: UI/UX + Оптимизация (20.05.2026)

### Сделано

#### UI/UX
- **Анимация fade между экранами 1–4** — `App.svelte:193`, `{#key state.activeScreen}`, `out:fade 100ms` → `in:fade 100ms+delay`, без наложения
- **Placeholder при ошибке загрузки обложек** — `TrackRow`, `MiniPlayer`, `AuthorScreen`, `AlbumScreen` — `onerror` подменяет на SVG-ноготу (base64 data URI), `AuthorsScreen` использует `EMPTY_PIXEL`
- **Клик по обложке → переход на страницу альбома** — `NowPlayingScreen.svelte:29`, обёрнуто в `<button>`, вызов `playerStore.openCurrentTrackAlbum()`
- **Disabled кнопок в MiniPlayer** — кнопка автора `disabled` на экране author, кнопка альбома — на album

#### Сплеш-скрин (FOUC fix)
- `index.html`: сплеш с инлайн-стилями, хардкод oklch-цветов (без S4), `position: fixed; z-index: 9999`, CSS-анимация спиннера через `@keyframes spin`
- `<script>S4()</script>` вызывается сразу после загрузки `s4.min.js` (не через `onload`)
- `<link rel="stylesheet" href="/s4/css/elements.css">` убран — S4() грузит CSS динамически
- `<main id="app" class="d_l_display--contents">` как контейнер Svelte
- `main.js` — монтирование в `#app`
- `App.svelte` — `<main>` заменены на `<article>` (нет вложенных `<main>`)
- Сплеш удаляется через 500ms после загрузки: `splash.textContent = 'Загрузка завершена!'`

#### Оптимизация
- `loading="lazy"` на всех `<img>` в `TrackRow`, `MiniPlayer`, `AuthorsScreen`, `AuthorScreen`, `AlbumScreen`

### Файлы, изменённые в сессии
```
index.html               — сплеш, S4(), #app, CSS-анимация
src/main.js              — target: #app, @ts-nocheck
src/App.svelte           — fade, артикли, удаление сплеша
src/components/MiniPlayer.svelte       — disabled, loading="lazy", placeholder
src/components/TrackRow.svelte         — loading="lazy", placeholder
src/components/screens/NowPlayingScreen.svelte — onAlbum, обложка-кнопка
src/components/screens/AlbumScreen.svelte      — loading="lazy", placeholder
src/components/screens/AuthorScreen.svelte     — loading="lazy", placeholder
src/components/screens/AuthorsScreen.svelte    — loading="lazy"
```

### Команды проверки
```bash
pnpm run build
```

### Известные проблемы
- Нет

### Следующие шаги
- По запросу пользователя
