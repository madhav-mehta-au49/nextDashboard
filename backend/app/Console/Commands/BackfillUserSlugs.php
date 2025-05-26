<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Str;

class BackfillUserSlugs extends Command
{
    protected $signature = 'users:backfill-slugs';
    protected $description = 'Backfill slugs for users based on their name';

    public function handle()
    {
        $users = User::whereNull('slug')->orWhere('slug', '')->get();
        $count = 0;
        foreach ($users as $user) {
            $user->slug = Str::slug($user->name);
            $user->save();
            $count++;
        }
        $this->info("Backfilled slugs for {$count} users.");
    }
}
