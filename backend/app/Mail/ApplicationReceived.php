<?php

namespace App\Mail;

use App\Models\JobApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ApplicationReceived extends Mailable
{
    use Queueable, SerializesModels;

    public $application;

    /**
     * Create a new message instance.
     */
    public function __construct(JobApplication $application)
    {
        $this->application = $application;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        $subject = 'Application Received - ' . $this->application->jobListing->title;
        
        return $this->subject($subject)
                   ->view('emails.application-received')
                   ->with([
                       'application' => $this->application,
                       'companyName' => $this->application->jobListing->company->name,
                       'jobTitle' => $this->application->jobListing->title,
                   ]);
    }
}
