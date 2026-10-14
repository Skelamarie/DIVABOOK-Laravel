# DivaBook

Laravel, React/Inertia, MongoDB, and the Cloudinary PHP SDK. The latest changes move validation into Form Requests, use the starter sidebar for admin navigation, fix booking inputs, and standardize image uploads.

## Team setup after pulling

Use PHP 8.4 for both the project in Herd and the terminal. The current dependencies were tested with PHP 8.4; do not use the PHP 8.6 development runtime. Enable MongoDB, cURL, fileinfo, mbstring, and OpenSSL. The automated suite also needs PDO SQLite.

From your local project directory, with your own uncommitted work saved:

    git pull --ff-only origin main
    composer install
    npm ci

Keep your existing .env. For a new clone, copy .env.example to .env and run php artisan key:generate. Configure your own APP_URL, MONGODB_URI, and MONGODB_DATABASE. Partner, service, and booking models explicitly use the mongodb connection. The starter Laravel User model uses the default SQL connection; configure that separately if you use the starter authentication screens. For a local demo without SQL session/cache/queue tables, use SESSION_DRIVER=file, CACHE_STORE=file, and QUEUE_CONNECTION=sync.

Configure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET, or use CLOUDINARY_URL. If you provide both formats, they must agree. Obtain the team-approved credentials privately; .env and credentials are not committed. CLOUDINARY_FOLDER_MODE=auto reads the actual environment setting, including dynamic mode.

In Herd PHP Settings (or the PHP 8.4 php.ini), ensure these minimums:

    upload_max_filesize=5M
    post_max_size=64M
    max_file_uploads=10

Larger existing limits are fine. These machine settings are not included in a Git pull. Restart Herd with Stop all, then Start all after changing PHP settings or extensions. Pulling application code alone does not require a Herd restart. See [Herd PHP settings](https://herd.laravel.com/docs/windows/technology/php-settings).

Then run:

    php artisan optimize:clear
    npm run build
    npm run types:check
    php artisan test --filter=DivaBook
    php artisan cloudinary:check

The production build generates Wayfinder route/action types. For frontend development use npm run dev instead of relying on an old build. Cloudinary's diagnostic checks local configuration, PHP limits, authentication, and folder mode; it uploads no images. The current suite has 36 tests and 235 assertions. Automated upload tests use simulated API responses; separately verify actual uploads in the app.

## Image paths

| Upload | Cloudinary path | MongoDB field |
| --- | --- | --- |
| Customer receipt | Receipts/{admin_id}/{sender_name or customer full name} | bookings.receipt_path |
| Customer inspiration | Inspo/{admin_id}/{last_name} | bookings.reference_image |
| Service sample | Samples/{admin_id}/{service_name}/Image_N | services.photos |
| Logo | PFP/{admin_id}/Image_N | partners.branding.logo_path |

Names are sanitized. Receipt/inspiration collisions get unique suffixes; sample/logo numbering advances until an unused name is available. Uploads do not overwrite existing images. Customer folders use the selected service's admin ID; admin uploads use the partner session. Dynamic mode sets both the Media Library folder and the full public ID. The legacy SDK adapter explicitly signs the newer folder fields and sends settings=true when requesting environment settings.

Try a logo upload, sample photos, and a booking with an inspiration image and receipt. Verify Cloudinary folders, MongoDB URLs, and persistence after refreshing. Payment QR/store configuration must be valid for the selected provider. The app accepts JPG/PNG images up to 5 MB each and up to 10 sample photos per service submission.

Complete source and tests are in app/, config/, resources/, routes/, and tests/Feature/DivaBook/. Local credentials, dependencies, generated builds, PHP configuration, patch backups, and test screenshots are excluded from this change.

## Integration of team changes

The merge includes the team's main branch through 6af1d6f. Login/registration notices, booking display and identifier fixes, branding/color controls, loading feedback, deletion confirmation dialogs, and the new Customer/Contact page are retained. The sidebar and Form Request/Cloudinary implementations replace the older navbar, inline validation, and local-disk upload paths where they conflict.

The Contact form posts to /contact and saves validated inquiries in MongoDB's inquiries collection. It sends no email; a database failure shows a retry error. Account deletion from Customization remains restricted to the current partner session. Booking detail/status lookups use the requested ID and the session admin; missing or other-admin records return 404, with no unrelated-booking fallback.

The starter auth/settings pages are retained because Fortify and settings routes still refer to them. The starter DeleteUser component retains its password-protected SQL-user endpoint; the salon deletion confirmation uses the separate partner endpoint.
