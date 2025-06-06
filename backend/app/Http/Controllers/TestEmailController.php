<?php

namespace App\Http\Controllers;

use App\Models\JobApplication;
use App\Models\Interview;
use App\Mail\ApplicationReceived;
use App\Mail\ApplicationStatusChanged;
use App\Mail\InterviewScheduled;
use App\Mail\InterviewUpdated;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class TestEmailController extends Controller
{
    /**
     * Test email functionality by sending sample emails
     */
    public function testEmails(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'type' => 'required|in:application_received,status_changed,interview_scheduled,interview_updated'
        ]);

        try {
            $email = $request->email;
            $type = $request->type;

            switch ($type) {
                case 'application_received':
                    $this->testApplicationReceived($email);
                    break;
                case 'status_changed':
                    $this->testStatusChanged($email);
                    break;
                case 'interview_scheduled':
                    $this->testInterviewScheduled($email);
                    break;
                case 'interview_updated':
                    $this->testInterviewUpdated($email);
                    break;
            }

            return response()->json([
                'status' => 'success',
                'message' => "Test email of type '{$type}' sent successfully to {$email}",
                'note' => config('mail.default') === 'log' ? 'Email logged to storage/logs/laravel.log (MAIL_MAILER=log)' : 'Email sent via configured mailer'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to send test email: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Test application received email
     */
    private function testApplicationReceived(string $email): void
    {
        // Get a sample application or create a mock one
        $application = JobApplication::with(['jobListing.company', 'candidate'])
            ->first();

        if (!$application) {
            throw new \Exception('No job applications found in database. Please run the JobApplicationSeeder first.');
        }

        Mail::to($email)->send(new ApplicationReceived($application));
    }

    /**
     * Test status changed email
     */
    private function testStatusChanged(string $email): void
    {
        $application = JobApplication::with(['jobListing.company', 'candidate'])
            ->first();

        if (!$application) {
            throw new \Exception('No job applications found in database. Please run the JobApplicationSeeder first.');
        }

        Mail::to($email)->send(new ApplicationStatusChanged($application, 'pending', 'reviewing'));
    }

    /**
     * Test interview scheduled email
     */
    private function testInterviewScheduled(string $email): void
    {
        $interview = Interview::with(['jobApplication.jobListing.company', 'jobApplication.candidate'])
            ->first();

        if (!$interview) {
            // Create a mock interview for testing
            $application = JobApplication::with(['jobListing.company', 'candidate'])
                ->first();
            
            if (!$application) {
                throw new \Exception('No job applications found in database. Please run the JobApplicationSeeder first.');
            }

            $interview = new Interview([
                'job_application_id' => $application->id,
                'interview_type' => 'video',
                'scheduled_at' => now()->addDays(2),
                'duration_minutes' => 60,
                'meeting_link' => 'https://meet.google.com/test-interview',
                'location' => 'Online',
                'status' => 'scheduled',
                'candidate_notes' => 'Please join the meeting 5 minutes early.',
                'timezone' => 'UTC'
            ]);

            // Set the relationship manually for testing
            $interview->setRelation('jobApplication', $application);
        }

        Mail::to($email)->send(new InterviewScheduled($interview));
    }

    /**
     * Test interview updated email
     */
    private function testInterviewUpdated(string $email): void
    {
        $interview = Interview::with(['jobApplication.jobListing.company', 'jobApplication.candidate'])
            ->first();

        if (!$interview) {
            // Create a mock interview for testing
            $application = JobApplication::with(['jobListing.company', 'candidate'])
                ->first();
            
            if (!$application) {
                throw new \Exception('No job applications found in database. Please run the JobApplicationSeeder first.');
            }

            $interview = new Interview([
                'job_application_id' => $application->id,
                'interview_type' => 'video',
                'scheduled_at' => now()->addDays(3),
                'duration_minutes' => 45,
                'meeting_link' => 'https://meet.google.com/updated-interview',
                'location' => 'Online',
                'status' => 'rescheduled',
                'candidate_notes' => 'Interview has been rescheduled.',
                'timezone' => 'UTC'
            ]);

            // Set the relationship manually for testing
            $interview->setRelation('jobApplication', $application);
        }

        Mail::to($email)->send(new InterviewUpdated($interview, 'rescheduled'));
    }

    /**
     * Get current mail configuration info
     */
    public function mailConfig(): JsonResponse
    {
        return response()->json([
            'current_mailer' => config('mail.default'),
            'from_address' => config('mail.from.address'),
            'from_name' => config('mail.from.name'),
            'configuration' => [
                'log' => 'Emails are logged to storage/logs/laravel.log',
                'smtp' => 'Emails sent via SMTP server',
                'array' => 'Emails stored in memory (testing)',
                'sendmail' => 'Emails sent via system sendmail'
            ],
            'note' => 'To actually send emails, change MAIL_MAILER in .env file'
        ]);
    }
}
