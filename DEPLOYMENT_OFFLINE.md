# Инструкция по развертыванию проекта офлайн

Данная инструкция описывает полное развертывание Medical Training Platform на локальном компьютере без доступа к интернету.

## 📋 Предварительные требования

### Необходимое ПО (скачать заранее при наличии интернета):

1. **Node.js** (v18 или выше) - https://nodejs.org/
2. **Docker Desktop** - https://www.docker.com/products/docker-desktop/
3. **Git** - https://git-scm.com/
4. **Supabase CLI** - https://supabase.com/docs/guides/cli

### Подготовка (с интернетом):

```bash
# Установить Supabase CLI
npm install -g supabase

# Скачать Docker образы Supabase
docker pull supabase/postgres:15.1.0.147
docker pull supabase/studio:20240101-5e5586d
docker pull supabase/gotrue:v2.132.3
docker pull supabase/realtime:v2.25.50
docker pull supabase/storage-api:v0.46.4
docker pull supabase/postgrest:v12.0.1
docker pull darthsim/imgproxy:v3.8.0
docker pull supabase/edge-runtime:v1.22.4
```

---

## 🚀 Шаг 1: Экспорт проекта

### На компьютере с интернетом:

```bash
# Клонировать проект
git clone [URL_вашего_репозитория]
cd medical-training-platform

# Установить все зависимости
npm install

# Создать архив node_modules (для переноса на офлайн компьютер)
tar -czf node_modules.tar.gz node_modules/

# Экспортировать данные из Lovable Cloud (если нужно)
# Используйте инструменты Supabase для экспорта
```

### Экспорт данных из БД:

```bash
# Подключиться к вашему Supabase проекту
npx supabase login

# Экспортировать данные
npx supabase db dump --data-only > data-export.sql

# Экспортировать файлы из Storage
# Скачайте файлы из бакета theme-media вручную через Supabase Dashboard
```

---

## 💾 Шаг 2: Перенос на офлайн компьютер

Скопируйте следующие файлы/папки:

```
medical-training-platform/
├── весь код проекта
├── node_modules.tar.gz
├── database-export.sql (схема БД)
├── data-export.sql (данные)
└── theme-media/ (файлы из Storage)
```

---

## 🐳 Шаг 3: Настройка локального Supabase

### 3.1 Инициализация Supabase

```bash
cd medical-training-platform

# Инициализировать Supabase проект
npx supabase init

# Запустить локальный Supabase
npx supabase start
```

После запуска вы увидите:

```
API URL: http://localhost:54321
DB URL: postgresql://postgres:postgres@localhost:54432/postgres
Studio URL: http://localhost:54323
anon key: eyJh... [длинный ключ]
service_role key: eyJh... [длинный ключ]
```

**⚠️ ВАЖНО:** Сохраните эти данные!

### 3.2 Применение схемы БД

```bash
# Подключиться к БД
psql postgresql://postgres:postgres@localhost:54432/postgres

# Или через интерфейс
# Откройте http://localhost:54323 в браузере
```

Выполните файл `database-export.sql`:

```bash
psql postgresql://postgres:postgres@localhost:54432/postgres < database-export.sql
```

### 3.3 Импорт данных

```bash
# Импортировать данные
psql postgresql://postgres:postgres@localhost:54432/postgres < data-export.sql
```

### 3.4 Загрузка файлов в Storage

```bash
# Через Supabase Studio (http://localhost:54323)
# 1. Перейти в раздел Storage
# 2. Выбрать bucket "theme-media"
# 3. Загрузить файлы из папки theme-media/
```

Или программно через скрипт:

```javascript
// upload-storage.js
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  'http://localhost:54321',
  '[ваш_service_role_key]'
);

async function uploadFiles() {
  const mediaDir = './theme-media';
  const files = fs.readdirSync(mediaDir);

  for (const file of files) {
    const filePath = path.join(mediaDir, file);
    const fileBuffer = fs.readFileSync(filePath);

    const { error } = await supabase.storage
      .from('theme-media')
      .upload(file, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (error) {
      console.error(`Error uploading ${file}:`, error);
    } else {
      console.log(`Uploaded: ${file}`);
    }
  }
}

uploadFiles();
```

Запустить:
```bash
node upload-storage.js
```

---

## ⚙️ Шаг 4: Настройка проекта

### 4.1 Распаковка зависимостей

```bash
# Распаковать node_modules
tar -xzf node_modules.tar.gz
```

### 4.2 Создание файла окружения

Создайте файл `.env.local` в корне проекта:

```env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_PUBLISHABLE_KEY=eyJh...[anon_key_из_шага_3.1]
VITE_SUPABASE_PROJECT_ID=local
```

### 4.3 Обновление конфигурации Supabase клиента

Файл уже настроен, но убедитесь что `src/integrations/supabase/client.ts` читает переменные из `.env.local`:

```typescript
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
```

---

## 🎯 Шаг 5: Создание первого администратора

### Вариант 1: Через SQL

```sql
-- Создать пользователя в auth.users (замените данные)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@local.dev',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Administrator"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Получить ID созданного пользователя
SELECT id, email FROM auth.users WHERE email = 'admin@local.dev';

-- Назначить роль admin (замените UUID на полученный ID)
INSERT INTO public.user_roles (user_id, role)
VALUES ('[UUID_пользователя]', 'admin');
```

### Вариант 2: Через интерфейс

1. Откройте http://localhost:54323
2. Перейдите в раздел Authentication
3. Создайте пользователя вручную
4. Через SQL Editor добавьте роль:

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('[UUID_пользователя]', 'admin');
```

---

## 🚀 Шаг 6: Запуск приложения

```bash
# Запустить в режиме разработки
npm run dev

# Или собрать production версию
npm run build
npm run preview -- --host 0.0.0.0 --port 8080
```

Приложение будет доступно по адресу:
- **Development:** http://localhost:5173
- **Production:** http://localhost:8080

---

## 🔧 Настройка аутентификации

### Отключение подтверждения email (для локальной работы)

В Supabase Studio (http://localhost:54323):

1. Перейдите в **Authentication → Settings**
2. Найдите **"Enable email confirmations"**
3. Отключите эту опцию
4. Сохраните изменения

Или через SQL:

```sql
UPDATE auth.config 
SET enable_signup = true, 
    mailer_autoconfirm = true;
```

---

## 📱 Доступ с других устройств в локальной сети

Для доступа с планшетов/смартфонов в той же сети:

```bash
# Узнать IP адрес компьютера
# Windows:
ipconfig

# Linux/Mac:
ifconfig
```

Затем на других устройствах открыть:
- Приложение: `http://[IP_адрес]:8080`
- Supabase Studio: `http://[IP_адрес]:54323`

⚠️ **Важно:** Обновите `.env.local`:

```env
VITE_SUPABASE_URL=http://[IP_адрес]:54321
```

И пересоберите приложение.

---

## 🔍 Проверка работоспособности

### 1. Проверка Supabase

```bash
# Проверить статус
npx supabase status

# Проверить логи
npx supabase logs
```

### 2. Проверка БД

```bash
# Подключиться к БД
psql postgresql://postgres:postgres@localhost:54432/postgres

# Проверить таблицы
\dt public.*

# Проверить данные
SELECT COUNT(*) FROM public.themes;
SELECT COUNT(*) FROM public.test_questions;
```

### 3. Проверка Storage

Откройте http://localhost:54323/project/default/storage/buckets/theme-media

---

## 🛠️ Решение проблем

### Проблема: Supabase не запускается

```bash
# Остановить все контейнеры
npx supabase stop

# Очистить данные
npx supabase db reset

# Запустить заново
npx supabase start
```

### Проблема: Ошибки подключения к БД

Проверьте что Docker запущен:

```bash
docker ps
```

Должны быть запущены контейнеры:
- supabase_db_*
- supabase_studio_*
- supabase_auth_*
- supabase_rest_*
- supabase_realtime_*
- supabase_storage_*

### Проблема: Приложение не видит данные

1. Проверьте RLS политики в БД
2. Убедитесь что пользователь авторизован
3. Проверьте консоль браузера на ошибки

### Проблема: Storage файлы не загружаются

```bash
# Проверить права на bucket
SELECT * FROM storage.buckets WHERE id = 'theme-media';

# Должно быть: public = true
```

---

## 📦 Бэкап и восстановление

### Создание бэкапа

```bash
# Бэкап БД
npx supabase db dump > backup-$(date +%Y%m%d).sql

# Бэкап Storage
# Скачайте файлы через Studio или используйте скрипт
```

### Восстановление

```bash
# Восстановить БД
psql postgresql://postgres:postgres@localhost:54432/postgres < backup-20240101.sql
```

---

## 📚 Полезные команды

```bash
# Supabase
npx supabase start          # Запустить
npx supabase stop           # Остановить
npx supabase status         # Статус
npx supabase db reset       # Сбросить БД
npx supabase logs           # Логи

# Проект
npm run dev                 # Разработка
npm run build               # Сборка
npm run preview             # Просмотр production

# Docker
docker ps                   # Список контейнеров
docker logs [container_id]  # Логи контейнера
docker restart [container_id] # Перезапуск
```

---

## 🎓 Рекомендации

1. **Регулярные бэкапы:** Делайте резервные копии БД раз в день
2. **Мониторинг:** Следите за логами Supabase
3. **Производительность:** Для большого числа пользователей увеличьте ресурсы Docker
4. **Безопасность:** Измените пароли по умолчанию для production использования

---

## 📝 Контрольный список развертывания

- [ ] Node.js установлен
- [ ] Docker установлен и запущен
- [ ] Supabase CLI установлен
- [ ] Проект скопирован
- [ ] node_modules распакованы
- [ ] Supabase запущен (npx supabase start)
- [ ] database-export.sql применен
- [ ] data-export.sql импортирован
- [ ] Файлы загружены в Storage
- [ ] .env.local создан и настроен
- [ ] Создан администратор
- [ ] Аутентификация настроена
- [ ] Приложение запущено
- [ ] Тесты пройдены

---

## 📞 Устранение неполадок

Если возникли проблемы:

1. Проверьте логи: `npx supabase logs`
2. Перезапустите Supabase: `npx supabase stop && npx supabase start`
3. Проверьте Docker: `docker ps`
4. Проверьте порты: убедитесь что 54321, 54323, 54432 свободны
5. Проверьте файл .env.local на правильность ключей

---

## ✅ Готово!

После выполнения всех шагов ваше приложение полностью работает офлайн на локальном компьютере.

Для доступа:
- **Приложение:** http://localhost:8080
- **Supabase Dashboard:** http://localhost:54323
- **API:** http://localhost:54321

**Учётные данные администратора:**
- Email: admin@local.dev
- Пароль: admin123

(Измените эти данные в production!)
