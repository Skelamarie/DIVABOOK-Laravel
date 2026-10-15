<?php

namespace Tests\Feature;

use Inertia\Testing\AssertableInertia;
use Mockery;
use PHPUnit\Framework\Attributes\PreserveGlobalState;
use PHPUnit\Framework\Attributes\RunInSeparateProcess;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    #[RunInSeparateProcess]
    #[PreserveGlobalState(false)]
    public function test_homepage_renders_the_mongodb_partner_catalog(): void
    {
        $partners = Mockery::mock('alias:App\Models\Partner');
        $partnerQuery = Mockery::mock();
        $partners->shouldReceive('take')->once()->with(3)->andReturn($partnerQuery);
        $partnerQuery->shouldReceive('get')->once()->andReturn(collect([(object) [
            '_id' => '507f1f77bcf86cd799439011', 'admin_id' => 'DB-1234', 'shop_name' => 'Test Salon',
            'branding' => ['salon_name' => 'Test Salon', 'logo_path' => 'https://res.cloudinary.com/demo/logo.png'],
        ]]));
        $services = Mockery::mock('alias:App\Models\Service');
        $serviceQuery = Mockery::mock();
        $services->shouldReceive('where')->times(4)->withArgs(fn ($field, $operator, $category) => $field === 'category' && $operator === 'regex')->andReturn($serviceQuery);
        $serviceQuery->shouldReceive('exists')->times(4)->andReturnTrue();
        $this->get(route('home'))->assertOk()->assertInertia(fn (AssertableInertia $page) => $page->component('Customer/HomePage')
            ->where('recommended.0.name', 'Test Salon')->where('recommended.0.logo', 'https://res.cloudinary.com/demo/logo.png'));
    }
}
