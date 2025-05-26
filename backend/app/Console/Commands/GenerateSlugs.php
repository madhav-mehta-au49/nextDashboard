<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Str;

class GenerateSlugs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:generate-slugs';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate slugs for all users who do not have them';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $users = User::whereNull('slug')
                    ->orWhere('slug', '')
                    ->get();
                    
        $count = 0;
        
        foreach ($users as $user) {
            if (!empty($user->name)) {
                $user->slug = Str::slug($user->name);
                
                // Make sure slug is unique
                $originalSlug = $user->slug;
                $counter = 1;
                
                while (User::where('slug', $user->slug)
                           ->where('id', '!=', $user->id)
                           ->exists()) {
                    $user->slug = $originalSlug . '-' . $counter;
                    $counter++;
                }
                
                $user->save();
                $count++;
            }
        }
        
        $this->info("Generated slugs for {$count} users.");
    }
}
