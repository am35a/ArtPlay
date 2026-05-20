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

Рекомендуемый способ подключения - через s4.min.js, который автоматически загружает необходимые CSS-файлы.

```html
<head>
    <script src="/s4/js/s4.min.js"></script>
    <script>S4()</script>
</head>
<body>
    <!-- JS-фреймворк (svelte, vue и т.п.) в приложение подключается отдельно -->
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

## Нейминг utility-классов "*--{value}"

Формат:

```text
{device}_{orientation}_{property}--{value}
```
для части utility-классов доступны классы без device/orientation-префиксов

```text
{property}--{value}
```

Примеры:
- `d_l_display--flex`
- `m_p_gap--md`
- `t_l_align-items--center`
- `object-fit--cover`

Отличие: отсутствие `{device}_{orientation}_` в нейминге классов означет что класс применяется ко всем устройствам/ориентаций, количество таких классов ограничено.
Важно: перед использованием size-классов (gap, padding, margin и т.п.) обязательно надо проверять соответствие значений `*--{value}` значениям в `themes.css`.

## Проверка значений перед использованием utility-классов "*--{value}"

Важно: перед использованием utility-классов `*--{value}` проверьте, есть ли нужное значение в `themes.css` для целевого устройства. Если значения там нет — используйте базовый класс + inline style.

Примеры:
- правильно - `d_l_width--50` — если 50 есть в themes.css
- неправильно - `d_l_width--64vw` — такого значения нет → использовать `class="width" style="--width: 64vw"`

## Базовые классы и inline CSS-переменные

Важно: классы вида `bottom`, `z-index`, `width`, `background-color`, `color`, `padding`, `margin`, `grid-template-columns` — без префикса устройства и без значения. Они активируют CSS-переменную, значение задаётся через inline style.

Механизм: если есть базовый класс `.background-color`, то в CSS определён `background-color: var(--d_l_background-color, var(--background-color))`. Значение можно задать через inline `--background-color: <любое значение>` — не нужно подбирать готовую тему-переменную.

Примеры:
- `class=" grid-template-columns"` + `style="--grid-template-columns: 1fr 2fr"`
- `class=" width"` + `style="--width: 2.5em"`
- `class=" line-height"` + `style="--line-height: 1.5"`
- `style="--background-color: color-mix(in srgb, var(--positive) 70%, transparent)"`
- `<div class="bottom z-index" style="--bottom: .25em; --z-index: 20;">`

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
- `e-icon` / `.element--icon`
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

## В каких исходниках искать классы и значения переменных

В файлах
`s4/css/{device}/{orientation}.css`
- `s4/css/desktop/landscape.css`
- `s4/css/desktop/portrait.css`
- `s4/css/mobile/landscape.css`
- `s4/css/mobile/portrait.css`
- `s4/css/tablet/landscape.css`
- `s4/css/tablet/portrait.css`
классы без префикса устройства: `object-fit--cover` и др.
классы с префиксами устройств: `d_l_display--flex`, `d_l_gap--md`, `d_l_border-radius--s1` и др.
базовые классы без префикса и значения: `max-width`, `width` и др.

В файлах
`s4/css/{device}/themes.css`
- `s4/css/desktop/themes.css`
- `s4/css/mobile/themes.css`
- `s4/css/tablet/themes.css`
находятся значения всех CSS-переменных (размеры, цвета, отступы) в блоках @layer > @scope > :scope
`
@layer themes {
  @scope ([theme=light]) {
    :scope {
        /* список переменных*/
    }
  }
}
`

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

## Рефакторинг на S4: правила для AI-агента

- Не мапь CSS-свойства один-к-одному на utility-классы. Сначала ищи готовые компоненты S4 (`element--truncate`, `e-group`, `e-icon` и т.д.).
- Перед изменениями смотри, как похожий паттерн уже реализован в компонентах проекта.
- Не добавляй классов сверх того, что было в исходном CSS — заменяй существующие свойства, не улучшай.
- Для кастомных значений, которых нет в utility-классах и темах, не пытайся подобрать ближайшую тему-переменную. Используй inline `--<свойство>: <значение>` — S4 прочитает её через fallchain цепочку базового класса. Например: `style="--background-color: color-mix(...)"`, `style="--color: #123"`, `style="--padding: 0.35em"`.
