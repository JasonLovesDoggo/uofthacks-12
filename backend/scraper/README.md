# Gmail Order Processor Documentation

## Environment Setup

Create a `.env` file in your project root:

```env
# Gmail API Configuration
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/oauth/callback

# Gemini API
GEMINI_API_KEY=your_gemini_api_key

# External API
API_ENDPOINT=https://api.example.com/ingest

# Redis (for credential storage)
REDIS_URL=redis://localhost:6379
```

## Gmail Account Setup

1. Create a project in Google Cloud Console
2. Enable Gmail API
3. Create OAuth 2.0 credentials
4. Add authorized redirect URIs

## Adding Gmail Accounts

1. Initiate OAuth Flow:
```http
GET /auth/gmail/start
```

2. User will be redirected to Google consent screen

3. After authorization, credentials will be stored automatically

## Managing Accounts

### List Connected Accounts
```http
GET /accounts

Response:
{
    "accounts": [
        {
            "email": "user@gmail.com",
            "status": "active",
            "last_check": "2024-01-18T10:00:00Z"
        }
    ]
}
```

### Remove Account
```http
DELETE /accounts/{email}
```

## Email Processing Flow

1. Background worker polls Gmail accounts every 60 seconds
2. New emails are processed through Gemini AI
3. Valid order emails are converted to Order models
4. Orders are sent to external API

## Gemini Prompts

The system uses two prompts:

1. Classification Prompt:
```text
Analyze this email and determine if it's an order confirmation email.
Response should be exactly "true" or "false".

Email:
{email_content}
```

2. Parsing Prompt:
```text
Parse this order confirmation email into JSON format matching this structure:
{order_schema}

Email:
{email_content}

Ensure the output is valid JSON only, no additional text.
```
