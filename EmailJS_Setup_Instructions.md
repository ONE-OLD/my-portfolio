# EmailJS Setup Instructions

This portfolio website includes contact form functionality using EmailJS to send emails directly to kwizerarsn@gmail.com. Follow these steps to set up EmailJS:

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account (allows up to 200 emails per month)
3. Verify your email address

## Step 2: Add Email Service

1. In your EmailJS dashboard, click "Add New Service"
2. Choose your email provider (Gmail is recommended):
   - For Gmail: Click "Gmail" and follow OAuth authentication
   - For other providers: Follow their specific setup instructions
3. Give your service a name (e.g., "Portfolio Contact Form")
4. Note down your **Service ID** (starts with "service_")

## Step 3: Create Email Template

1. Click "Create New Template" in your EmailJS dashboard
2. Set up your template with the following structure:

```
Subject: New Contact Form Message - {{subject}}

From: {{from_name}} ({{from_email}})
Subject: {{subject}}

Message:
{{message}}

---
This message was sent from your portfolio contact form.
```

3. Use these variable names in your template:
   - `{{from_name}}` - Sender's name
   - `{{from_email}}` - Sender's email
   - `{{subject}}` - Message subject
   - `{{message}}` - Message content
   - `{{to_name}}` - Your name (Kwizera Arsene)
   - `{{to_email}}` - Your email (kwizerarsn@gmail.com)

4. Set the "To Email" field to: `kwizerarsn@gmail.com`
5. Save the template and note down your **Template ID** (starts with "template_")

## Step 4: Get Public Key

1. Go to "Account" section in EmailJS dashboard
2. Find your **Public Key** (also called User ID)
3. Copy this key for use in the code

## Step 5: Update the Code

Open `/components/GetInTouch.tsx` and replace the placeholder values:

```javascript
const serviceId = 'service_xxxxxxx'; // Replace with your Service ID
const templateId = 'template_xxxxxxx'; // Replace with your Template ID  
const publicKey = 'your_public_key_here'; // Replace with your Public Key
```

## Step 6: Test the Form

1. Save the changes and refresh your portfolio
2. Fill out the contact form and submit it
3. Check your email (kwizerarsn@gmail.com) for the message
4. Check EmailJS dashboard for delivery status

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure your website domain is added to EmailJS allowed origins
2. **Template Variables**: Ensure variable names match exactly between template and code
3. **Blocked by Gmail**: Check spam folder or Gmail security settings
4. **Rate Limiting**: Free accounts have a 200 email/month limit

### Testing in Development:

- The form currently runs in "demo mode" showing success messages without sending emails
- Once you configure EmailJS properly, real emails will be sent
- Test thoroughly before deploying to production

## Security Notes

- Never commit your actual EmailJS credentials to public repositories
- Consider using environment variables for production deployments
- Monitor your EmailJS usage to avoid hitting rate limits
- Set up proper email filtering rules to manage incoming messages

## Additional Features

The contact form includes:
- Form validation
- Loading states during submission
- Success/error toast notifications
- Responsive design
- Accessibility features

For more advanced features, consider upgrading to EmailJS Pro or implementing server-side email handling.
