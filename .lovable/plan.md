# План: фронтенд сайта школы китайского CHINAR

Только фронтенд, без бэкенда. Стэк — стандартный современный Lovable: **React 19 + TanStack Start + TanStack Query + Tailwind v4 + shadcn/Radix + TypeScript strict**, плюс **Motion for React** для сложных анимаций. Данные — типизированные mock-репозитории поверх JSON + `localStorage`, чтобы позже без переписывания подключить Lovable Cloud.

Визуальный референс — chinar.base44.app (тёплый терракотовый фон, красные акценты CHINAR, крупная гротескная типографика, скруглённые карточки-«облачка», спич-баблы). Маскот — наш тигрёнок в роли гида.

## Правила проекта
- Все цвета/тени/градиенты — семантические oklch-токены в `src/styles.css`. Никаких `text-white`/hex в компонентах.
- Роуты — отдельные файлы под каждый раздел, у каждого свой `head()` с title/description/OG.
- Тёмная тема через класс `.dark` на `<html>`, переключатель в шапке.
- i18n RU/EN через лёгкий провайдер + словари `src/i18n/{ru,en}.ts`. Все тексты только через `t('...')`.
- Форм-валидация — react-hook-form + zod. UI-примитивы — shadcn.
- Анимации — Motion for React: `motion.div`, `AnimatePresence`, `useScroll`, `useInView`, layout-анимации. Плюс `tw-animate-css` для мелких утилит.
- Слой данных: `src/data/repositories/*.ts` (getTeachers, getReviews, getPrices, getSchedule, ...) поверх JSON в `src/data/mock/*.json`. Мутации админки/преподавателя — TanStack Query mutations в `localStorage` через обёртку `mockDb`. Компоненты ходят ТОЛЬКО в репозитории — позже они заменяются на server functions без изменений в UI.
- Роли: `guest | teacher | admin`. Фейковый `useAuth` (логин по email из seed). Защита — layout `_authenticated.tsx` и `_admin.tsx`.

## Структура роутов
```text
/                       Главная
/about                  О школе + О проекте
/team                   Преподаватели + /team/$slug профиль
/leadership             Руководство
/pricing                Услуги и цены (метка «особый»)
/schedule               Публичное расписание на 2 недели
/reviews                Отзывы
/contacts               Контакты + юр. данные
/auth/login             Вход
/auth/invite/$token     Приём приглашения (моки)
/_authenticated/teacher/…   Кабинет преподавателя
  ├── schedule          Своё расписание (CRUD)
  ├── lessons           Отметка проведено/отменено + причина
  └── profile           Редактирование своего профиля
/_authenticated/admin/…     Админка
  ├── (dashboard)       Статистика заявок и занятий
  ├── requests          Заявки
  ├── teachers          Список + расписание конкретного
  ├── leadership        Кто виден на главной
  ├── reviews           CRUD отзывов
  ├── pricing           CRUD цен + «особый»
  ├── users             Роли, приглашения по email
  ├── content           О школе / О проекте / контакты / юр. данные
  └── schedule          Общий календарь
```

## Дизайн-система (Этап 1)
- Токены (oklch) в `src/styles.css` в двух темах:
  - light: тёплый персик `--background`, тёмно-коричневый `--foreground`, красный CHINAR `--primary`, терракот `--accent`, кремовый `--muted`, кремово-белые «облачка» `--surface-card`.
  - dark: глубокий тёмно-угольный тёплый фон, красный остаётся акцентом, карточки — приглушённый уголь.
  - Доп.: `--radius` = 1.25rem, `--shadow-soft`, `--shadow-float`, `--gradient-warm`.
- Шрифты: заголовки — плотный гротеск (Onest / Unbounded, `font-display`), тело — Inter/Manrope. Подключение через `<link>` в `__root.tsx` head (не через CSS `@import`).
- Компоненты-обёртки: `SectionHeader`, `Chip`, `SoftCard`, `StatBubble`, `SpeechBubble`, `MascotHint`, `LangToggle`, `ThemeToggle`.
- Motion-пресеты: `fadeUp`, `pop`, `float`, `stagger` — единый `src/lib/motion.ts`.

## Маскот
Из загруженных PNG собрать набор поз через `lovable-assets` (без копирования бинарей в репо): `hello`, `wave`, `sad`, `think`, `point`, `peek`. Компонент `<Mascot pose size />` + `<MascotHint>` (плавающий спич-бабл, анимация `float` + `pop` через Motion). Используется в hero, пустых состояниях, 404, успехах форм, подсказках админки.

## Главная страница (Этап 1) — композиция по референсу
1. Шапка: логотип «中 CHINAR», nav (О школе / Команда / Цены / Расписание), `LangToggle`, `ThemeToggle`, CTA «Записаться».
2. Hero: слева крупный заголовок в 3 строки с красным акцентом на «КИТАЙСКОГО», подзаголовок, две кнопки (primary + ghost), три `StatBubble` (5+ преподавателей, 200+ выпускников, 3 уровня). Справа — карточка-«облачко» с тигрёнком (`pose="hello"`), иероглифы 你好, пиньинь, чипы уровней HSK, бэйдж «Онлайн», нижний бэйдж «Носители языка». Фоном — большой полупрозрачный круг. Motion: float у карточки, stagger у чипов, pop у бэйджей.
3. «О школе» — 3 карточки-фичи с микро-иллюстрациями маскота, появление на скролле (`useInView`).
4. Услуги/цены — превью 3–4 карточек, «особый» подсвечен, кнопка → `/pricing`.
5. Преподаватели — горизонтальный слайдер аватарок, → `/team`.
6. Расписание — 2 недели, дни недели сверху с числами, заглушки занятий. Кнопка → `/schedule`.
7. Отзывы — 3 карточки с фото и цитатой, стрелки навигации.
8. CTA-блок «Записаться» с маскотом `pose="wave"`.
9. Футер: контакты, юр. данные, соц., копирайт.

Данные — через `useSuspenseQuery` из mock-репозиториев.

## Этапы после утверждения
- **Этап 1 (сейчас)**: дизайн-система + Motion + маскот-ассеты + главная страница + i18n/theme каркас.
- **Этап 2**: публичные внутренние страницы (About, Team+профиль, Pricing, Schedule, Reviews, Contacts) + полноценные RU/EN словари.
- **Этап 3**: Auth (моки) + защищённые layout'ы + кабинет преподавателя.
- **Этап 4**: Админка полностью (dashboard, teachers, schedule, reviews, pricing, leadership, content, users, invites).
- **Этап 5**: Полировка — тёмная тема во всех сценариях, мобильная версия, продвинутые анимации маскота, пустые/ошибочные состояния, SEO/OG на каждом роуте.

## Память проекта при старте сборки
- Core: терракотово-красная палитра CHINAR, шрифты Onest/Inter, маскот-тигрёнок как гид, стиль как chinar.base44.app, RU/EN, тёмная тема, мобилка обязательны, Motion for React для анимаций.
- `design/tokens` — конкретные oklch значения.
- `feature/data-layer` — компоненты ходят только в `src/data/repositories/*`.
- `constraint` — никаких хардкод-цветов, никакого бэкенда до отдельного запроса.

## Что делаю в Этапе 1 (первое сообщение после «Implement plan»)
1. `bun add motion` + Motion-пресеты в `src/lib/motion.ts`.
2. Токены в `src/styles.css` (light + dark) + шрифты в `__root.tsx`.
3. Провайдеры темы и i18n, компоненты `ThemeToggle`, `LangToggle`.
4. Ассеты маскота через lovable-assets + компонент `<Mascot />`, `<MascotHint>`.
5. Базовые UI-примитивы (SoftCard, Chip, SpeechBubble, StatBubble, SectionHeader).
6. Mock-репозитории и seed JSON под главную.
7. Layout с шапкой/футером и главная страница `/` целиком по референсу.
8. Обновлённые `head()` в `__root.tsx` и `/` (title/description/OG).
