<!DOCTYPE html>
<html>
<head>
    <title>Test Bulk Status Update</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>
<body>
    <h1>Test Bulk Status Update</h1>
    <div id="results"></div>
    
    <script>
        // Set CSRF token for all AJAX requests
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        async function testBulkUpdate() {
            const results = $('#results');
            results.html('<p>Starting test...</p>');

            try {
                // First login as employer
                results.append('<p>1. Logging in as employer...</p>');
                const loginResponse = await $.post('/api/login', {
                    email: 'mehta2002@gmail.com',
                    password: '12345678'
                });

                if (!loginResponse.data || !loginResponse.data.token) {
                    results.append('<p style="color: red;">Login failed!</p>');
                    return;
                }

                results.append('<p style="color: green;">Login successful!</p>');
                const token = loginResponse.data.token;

                // Set authorization header
                $.ajaxSetup({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                        'Authorization': 'Bearer ' + token
                    }
                });

                // Test bulk status update
                results.append('<p>2. Testing bulk status update...</p>');
                const bulkResponse = await $.post('/api/job-applications/bulk-status', {
                    application_ids: [1, 6],
                    status: 'reviewing',
                    notes: 'Status updated to Reviewing by employer via bulk action - Web test'
                });

                results.append('<p style="color: green;">Bulk update response:</p>');
                results.append('<pre>' + JSON.stringify(bulkResponse, null, 2) + '</pre>');

                // Check individual applications
                results.append('<p>3. Checking updated applications...</p>');
                for (const appId of [1, 6]) {
                    try {
                        const appResponse = await $.get(`/api/job-applications/${appId}`);
                        results.append(`<p>Application ${appId}:</p>`);
                        results.append('<pre>' + JSON.stringify(appResponse.data, null, 2) + '</pre>');
                    } catch (error) {
                        results.append(`<p style="color: red;">Error fetching application ${appId}: ${error.responseText}</p>`);
                    }
                }

            } catch (error) {
                results.append('<p style="color: red;">Error: ' + (error.responseText || error.message) + '</p>');
                console.error('Test error:', error);
            }
        }

        // Run test when page loads
        $(document).ready(function() {
            testBulkUpdate();
        });
    </script>
</body>
</html>
