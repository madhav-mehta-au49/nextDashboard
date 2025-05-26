<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

// Set up the application
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Candidate;
use App\Models\Education;
use App\Models\Experience;
use App\Models\Skill;
use App\Models\Certification;

try {
    echo "Testing models...\n";
    
    // Test if tables exist
    echo "Testing Candidate model...\n";
    $candidate = new Candidate();
    echo "Candidate table: " . $candidate->getTable() . "\n";
    
    echo "Testing Education model...\n";
    $education = new Education();
    echo "Education table: " . $education->getTable() . "\n";
    
    echo "Testing Experience model...\n";
    $experience = new Experience();
    echo "Experience table: " . $experience->getTable() . "\n";
    
    echo "Testing Skill model...\n";
    $skill = new Skill();
    echo "Skill table: " . $skill->getTable() . "\n";
    
    echo "Testing Certification model...\n";
    $certification = new Certification();
    echo "Certification table: " . $certification->getTable() . "\n";
    
    // Try to create a simple candidate
    echo "\nTrying to create a simple candidate...\n";
    $testCandidate = Candidate::create([
        'name' => 'Test User',
        'email' => 'test@example.com',
        'headline' => 'Test Developer'
    ]);
    echo "Candidate created with ID: " . $testCandidate->id . "\n";
    
    // Try to create an education
    echo "\nTrying to create education...\n";
    $testEducation = $testCandidate->educations()->create([
        'degree' => 'Test Degree',
        'field_of_study' => 'Test Field',
        'institution' => 'Test University',
        'start_date' => '2020-01-01'
    ]);
    echo "Education created with ID: " . $testEducation->id . "\n";
    
    echo "\nAll tests passed!\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . "\n";
    echo "Line: " . $e->getLine() . "\n";
}
