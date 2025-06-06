<?php

namespace App\Mail;

use App\Models\Interview;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class InterviewScheduled extends Mailable
{
    use Queueable, SerializesModels;

    public $interview;

    /**
     * Create a new message instance.
     */
    public function __construct(Interview $interview)
    {
        $this->interview = $interview;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        $subject = 'Interview Scheduled - ' . $this->interview->jobApplication->jobListing->title;
        
        return $this->subject($subject)
                   ->view('emails.interview-scheduled')
                   ->with([
                       'interview' => $this->interview,
                       'application' => $this->interview->jobApplication,
                       'companyName' => $this->interview->jobApplication->jobListing->company->name,
                       'jobTitle' => $this->interview->jobApplication->jobListing->title,
                   ]);
    }
}
