<?php

namespace App\Policies;

use App\Models\Partner;
use App\Models\Service;

class ServicePolicy
{
    public function viewAny(?Partner $user): bool { return true; }
    public function view(?Partner $user, Service $service): bool { return true; }
    public function create(Partner $user): bool { return true; }
    public function update(Partner $user, Service $service): bool { return $user->admin_id === $service->admin_id; }
    public function delete(Partner $user, Service $service): bool { return $user->admin_id === $service->admin_id; }
}