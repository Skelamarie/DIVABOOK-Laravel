<?php

namespace App\Policies;

use App\Models\Partner;

class PartnerPolicy
{
    public function viewAny(?Partner $user): bool
    {
        return true;
    }

    public function view(Partner $user, Partner $partner): bool
    {
        return $user->id === $partner->id;
    }

    public function update(Partner $user, Partner $partner): bool
    {
        return $user->id === $partner->id;
    }

    public function delete(Partner $user, Partner $partner): bool
    {
        return $user->id === $partner->id;
    }
}
