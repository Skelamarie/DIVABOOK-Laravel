<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use MongoDB\Laravel\Connection;
use Throwable;

class CheckMongoDB extends Command
{
    protected $signature = 'mongodb:check {--offline : Check configuration without connecting}';

    protected $description = 'Check the configured MongoDB connection without writing any documents.';

    public function handle(): int
    {
        $uri = config('database.connections.mongodb.dsn');
        if (! is_string($uri) || trim($uri) === '') {
            $this->error('MONGODB_URI is missing. Configure it privately in your .env.');

            return self::FAILURE;
        }
        $this->info('MongoDB URI is configured. Credentials are hidden.');
        if ($this->option('offline')) {
            return self::SUCCESS;
        }
        try {
            $connection = DB::connection('mongodb');
            if (! $connection instanceof Connection) {
                $this->error('The mongodb connection must use the MongoDB Laravel driver.');

                return self::FAILURE;
            }
            $connection->getDatabase()->command(['ping' => 1])->toArray();
            $this->info('MongoDB connection OK. No documents were written.');

            return self::SUCCESS;
        } catch (Throwable) {
            // Connection exceptions can contain a URI with credentials.
            $this->error('MongoDB connection failed. Check the URI, driver version, server availability, and any Atlas IP access rules.');

            return self::FAILURE;
        }
    }
}
