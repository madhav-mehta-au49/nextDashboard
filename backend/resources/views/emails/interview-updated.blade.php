<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Interview {{ ucfirst($changeType) }}</title>
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
        .cancelled-details {
            background: #fef2f2;
            border: 1px solid #ef4444;
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
        .update-icon {
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
        .cancelled-icon {
            background: #fef2f2;
            color: #ef4444;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">JobPortal</div>
            <div class="update-icon {{ $changeType === 'cancelled' ? 'cancelled-icon' : '' }}">
                @if($changeType === 'cancelled')
                    ❌
                @elseif($changeType === 'rescheduled')
                    🔄
                @else
                    📝
                @endif
            </div>
            <h1>Interview {{ ucfirst($changeType) }}</h1>
        </div>

        <div class="content">
            <p>Hello {{ $interview->jobApplication->candidate->name ?? $interview->jobApplication->first_name }},</p>
            
            @if($changeType === 'cancelled')
                <p>We need to inform you that your scheduled interview has been cancelled:</p>
            @elseif($changeType === 'rescheduled')
                <p>Your interview has been rescheduled. Please note the new details below:</p>
            @else
                <p>There has been an update to your scheduled interview. Please review the details below:</p>
            @endif
            
            <div class="job-details">
                <h3>{{ $jobTitle }}</h3>
                <p><strong>Company:</strong> {{ $companyName }}</p>
                <p><strong>Application ID:</strong> #{{ $interview->jobApplication->id }}</p>
            </div>

            @if($changeType === 'cancelled')
                <div class="cancelled-details">
                    <h3>❌ Cancelled Interview</h3>
                    <p><strong>Original Date & Time:</strong> {{ \Carbon\Carbon::parse($interview->scheduled_at)->format('F j, Y \a\t g:i A') }}</p>
                    <p><strong>Type:</strong> {{ ucfirst($interview->type) }} Interview</p>
                    
                    @if($interview->internal_notes)
                        <p><strong>Reason:</strong> {{ $interview->internal_notes }}</p>
                    @endif
                </div>
                
                <p>We apologize for any inconvenience this may cause. Our hiring team will be in touch soon regarding next steps for your application.</p>
            @else
                <div class="interview-details">
                    <h3>📋 {{ $changeType === 'rescheduled' ? 'New ' : '' }}Interview Details</h3>
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

                <p>Please make sure to update your calendar with the new details. We're looking forward to speaking with you!</p>
            @endif

            <div style="text-align: center;">
                <a href="{{ config('app.frontend_url') }}/user/jobs/applicationStatus" class="cta-button">
                    View Application Details
                </a>
                @if($changeType !== 'cancelled' && $interview->meeting_link)
                    <a href="{{ $interview->meeting_link }}" class="cta-button" style="background: #0ea5e9;">
                        Join Meeting
                    </a>
                @endif
            </div>
        </div>

        <div class="footer">
            <p>This is an automated message from JobPortal.</p>
            <p>If you have any questions, please contact us through your application portal.</p>
        </div>
    </div>
</body>
</html>
