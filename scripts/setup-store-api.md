# Chrome Web Store API Setup Guide

This guide will help you set up the necessary credentials to publish your Chrome extension to the Chrome Web Store via GitHub Actions.

## Prerequisites

1. A Google Developer account
2. Your extension already uploaded to Chrome Web Store Developer Dashboard (for getting the Extension ID)
3. GitHub repository with admin access

## Step 1: Enable Chrome Web Store API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Chrome Web Store API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Chrome Web Store API"
   - Click on it and press "Enable"

## Step 2: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - Choose "External" user type
   - Fill in required fields (App name, User support email, Developer contact)
   - Add your email to test users
4. For Application type, select "Desktop application"
5. Give it a name like "Chrome Extension Publisher"
6. Click "Create"
7. **Save the Client ID and Client Secret** - you'll need these for GitHub secrets

## Step 3: Get Refresh Token

1. Create a temporary script to get the refresh token:

```bash
# Replace with your actual client ID
CLIENT_ID="your-client-id-here"

# Open this URL in your browser (replace CLIENT_ID)
echo "Open this URL in your browser:"
echo "https://accounts.google.com/oauth/authorize?response_type=code&scope=https://www.googleapis.com/auth/chromewebstore&client_id=$CLIENT_ID&redirect_uri=urn:ietf:wg:oauth:2.0:oob"
```

2. After authorizing, you'll get an authorization code
3. Exchange it for a refresh token:

```bash
curl -X POST \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "code=YOUR_AUTHORIZATION_CODE" \
  -d "grant_type=authorization_code" \
  -d "redirect_uri=urn:ietf:wg:oauth:2.0:oob" \
  https://accounts.google.com/oauth/token
```

4. **Save the refresh_token** from the response

## Step 4: Get Extension ID

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Upload your extension (if not already done)
3. Find your extension and copy the **Extension ID** from the URL or extension details

## Step 5: Set GitHub Secrets

In your GitHub repository, go to Settings > Secrets and variables > Actions, and add these secrets:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `CHROME_EXTENSION_ID` | Your extension ID from Chrome Web Store | `abcdefghijklmnopqrstuvwxyz123456` |
| `CHROME_CLIENT_ID` | OAuth Client ID from Google Cloud Console | `123456789-abc.apps.googleusercontent.com` |
| `CHROME_CLIENT_SECRET` | OAuth Client Secret from Google Cloud Console | `ABC-123_def456ghi` |
| `CHROME_REFRESH_TOKEN` | Refresh token obtained in Step 3 | `1//04abc123def...` |

## Step 6: Test the Setup

1. Make sure your extension builds successfully: `npm run build`
2. Create a test release in GitHub or use the manual workflow dispatch
3. Check the GitHub Actions tab for any errors

## Important Notes

- Keep your credentials secure and never commit them to your repository
- The refresh token doesn't expire unless revoked
- You can revoke access anytime in your Google Account settings
- The first publication might require manual review by Google (can take several days)

## Troubleshooting

### Common Issues:

1. **"Extension not found"** - Check your Extension ID
2. **"Invalid credentials"** - Verify Client ID and Secret
3. **"Token expired"** - Get a new refresh token
4. **"Insufficient permissions"** - Ensure the Chrome Web Store API is enabled

### Testing Locally:

You can test the upload process locally using the Chrome Web Store API directly:

```bash
# Get access token
ACCESS_TOKEN=$(curl -X POST \
  -d "client_id=$CHROME_CLIENT_ID" \
  -d "client_secret=$CHROME_CLIENT_SECRET" \
  -d "refresh_token=$CHROME_REFRESH_TOKEN" \
  -d "grant_type=refresh_token" \
  https://accounts.google.com/oauth/token | jq -r .access_token)

# Upload extension
curl -X PUT \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "x-goog-api-version: 2" \
  -T extension.zip \
  "https://www.googleapis.com/upload/chromewebstore/v1.1/items/$CHROME_EXTENSION_ID"
```

## Security Best Practices

1. Use a dedicated Google account for extension publishing
2. Regularly rotate your credentials
3. Monitor your GitHub Actions logs for any credential leaks
4. Set up branch protection rules to prevent unauthorized changes to the workflow

## Resources

- [Chrome Web Store API Documentation](https://developer.chrome.com/docs/webstore/api/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Google Cloud Console](https://console.cloud.google.com/)