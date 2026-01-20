// Copy this file to environment.ts and fill in your own Firebase configuration
// Instructions:
// 1. Copy this file: cp environment.template.ts environment.ts
// 2. Replace the placeholder values with your actual Firebase project credentials
// 3. Never commit environment.ts to version control

export const environment = {
  production: false,
  firebase: {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  }
};
