<?php

namespace Tests\Feature\DivaBook;

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use RuntimeException;
use Tests\TestCase;

class MongoDBDiagnosticTest extends TestCase
{
    public function test_offline_check_does_not_connect_to_mongodb(): void
    {
        config(['database.connections.mongodb.dsn' => 'mongodb://127.0.0.1:27017']);
        DB::shouldReceive('connection')->never();
        $this->artisan('mongodb:check --offline')->assertSuccessful();
    }

    public function test_missing_uri_is_reported_without_connecting(): void
    {
        config(['database.connections.mongodb.dsn' => null]);
        DB::shouldReceive('connection')->never();
        $this->artisan('mongodb:check')->expectsOutputToContain('MONGODB_URI is missing.')->assertFailed();
    }

    public function test_connection_exception_does_not_expose_database_credentials(): void
    {
        config(['database.connections.mongodb.dsn' => 'mongodb://username:private-password@server']);
        DB::shouldReceive('connection')->once()->with('mongodb')->andThrow(new RuntimeException('mongodb://username:private-password@server failed'));
        $this->assertSame(1, Artisan::call('mongodb:check'));
        $output = Artisan::output();
        $this->assertStringContainsString('MongoDB connection failed.', $output);
        $this->assertStringNotContainsString('private-password', $output);
        $this->assertStringNotContainsString('username', $output);
    }
}
