<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Interview Scheduled</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9fafb;
        }
        .container {
            background: white;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #059669;
            margin-bottom: 10px;
        }
        .interview-details {
            background: #f0f9ff;
            border: 1px solid #0ea5e9;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .job-details {
            background: #f9fafb;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
        }
        .cta-button {
            display: inline-block;
            background: #059669;
            color: white;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: 600;
            margin: 10px 5px;
        }
        .calendar-button {
            background: #0ea5e9;
        }
        .calendar-icon {
            background: #dbeafe;
            color: #0ea5e9;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            font-size: 30px;
        }
        .prep-tips {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">JobPortal</div>
            <div class="calendar-icon">📅</div>
            <h1>Interview Scheduled!</h1>
        </div>

        <div class="content">
            <p>Hello {{ $interview->jobApplication->candidate->name ?? $interview->jobApplication->first_name }},</p>
            
            <p>Great news! We'd like to invite you for an interview for the following position:</p>
            
            <div class="job-details">
                <h3>{{ $jobTitle }}</h3>
                <p><strong>Company:</strong> {{ $companyName }}</p>
                <p><strong>Application ID:</strong> #{{ $interview->jobApplication->id }}</p>
            </div>

            <div class="interview-details">
                <h3>📋 Interview Details</h3>
                <p><strong>Date & Time:</strong> {{ \Carbon\Carbon::parse($interview->scheduled_at)->format('F j, Y \a\t g:i A') }}</p>
                <p><strong>Type:</strong> {{ ucfirst($interview->type) }} Interview</p>
                <p><strong>Duration:</strong> {{ $interview->duration_minutes }} minutes</p>
                
                @if($interview->location)
                    <p><strong>Location:</strong> {{ $interview->location }}</p>
                @endif
                
                @if($interview->meeting_link)
                    <p><strong>Meeting Link:</strong> <a href="{{ $interview->meeting_link }}">{{ $interview->meeting_link }}</a></p>
                @endif
                
                @if($interview->candidate_notes)
                    <p><strong>Notes:</strong> {{ $interview->candidate_notes }}</p>
                @endif
            </div>

            <div class="prep-tips">
                <h4>💡 Interview Preparation Tips:</h4>
                <ul>
                    <li>Review the job description and company information</li>
                    <li>Prepare questions about the role and company culture</li>
                    <li>Test your tech setup if it's a video interview</li>
                    <li>Arrive 5-10 minutes early</li>
                    <li>Bring copies of your resume and any relevant documents</li>
                </ul>
            </div>

            <div style="text-align: center;">
                <a href="{{ config('app.frontend_url') }}/user/jobs/applicationStatus" class="cta-button">
                    View Application Details
                </a>
                @if($interview->meeting_link)
                    <a href="{{ $interview->meeting_link }}" class="cta-button calendar-button">
                        Join Meeting
                    </a>
                @endif
            </div>

            <p>We're looking forward to speaking with you! If you need to reschedule or have any questions, please contact us through your application portal.</p>
        </div>

        <div class="footer">
            <p>This is an automated message from JobPortal.</p>
            <p>Please add this event to your calendar to avoid missing the interview.</p>
        </div>
    </div>
</body>
</html>
