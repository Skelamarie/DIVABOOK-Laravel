# Set up DivaBook on your own computer

These instructions are for Windows with Laravel Herd. Each person needs their own local dependencies, PHP settings, and private `.env`. Git contains the application source and lock files; it does not contain credentials, MongoDB records, `vendor`, `node_modules`, or built assets.

## 1. Get the code

Clone into a folder you manage with Herd, or pull your existing clone after saving your own changes:

```powershell
git clone https://github.com/Skelamarie/DIVABOOK-Laravel.git
cd DIVABOOK-Laravel
```

For an existing clone:

```powershell
git pull --ff-only origin main
```

Add the project folder in Herd's Site Manager if it is not already listed. Use the site URL shown there.

## 2. Match the runtime

Install an up-to-date **PHP 8.4.x** in Herd; this lock file needs at least **8.4.1**. Select PHP 8.4 for the DivaBook site. From the project directory you can also run:

```powershell
herd isolate 8.4
herd php --version
herd php --ri mongodb
node --version
```

Use **MongoDB's PHP extension 2.4 or newer within 2.x**. CI uses **2.5.4**. Extension 1.21 is too old for this lock file. The extension is separate from installing MongoDB Server or MongoDB Compass. For Windows, choose the official DLL matching your PHP 8.4 build, thread safety, compiler, and architecture; enable it in that version's php.ini. Check `herd php --ri mongodb` after installing it. See the [official driver downloads](https://pecl.php.net/package/mongodb) and [Herd PHP version settings](https://herd.laravel.com/docs/windows/technology/php-versions).

Enable cURL, fileinfo, mbstring, OpenSSL, DOM, XML/XMLWriter, and PDO SQLite. Use **Node 22.18+ within 22.x**, matching CI, or **Node 24.11+**.

In Herd's PHP settings ensure:

```ini
file_uploads=On
upload_max_filesize=5M
post_max_size=64M
max_file_uploads=10
```

Larger limits are fine. **Restart Herd with Stop all, then Start all after changing PHP settings or extensions.** A code-only pull does not require restarting Herd. [Herd PHP settings](https://herd.laravel.com/docs/windows/technology/php-settings)

## 3. Configure your private environment

Keep your existing `.env` and `APP_KEY`. If `.env` does not exist, copy the template:

```powershell
Copy-Item .env.example .env
```

Edit `.env` locally. Set `APP_URL` to your actual Herd site URL, and fill these values using the team's privately shared configuration:

```dotenv
MONGODB_URI=your-local-or-approved-Atlas-connection-string
MONGODB_DATABASE=DivaBookDB
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_FOLDER_MODE=auto
SESSION_DRIVER=file
CACHE_STORE=file
QUEUE_CONNECTION=sync
```

Those credential strings are placeholders, not working values. Alternatively use a valid `CLOUDINARY_URL`; if you also supply separate credentials, both formats must match. Keep `.env` out of Git and avoid putting credentials in public chat or screenshots.

If using local MongoDB, start MongoDB Server. If using Atlas, the credentials must have access to the chosen database and that machine's network must be allowed by the project's Atlas settings. MongoDB data does not arrive through a Git pull. For a shared test store, use the approved shared database; for a new local database, register a partner and add a service before testing customer booking.

Partner, service, booking, and inquiry models explicitly use MongoDB. The starter SQL-account/settings functionality is separate; it still uses the default SQLite connection. If you need that functionality, configure SQLite and run its migrations. File sessions/cache and the sync queue let the DivaBook partner flow start without SQL session/cache/queue tables.

## 4. Run setup and checks

From the project folder:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\setup-herd.ps1
```

The script checks the required runtime and upload settings, installs locked dependencies, generates `APP_KEY` only if missing, clears caches, builds assets, runs the complete CI checks, and checks MongoDB/Cloudinary without writing documents or uploading images. It keeps an existing `.env` and key. It does not edit Herd's PHP configuration or install extensions for you. If a prerequisite is missing, follow its message and rerun.

For manual setup using the PHP version isolated in Herd:

```powershell
herd composer install
npm ci
```

Only when `APP_KEY` is empty in a new environment:

```powershell
herd php artisan key:generate
```

Then:

```powershell
herd php artisan optimize:clear
npm run build
herd composer ci:check
herd php artisan mongodb:check
herd php artisan cloudinary:check
```

Use `npm run dev` while editing frontend files, or rebuild after pulling changes. Close an old Vite process before relying on a new production build. The complete CI suite checks frontend formatting/lint, TypeScript, PHP formatting, PHP static analysis, and all tests. Its upload tests simulate the API; they do not upload to your account.

## 5. Test the actual app

Open the site URL from Herd. Log in or register a partner, then test a logo and service photos. Make one test customer booking with an inspiration image and receipt. Confirm the images remain visible after refreshing and the URLs are saved in MongoDB.

| Upload         | Expected folder                     |
| -------------- | ----------------------------------- |
| Logo           | `PFP/{admin_id}`                    |
| Service photos | `Samples/{admin_id}/{service_name}` |
| Inspiration    | `Inspo/{admin_id}`                  |
| Receipt        | `Receipts/{admin_id}`               |

The provider's store and payment/QR details must be configured for the booking you choose. Use small JPG/PNG images first, then check the supported 5 MB limit if needed. Report the failed command or form error if a test fails; keep credentials private.
