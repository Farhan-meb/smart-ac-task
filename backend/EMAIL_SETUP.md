# Email Reminder Setup Guide (Brevo)

This guide explains how to set up the email reminder functionality for the Smart Academic Task Planner using Brevo (formerly Sendinblue).

## Features

-   **Daily Task Reminders**: Automatically sends email reminders at 10:00 AM daily for tasks due on the current day
-   **Beautiful Email Templates**: Professional HTML email templates with task details, priorities, and categories
-   **Brevo Integration**: Uses Brevo API for reliable email delivery
-   **Cron Job Integration**: Uses node-cron to schedule daily reminders
-   **Database Tracking**: Records all sent reminders in the database

## Setup Instructions

### 1. Brevo Account Setup

Since we're using Brevo as the email service, you need to create a Brevo account:

1. Go to Brevo: https://app.brevo.com/
2. Sign up for a free account (300 emails/day free)
3. Verify your email address
4. Go to Settings → API Keys
5. Create a new API key or copy an existing one

### 2. Environment Configuration

Add the following to your `.env` file:

```env
# Email Configuration (Brevo)
BREVO_API_KEY=your-brevo-api-key
```

**Important**: Use the API key from your Brevo account settings.

### 3. Test Email Functionality

Run the test script to verify email setup:

```bash
node test-brevo-email.js
```

This will send a test email to verify the configuration is working correctly.

### 4. Manual Testing

You can manually trigger daily reminders using the API endpoint:

```bash
POST /api/reminders/trigger-daily
```

**Note**: Only admin users can trigger this endpoint.

## How It Works

### Daily Cron Job

-   **Schedule**: Runs every day at 10:00 AM (Asia/Dhaka timezone)
-   **Function**: Fetches all users with tasks due today
-   **Email**: Sends personalized reminder emails to each user
-   **Database**: Records all sent reminders

### Email Content

Each email includes:

-   User's name and greeting
-   List of tasks due today with:
    -   Task title and description
    -   Priority badges (HIGH, MEDIUM, LOW, URGENT)
    -   Status badges (PENDING, IN_PROGRESS, COMPLETED)
    -   Category and course information
    -   Estimated hours
-   Productivity tips
-   Professional styling

### Task Filtering

The system only sends reminders for:

-   Tasks with due dates matching today
-   Tasks with status PENDING or IN_PROGRESS
-   Users who are active (isActive: true)

## Troubleshooting

### Common Issues

1. **Authentication Error**

    - Ensure you're using a valid Brevo API key
    - Verify your Brevo account is active and verified

2. **Email Not Sending**

    - Check the server logs for error messages
    - Verify the BREVO_API_KEY environment variable is set correctly
    - Test with the test script first
    - Check your Brevo account email sending limits

3. **Cron Job Not Running**
    - Check server logs for cron job initialization messages
    - Verify the timezone setting in cronService.js
    - Ensure the server is running continuously

### Logs

Monitor the application logs for:

-   `✅ Cron jobs initialized successfully`
-   `🕙 Daily task reminder cron job triggered at 10:00 AM`
-   Email sending success/failure messages

## Customization

### Timezone

To change the timezone, modify the timezone setting in `src/utils/cronService.js`:

```javascript
timezone: "Asia/Dhaka"; // Change to your preferred timezone
```

### Email Template

To customize the email template, edit the `generateTaskReminderEmail` function in `src/utils/emailService.js`.

### Schedule

To change the reminder time, modify the cron expression in `src/utils/cronService.js`:

```javascript
cron.schedule('0 10 * * *', ...) // Current: 10:00 AM daily
```

Common cron patterns:

-   `0 9 * * *` - 9:00 AM daily
-   `0 10 * * 1-5` - 10:00 AM weekdays only
-   `0 8,18 * * *` - 8:00 AM and 6:00 PM daily

## Security Notes

-   Brevo API keys are secure and can be regenerated if needed
-   The email service only sends to verified user emails
-   All email activities are logged for monitoring
-   Admin-only access for manual triggering
-   Brevo provides excellent deliverability and spam protection
