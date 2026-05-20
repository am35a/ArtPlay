<div align="center">
  <img width="320" alt="Screen Shot 2026-05-19 at 01 05 27" src="https://github.com/user-attachments/assets/4d0f1af1-ccf8-4b6a-b84b-2c964fc3b33f" />
  <img width="320" alt="Screen Shot 2026-05-19 at 01 03 10" src="https://github.com/user-attachments/assets/9308b7bc-e0ba-483d-8b82-a1d2be519d2f" />
</div>

# ArtPlay

Офлайн аудиоплеер для прослушивания локальной библиотеки MP3-файлов.
Собран на Svelte 5, Vite и S4 Design System.

## Цель проекта

Апробация S4 Design System — проверка архитектурных решений фреймворка и
компонентов дизайн-системы на реальном приложении. В ходе разработки
подтверждена успешность подхода, выявлены и исправлены ошибки,
отработаны паттерны рефакторинга стилей с кастомного CSS на S4-классы.

## Исходный код и контент

Весь код приложения и все аудиокомпозиции в библиотеке созданы с помощью
генеративных моделей. Проект — демонстрация возможностей современного ИИ
как в разработке ПО, так и в создании контента.

**Модели, использованные в разработке:**

- **Suno AI (dthcbb 4.5)** — генерация всех аудиотреков
- **Codex 5.3** — задал базовую структуру, но не был пригоден для продакшен-работы
- **Minimax 2.5** — позволил настраивать внешний вид в соответствии с S4, но слабо пригоден для продакшен-работы
- **DeepSeek 4 Flash** — показал уверенные результаты, выполнил основной объём
  рефакторинга и довёл проект до рабочего состояния

## Возможности

- Воспроизведение MP3 с управлением (play/pause, prev/next, перемотка ±10с, скролл прогресса)
- Режимы повтора (off / one / all) и перемешивание очереди
- Поиск по названиям треков, альбомов и авторов
- 5 экранов: Главная, Авторы, Автор, Альбом, Сейчас играет
- Визуализатор аудио (спектр/осциллограф) через Web Audio API
- Сохранение состояния в localStorage (очередь, прогресс, настройки)
- Адаптивный MiniPlayer со sticky-панелью

## Технологии

- **Svelte 5** — реактивность через runes (`$state`, `$derived`, `$effect`)
- **Vite 8** — сборка и dev-сервер
- **S4 Design System** — CSS-утилиты и кастомные элементы (`e-icon`, `e-group`)
- **Web Audio API** — `AudioContext` + `AnalyserNode`
- **music-metadata** — чтение длительности MP3 при генерации манифеста
- **localStorage** — персистентность

## Быстрый старт

```bash
pnpm install
pnpm run manifest    # просканировать public/library, собрать index.json
pnpm run dev         # запустить dev-сервер
```

Сборка:

```bash
pnpm run build       # статика в dist/
pnpm run preview     # предпросмотр сборки
```

## Структура

```
src/
├── App.svelte           # корневой компонент, роутинг экранов
├── main.js              # точка входа
├── lib/
│   ├── player-store.js  # глобальное состояние, аудио, Web Audio API
│   ├── library.js       # загрузка и поиск по библиотеке
│   └── time.js          # форматирование времени
├── components/
│   ├── AppHeader.svelte
│   ├── MiniPlayer.svelte
│   ├── BottomToolbar.svelte
│   ├── TrackRow.svelte
│   ├── Visualizer.svelte
│   └── screens/
│       ├── HomeScreen.svelte
│       ├── AuthorsScreen.svelte
│       ├── AuthorScreen.svelte
│       ├── AlbumScreen.svelte
│       └── NowPlayingScreen.svelte
scripts/
├── generate-library-manifest.mjs  # генератор манифеста
public/
├── library/    # директория с MP3 (автор/альбом/треки)
├── s4/         # S4 Design System
└── icons/      # SVG-иконки
```

## Генерация библиотеки

Скрипт `scripts/generate-library-manifest.mjs` сканирует `public/library/`, читает метаданные MP3 и создаёт `index.json`.
Структура директорий:

```
public/library/
├── author-name/
│   ├── author.jpg          # фото автора
│   ├── album-title/
│   │   ├── cover.jpg       # обложка альбома
│   │   ├── 01 - Title.mp3
│   │   └── 02 - Title.mp3
│   └── ...
└── ...
```

## Навигация
 
| Откуда | Куда | Триггер |
|--------|------|---------|
| Главная | Фильтрация | Поиск |
| Главная / Автор / Альбом | Воспроизведение | Клик по треку |
| BottomToolbar | Авторы | Кнопка «Авторы» |
| Авторы | Автор | Клик по автору |
| Автор | Альбом | Клик по альбому |
| Воспроизведение | MiniPlayer | Автоматически |
| MiniPlayer | Автор / Альбом | Кнопки в плеере |
| MiniPlayer | Now Playing | Клик «Трек» в Toolbar |
| Now Playing | Альбом | Клик по обложке |
| Now Playing | Главная / Авторы | BottomToolbar |

## Лицензия

MIT
