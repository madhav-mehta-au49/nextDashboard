<?php

namespace App\Mail;

use App\Models\JobApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ApplicationStatusChanged extends Mailable
{
    use Queueable, SerializesModels;

    public $application;
    public $oldStatus;
    public $newStatus;

    /**
     * Create a new message instance.
     */
    public function __construct(JobApplication $application, string $oldStatus, string $newStatus)
    {
        $this->application = $application;
        $this->oldStatus = $oldStatus;
        $this->newStatus = $newStatus;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        $subject = 'Application Status Update - ' . $this->application->jobListing->title;
        
        return $this->subject($subject)
                   ->view('emails.application-status-changed')
                   ->with([
                       'application' => $this->application,
                       'oldStatus' => $this->oldStatus,
                       'newStatus' => $this->newStatus,
                       'companyName' => $this->application->jobListing->company->name,
                       'jobTitle' => $this->application->jobListing->title,
                   ]);
    }
}
