# API Setup Instructions

## 🤖 Google Gemini API Setup

### Step 1: Get Your Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key (it starts with `AIza...`)

### Step 2: Add Gemini API Key to Supabase
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **Edge Functions**
4. Add a new environment variable:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Your Gemini API key from Step 1

---

## 🔧 Trello API Setup

### Step 1: Get Your Trello API Credentials
1. Go to [Trello Developer API Keys](https://trello.com/app-key)
2. Sign in to your Trello account
3. You'll see your **API Key** immediately
4. Click "Token" link next to "You can manually generate a Token"
5. Click "Allow" to generate your **API Token**

### Step 2: Using Trello Credentials in the App
- When you click "🚀 Export to Trello" in the app, you'll be prompted to enter:
  - **Trello API Key**: The key from Step 1.3
  - **Trello API Token**: The token from Step 1.5
- These credentials are only used for that specific export and are not stored

---

## 🚀 Quick Setup Checklist

### For Supabase Edge Functions:
- [ ] Gemini API Key added to Supabase environment variables
- [ ] Edge functions deployed and working

### For Trello Integration:
- [ ] Trello API Key obtained from trello.com/app-key
- [ ] Trello API Token generated
- [ ] Ready to paste into the export modal when needed

---

## 🔒 Security Notes

- **Gemini API Key**: Stored securely in Supabase environment variables
- **Trello Credentials**: Only used client-side for the specific export, never stored
- All API calls are made through secure Supabase Edge Functions
- CORS is properly configured for security

---

## 🆘 Troubleshooting

### Gemini API Issues:
- Ensure your API key is valid and has quota remaining
- Check that the key is properly set in Supabase environment variables
- Verify your Google Cloud project has the Generative AI API enabled

### Trello API Issues:
- Make sure both API Key and Token are correctly copied
- Verify your Trello account has permission to create boards
- Check that you're using the correct credentials format

### General Issues:
- Check browser console for detailed error messages
- Verify all environment variables are set in Supabase
- Ensure Edge Functions are deployed and accessible