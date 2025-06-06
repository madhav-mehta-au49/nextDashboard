<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\JobApplicationService;
use App\Models\User;
use App\Models\JobApplication;
use App\Models\ApplicationStatusHistory;

class TestBulkUpdate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:bulk-update';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test bulk status update functionality';

    protected $jobApplicationService;

    public function __construct(JobApplicationService $jobApplicationService)
    {
        parent::__construct();
        $this->jobApplicationService = $jobApplicationService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('=== Testing Bulk Status Update Functionality ===');
        $this->newLine();

        // Find employer user
        $employer = User::where('email', 'mehta2002@gmail.com')->first();
        if (!$employer) {
            $this->error('Employer user not found!');
            return 1;
        }
        
        $this->info("Found employer: {$employer->name} ({$employer->email})");

        // Get application IDs to test
        $applicationIds = [1, 6];
        $newStatus = 'reviewing';
        $notes = 'Status updated to Reviewing by employer via bulk action - Artisan test';

        $this->info("Testing bulk update for applications: " . implode(', ', $applicationIds));
        $this->info("New status: {$newStatus}");
        $this->info("Notes: {$notes}");
        $this->newLine();

        try {
            // Record current status for comparison
            $beforeApplications = JobApplication::whereIn('id', $applicationIds)->get();
            $this->info('Applications before update:');
            foreach ($beforeApplications as $app) {
                $this->line("  App {$app->id}: {$app->status} (updated: {$app->status_updated_at})");
            }
            $this->newLine();

            // Perform bulk update
            $this->info('Performing bulk status update...');
            $updatedCount = $this->jobApplicationService->bulkUpdateApplicationStatus(
                $employer,
                $applicationIds,
                $newStatus,
                $notes
            );

            $this->info("Successfully updated {$updatedCount} applications!");
            $this->newLine();

            // Check results
            $afterApplications = JobApplication::whereIn('id', $applicationIds)->get();
            $this->info('Applications after update:');
            foreach ($afterApplications as $app) {
                $this->line("  App {$app->id}: {$app->status} (updated: {$app->status_updated_at})");
            }
            $this->newLine();

            // Check status history
            $this->info('Checking status history records:');
            foreach ($applicationIds as $appId) {
                $history = ApplicationStatusHistory::where('job_application_id', $appId)
                    ->orderBy('created_at', 'desc')
                    ->first();
                
                if ($history) {
                    $this->line("  App {$appId}: {$history->old_status} → {$history->new_status}");
                    $this->line("    Notes: {$history->notes}");
                    $this->line("    Changed by: {$history->changed_by}");
                    $this->line("    Created: {$history->created_at}");
                } else {
                    $this->line("  App {$appId}: No history record found");
                }
                $this->newLine();
            }

            $this->info('✅ Bulk update test completed successfully!');

        } catch (\Exception $e) {
            $this->error('❌ Bulk update test failed:');
            $this->error($e->getMessage());
            $this->error($e->getTraceAsString());
            return 1;
        }

        return 0;
    }
}
