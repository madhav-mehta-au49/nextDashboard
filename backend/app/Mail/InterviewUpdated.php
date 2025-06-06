<?php

namespace App\Mail;

use App\Models\Interview;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class InterviewUpdated extends Mailable
{
    use Queueable, SerializesModels;

    public $interview;
    public $changeType; // 'rescheduled', 'cancelled', 'updated'

    /**
     * Create a new message instance.
     */
    public function __construct(Interview $interview, string $changeType = 'updated')
    {
        $this->interview = $interview;
        $this->changeType = $changeType;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        $changeTypeText = ucfirst($this->changeType);
        $subject = "Interview {$changeTypeText} - " . $this->interview->jobApplication->jobListing->title;
        
        return $this->subject($subject)
                   ->view('emails.interview-updated')
                   ->with([
                       'interview' => $this->interview,
                       'application' => $this->interview->jobApplication,
                       'companyName' => $this->interview->jobApplication->jobListing->company->name,
                       'jobTitle' => $this->interview->jobApplication->jobListing->title,
                       'changeType' => $this->changeType,
                   ]);
    }
}
