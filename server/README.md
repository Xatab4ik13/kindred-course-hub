# CHINAR — бекенд

Node.js + Express + SQLite (better-sqlite3). Хранит данные админ-панели и отдаёт публичные данные сайта.

## Запуск на VPS

```bash
cd /var/www/chinar/server
npm install
# секрет для JWT (обязательно поменять)
echo "JWT_SECRET=$(openssl rand -hex 32)" > .env
echo "PORT=4000" >> .env
pm2 start src/index.js --name chinar-api --update-env
pm2 save
```

База создаётся автоматически: `server/data/chinar.db`, при первом запуске заполняется начальными данными (`src/seed.js`),
включая администратора `AdminChinar1`.

## Nginx

В блок `server` сайта добавить проксирование API:

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:4000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    client_max_body_size 12m;
}
```

Затем `nginx -t && systemctl reload nginx`.

## API

- `POST /api/auth/login` — вход (логин/пароль), возвращает JWT.
- `GET /api/auth/me` — текущая сессия.
- `GET /api/public/state` — данные для сайта (преподаватели, руководство, цены, отзывы, новости, контакты).
- `POST /api/public/requests` — заявка с сайта.
- `GET /api/state` — все данные для панели (нужен токен).
- `PUT /api/state/:key` — сохранение раздела (RBAC: преподаватель правит только своё).
- `POST /api/accounts`, `DELETE /api/accounts/:login`, `DELETE /api/accounts/by-teacher/:id` — доступы (только админ).

## Разработка

Фронт в дев-режиме ходит на `http://localhost:4000/api` (см. `.env.development` в корне репозитория).
В продакшене используется относительный `/api` через nginx.
