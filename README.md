# Product Catalog System

The system consists of three interconnected applications:

- **Laravel Backend** – REST API and database management.
- **React Administration Website** – catalog management interface.
- **Android Application** – product catalog for end users built with Jetpack Compose.

Both the administration website and the Android application communicate with the Laravel backend through the REST API and require it to be running.

## Playground

The latest public deployment is available at:

| Service | URL |
|---------|-----|
| Administration Website | https://catalog-playground.aripinet.space |
| Backend API | https://catalog-backend.aripinet.space |

---

# Requirements

## Software

- Windows 10/11 or Linux
- PHP 8.5
- Composer
- MariaDB
- Node.js LTS
- npm
- Android Studio (for building the Android application)
- Git
- Modern web browser
- Android 9+ (for running the mobile application)

## Development Environment

The project was developed and tested using:

- Arch Linux
- AMD Ryzen 9 9900X
- 64 GB DDR5 RAM
- NVMe SSD
- Android 16 (Baklava)
- Qualcomm Snapdragon 8 Gen 3
- 12 GB RAM mobile device

---

# Installation

## 1. Install prerequisites

### Node.js

Verify the installation:

```bash
node -v
npm -v
```

If not installed, download the latest LTS release from https://nodejs.org.

### PHP

Verify Composer:

```bash
composer -V
```

If PHP is not installed on Windows:

```powershell
winget install -e --id PHP.PHP.8.5
```

---

## 2. Clone the repository

```bash
git clone https://github.com/igoriochek/translations.git
cd translations
```

---

# Backend Installation

```bash
cd catalog-backend
composer install
cp .env.example .env
```

Configure the following values inside `.env`:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=catalog_backend
DB_USERNAME=root
DB_PASSWORD=password
APP_URL=http://localhost:8000
```

Generate the application key:

```bash
php artisan key:generate
```

Create the database schema and seed initial data:

```bash
php artisan migrate --seed
```

Start the backend:

```bash
php artisan serve
```

Default address:

```
http://localhost:8000
```

---

# Administration Website Installation

```bash
cd catalog-web
npm i
cp .env.example .env
```

Configure:

```env
VITE_BACKEND_URL=http://localhost:8000
```

where the value should match `APP_URL` configured for the backend.

Start the development server:

```bash
npm run dev
```

After startup, Vite will display the local website address (e.g: `http://localhost:5174`).

---

# Android Application Installation

1. Open the `catalog-android` project in Android Studio.
2. Open the integrated terminal.
3. Create the configuration file from `app.properties.example`.
4. Set `API_URL` to the same server address used for `APP_URL` and `VITE_BACKEND_URL`.
5. Wait for Gradle to download all dependencies.
6. Connect an Android device or start an emulator.
7. If using a physical device, enable **Developer Options** and **USB Debugging**.
8. Press **Run** in Android Studio.

---

# Configuration

For the default local setup:

| Component | Address |
|----------|---------|
| Laravel Backend | http://localhost:8000 |
| React Administration Website | http://localhost:5174 |

> **Important:** `VITE_BACKEND_URL`, and `API_URL` must point to the address defined in the `APP_URL` field(on which the backend server is hosted).

---

# Running the System

Start the components in the following order:

1. Start MariaDB.
2. Start the Laravel backend:
   ```bash
   php artisan serve
   ```
3. Start the administration website:
   ```bash
   npm run dev
   ```
4. Launch the Android application from Android Studio.

---

# Uninstallation

To remove the system:

1. Stop all running processes.
2. Delete the project directory.
3. Remove the MariaDB database created for the project.
4. Optionally uninstall Node.js, PHP, Composer and Android Studio if they are no longer needed.
