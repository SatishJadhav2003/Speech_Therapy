# Environment Configuration

This folder contains environment configuration files for the application.

## Setup Instructions for New Developers

1. **Copy the template file:**
   ```bash
   cd src/environments
   cp environment.template.ts environment.ts
   ```

2. **Get Firebase credentials:**
   - Go to your Firebase Console: https://console.firebase.google.com/
   - Select your project or create a new one
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Click on the web app or add a new web app
   - Copy the Firebase configuration object

3. **Update environment.ts:**
   - Open `environment.ts`
   - Replace the placeholder values with your actual Firebase credentials
   - Save the file

4. **Never commit environment.ts:**
   - The `environment.ts` file is already in `.gitignore`
   - This prevents accidentally committing sensitive credentials

## Files in this folder

- `environment.template.ts` - Template file with placeholder values (committed to git)
- `environment.ts` - Your actual configuration (NOT committed to git, ignored)
- `environment.prod.ts` - Production configuration (NOT committed to git, ignored)

## Production Environment

For production deployments, create `environment.prod.ts`:

```bash
cp environment.template.ts environment.prod.ts
```

Then update it with production Firebase credentials and set `production: true`.

## Security Notes

⚠️ **Important:**
- Never commit files containing actual API keys or credentials
- Keep your Firebase API keys secure
- Use Firebase Security Rules to protect your data
- Consider using environment variables in CI/CD pipelines
