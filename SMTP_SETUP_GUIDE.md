# Supabase Email Configuration Guide

## Problem
Authentication emails (sign-up confirmations, password resets) are not being sent because Supabase requires an external SMTP provider to be configured.

## Solution
Configure an external SMTP provider in your Supabase dashboard to enable reliable email delivery.

---

## Step-by-Step Setup

### Option 1: SendGrid (Recommended)

#### 1. Create SendGrid Account
1. Go to [SendGrid](https://sendgrid.com/) and sign up for a free account
2. Complete email verification
3. Navigate to **Settings → API Keys**
4. Click **Create API Key**
5. Name it "Supabase Email" and select **Restricted Access**
6. Enable only **Mail Send** permission
7. Copy the API key (you won't see it again!)

#### 2. Configure SendGrid in Supabase
1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication → Settings**  
4. Scroll down to **SMTP Settings**
5. Click **Enable Custom SMTP**
6. Enter the following settings:

```
SMTP Host: smtp.sendgrid.net
SMTP Port: 587
SMTP User: apikey
SMTP Password: [Your SendGrid API Key]
Sender Email: noreply@yourdomain.com
Sender Name: The Nirvanist
```

7. Click **Save**

#### 3. Verify Email Sender
- Go to SendGrid → **Settings → Sender Authentication**
- Complete **Single Sender Verification** for your sender email
- Check your email and click the verification link

---

### Option 2: Mailgun

#### 1. Create Mailgun Account
1. Go to [Mailgun](https://www.mailgun.com/) and sign up
2. Complete email verification
3. Navigate to **Sending → Domain Settings**
4. Copy your **SMTP credentials**

#### 2. Configure Mailgun in Supabase
1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication → Settings**
4. Scroll to **SMTP Settings**
5. Click **Enable Custom SMTP**
6. Enter the following:

```
SMTP Host: smtp.mailgun.org
SMTP Port: 587
SMTP User: [Your Mailgun SMTP username]
SMTP Password: [Your Mailgun SMTP password]
Sender Email: noreply@yourdomain.com
Sender Name: The Nirvanist
```

7. Click **Save**

---

### Option 3: Gmail (For Testing Only)

⚠️ **Not recommended for production** due to daily sending limits

#### 1. Enable Gmail SMTP
1. Go to your [Google Account](https://myaccount.google.com/)
2. Navigate to **Security → 2-Step Verification**
3. Scroll to **App passwords**
4. Generate an app password for "Mail"
5. Copy the 16-character password

#### 2. Configure Gmail in Supabase
```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP User: your-email@gmail.com
SMTP Password: [16-character app password]
Sender Email: your-email@gmail.com
Sender Name: The Nirvanist
```

---

## Testing Email Delivery

### 1. Test Sign-Up Email
1. Register a new user on your website
2. Check the inbox for the verification email
3. Verify the email link works correctly

### 2. Test Password Reset
1. Click "Forgot Password" on your login page
2. Enter your email address
3. Check inbox for password reset email
4. Verify the reset link works

### 3. Monitor Email Logs
- **SendGrid**: Dashboard → Activity → Email Activity
- **Mailgun**: Logs → Sending Logs
- **Supabase**: Authentication → Users (check user verification status)

---

## Troubleshooting

### Emails Not Sending
1. ✅ Verify SMTP credentials are correct
2. ✅ Check sender email is verified in your SMTP provider
3. ✅ Ensure SMTP port 587 is not blocked by your firewall
4. ✅ Check spam/junk folders
5. ✅ Review Supabase logs: Authentication → Logs

### "Invalid Credentials" Error
- Double-check your SMTP username and password
- For SendGrid, username must be exactly `apikey`
- For app passwords, remove any spaces

### Emails Going to Spam
1. Add SPF records to your domain DNS
2. Add DKIM records (provided by SendGrid/Mailgun)
3. Use a custom domain instead of @gmail.com
4. Avoid spam trigger words in email templates

---

## Best Practices

### Production Recommendations
1. ✅ Use SendGrid or Mailgun (not Gmail)
2. ✅ Verify your sending domain with DKIM/SPF
3. ✅ Use a professional email address (e.g., noreply@thenirvanist.com)
4. ✅ Monitor email delivery rates
5. ✅ Set up email templates in Supabase for branding

### Email Template Customization
1. In Supabase Dashboard → **Authentication → Email Templates**
2. Customize:
   - Confirmation email
   - Password reset email
   - Magic link email
   - Change email address email

3. Add your branding:
   - Logo
   - Brand colors
   - Custom messaging
   - Footer with contact info

---

## Environment Variables

Make sure these are set in your **Netlify** deployment:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## Support

- **SendGrid Support**: https://support.sendgrid.com/
- **Mailgun Support**: https://help.mailgun.com/
- **Supabase Docs**: https://supabase.com/docs/guides/auth/auth-smtp

---

## Summary

1. Choose an SMTP provider (SendGrid recommended)
2. Get SMTP credentials from provider
3. Configure in Supabase → Authentication → Settings → SMTP
4. Verify sender email address
5. Test with sign-up and password reset
6. Monitor delivery in provider dashboard

✅ Once configured, all authentication emails will be delivered reliably to your users!
