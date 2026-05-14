# S4 Design System

## Введение

S4 — адаптивная CSS-дизайн-система для HTML, где базовые стили применяются к нативным элементам без обязательных классов.

Ключевая идея:
- готовая базовая стилизация семантических тегов (`button`, `input`, `a`, `table`, `details` и др.)
- utility-first слой для точной настройки через классы и CSS-переменные

## Назначение

Техническая справка по фактическому поведению текущей сборки S4 в этом репозитории.

## Подход S4

S4 сочетает два подхода:
- semantic-first: нативные HTML-элементы (`button`, `input`, `a`, `table`, `details` и др.) получают стили без обязательных классов
- utility-first: точная настройка через utility-классы (`d_l_*`, `d_p_*`, `m_p_*`, `t_l_*` и т.д.)

Это означает: достаточно подключить S4 к чистому HTML-документу, и базовые стили уже применятся.

## Подключение

```html
<head>
    <script src="/s4/js/s4.min.js"></script>
</head>
<body onload="S4()">
    <!-- JS-фреймворк приложения подключается отдельно -->
</body>
```

## Что делает `S4()`

По `public/s4/js/s4.min.js`:
1. Выставляет тему по `prefers-color-scheme` (`dark`/`light`), если не задано пользовательское значение `theme`.
2. Добавляет порядок CSS-слоев: `@layer elements, themes, utilities;`.
3. Загружает `current-device.min.js`.
4. Загружает `dependency-map.json`.
5. Подключает `elements.css`.
6. Подключает `themes.css` текущего устройства.
7. Подключает utility CSS по карте зависимостей.
8. При смене ориентации обновляет набор utility CSS.

## Карта зависимостей CSS

Настраивается файлом `public/s4/dependency-map.json`.

Текущая дефолтная схема:
- `desktop/landscape`: `desktop/landscape`
- `desktop/portrait`: `desktop/landscape + desktop/portrait`
- `tablet/landscape`: `desktop/landscape + tablet/landscape`
- `tablet/portrait`: `desktop/landscape + desktop/portrait + tablet/landscape + tablet/portrait`
- `mobile/landscape`: `desktop/landscape + mobile/portrait + mobile/landscape`
- `mobile/portrait`: `desktop/landscape + desktop/portrait + mobile/portrait`

Важно: это не единственный режим. Можно настроить «один utility CSS на устройство/ориентацию».

## Нейминг utility-классов

Формат:

```text
{device}_{orientation}_{property}--{value}
```

Примеры:
- `d_l_display--flex`
- `m_p_gap--md`
- `t_l_align-items--center`

## Базовые классы и inline CSS-переменные

Примеры:
- `grid-template-columns` + `style="--grid-template-columns: 1fr 1fr"`
- `width` + `style="--width: 2.5em"`
- `line-height` + `style="--line-height: 1.5"`

Для device/orientation можно задавать и префиксные переменные:
- `--d_l_line-height`
- `--d_p_line-height`
- `--m_p_line-height`
- `--t_l_line-height`

## Элементы S4

### Mutated (нативные)

Стили в `elements.css` для нативных тегов: `button`, `a`, `input`, `select`, `table`, `details`, `figure`, `h1-h6` и др.

### Created (кастомные)

Реально присутствуют в `elements.css`:
- `e-group` / `.element--group`
- `e-icon` / `.element--image`
- `e-line`
- `e-truncate` / `.element--truncate`
- `e-badge` / `.element--badge`
- `e-message` / `.element--message`
- `e-body` / `.element--body`
- `e-open` / `.element--open`
- `e-close` / `.element--close`

## Базовые и составные элементы

Рабочая классификация:
- базовые: `e-icon`, `e-line`, `e-truncate`, `e-badge`, `e-open`, `e-close`, `e-body`
- составные: `e-group`, `e-message`

## Модификаторы

Часто используемые акцентные классы:
- `.negative`
- `.prime`
- `.second`
- `.success`
- `.danger`

`.differ` — альтернативный вариант для `button` / `.element--button`.

## Минимальные примеры

### Группа

```html
<e-group class="d_l_display--inline-flex d_l_flex-direction--row" role="group">
    <button>One</button>
    <e-line role="separator"></e-line>
    <button class="prime">Two</button>
</e-group>
```

### Сообщение

```html
<e-message role="status">
    <header>Заголовок</header>
    <e-body>Текст сообщения</e-body>
    <footer>
        <button class="differ">Отмена</button>
        <button class="negative">Ок</button>
    </footer>
</e-message>
```

### Базовый HTML без обязательных классов

```html
<button>Button</button>
<input type="text" placeholder="Input" />
<table>
    <tr>
        <th>Head</th>
        <th>Head</th>
    </tr>
    <tr>
        <td>Cell</td>
        <td>Cell</td>
    </tr>
</table>
```

## Где смотреть исходники

- `public/s4/js/s4.min.js`
- `public/s4/js/current-device.min.js`
- `public/s4/dependency-map.json`
- `public/s4/css/elements.css`
- `public/s4/css/desktop/landscape.css`
- `public/s4/css/desktop/portrait.css`
- `public/s4/css/desktop/themes.css`
- `public/s4/css/mobile/landscape.css`
- `public/s4/css/mobile/portrait.css`
- `public/s4/css/mobile/themes.css`
- `public/s4/css/tablet/landscape.css`
- `public/s4/css/tablet/portrait.css`
- `public/s4/css/tablet/themes.css`


