<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Application Received</title>
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
        .success-icon {
            background: #d1fae5;
            color: #059669;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            font-size: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">JobPortal</div>
            <div class="success-icon">✓</div>
            <h1>Application Received!</h1>
        </div>

        <div class="content">
            <p>Hello {{ $application->candidate->name ?? $application->first_name }},</p>
            
            <p>Thank you for your application! We've successfully received your application for:</p>
            
            <div class="job-details">
                <h3>{{ $jobTitle }}</h3>
                <p><strong>Company:</strong> {{ $companyName }}</p>
                <p><strong>Applied:</strong> {{ $application->applied_at->format('F j, Y \a\t g:i A') }}</p>
                <p><strong>Application ID:</strong> #{{ $application->id }}</p>
            </div>

            <h3>What's Next?</h3>
            <ul>
                <li>🔍 Our hiring team will review your application</li>
                <li>📧 We'll notify you of any status updates via email</li>
                <li>📱 You can track your application progress in your dashboard</li>
                <li>⏰ Initial review typically takes 3-5 business days</li>
            </ul>

            <p>We appreciate your interest in joining {{ $companyName }} and will be in touch soon!</p>

            <div style="text-align: center;">
                <a href="{{ config('app.frontend_url') }}/user/jobs/applicationStatus" class="cta-button">
                    Track Application Status
                </a>
            </div>
        </div>

        <div class="footer">
            <p>This is an automated confirmation from JobPortal.</p>
            <p>If you have any questions, please contact us through your application portal.</p>
        </div>
    </div>
</body>
</html>
