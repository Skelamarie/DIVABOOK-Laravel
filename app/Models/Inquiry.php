<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Inquiry extends Model
{
    protected $connection = 'mongodb';

    protected $table = 'inquiries';

    protected $fillable = ['fullname', 'email', 'type', 'message'];
}
