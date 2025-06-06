<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Application Status Update</title>
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
        .status-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            text-transform: capitalize;
        }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-reviewing { background: #dbeafe; color: #1e40af; }
        .status-interviewed { background: #fde68a; color: #92400e; }
        .status-offered { background: #d1fae5; color: #065f46; }
        .status-hired { background: #d1fae5; color: #065f46; }
        .status-rejected { background: #fee2e2; color: #dc2626; }
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
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">JobPortal</div>
            <h1>Application Status Update</h1>
        </div>

        <div class="content">
            <p>Hello {{ $application->candidate->name ?? $application->first_name }},</p>
            
            <p>We have an update regarding your application for the position:</p>
            
            <div class="job-details">
                <h3>{{ $jobTitle }}</h3>
                <p><strong>Company:</strong> {{ $companyName }}</p>
                <p><strong>Applied:</strong> {{ $application->applied_at->format('F j, Y') }}</p>
                <p>
                    <strong>Status:</strong> 
                    <span class="status-badge status-{{ $newStatus }}">{{ ucfirst($newStatus) }}</span>
                </p>
            </div>

            @if($newStatus === 'offered')
                <p>🎉 <strong>Congratulations!</strong> We're pleased to extend an offer for this position. Please check your application portal for more details and next steps.</p>
            @elseif($newStatus === 'hired')
                <p>🎉 <strong>Welcome to the team!</strong> We're excited to have you join {{ $companyName }}. You'll receive onboarding information soon.</p>
            @elseif($newStatus === 'interviewed')
                <p>✅ Your interview has been completed. We'll review your performance and get back to you soon with next steps.</p>
            @elseif($newStatus === 'reviewing')
                <p>👀 Your application is now under review by our hiring team. We'll keep you updated on the progress.</p>
            @elseif($newStatus === 'rejected')
                <p>Thank you for your interest in {{ $companyName }}. While we've decided to move forward with other candidates for this position, we encourage you to apply for future opportunities that match your skills.</p>
            @else
                <p>Your application status has been updated. Please check your application portal for more details.</p>
            @endif

            <div style="text-align: center;">
                <a href="{{ config('app.frontend_url') }}/user/jobs/applicationStatus" class="cta-button">
                    View Application Details
                </a>
            </div>
        </div>

        <div class="footer">
            <p>This is an automated message from JobPortal. Please do not reply to this email.</p>
            <p>If you have any questions, please contact us through your application portal.</p>
        </div>
    </div>
</body>
</html>
