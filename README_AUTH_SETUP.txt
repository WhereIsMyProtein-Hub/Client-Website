Where Is My Protein - Firebase Authentication update

FILES: Upload index.html, style.css, script.js, and firebase-auth.js to the ROOT of feature/firebase-authentication. Keep assets/logo.png unchanged.

SETUP: Firebase Console > Authentication > Sign-in method: Email/Password enabled. Authentication > Settings > Authorized domains: whereismyprotein-hub.github.io.

TEST: Before merging, use a local server such as VS Code Live Server (localhost must be authorized), or deploy to a separate test URL and authorize that domain. GitHub Pages from main will NOT run branch changes until merged.

TEST FLOW: Sign up with a test email; open the verification email; log in; refresh; log out; test password reset. Confirm users in Firebase Authentication > Users.

IMPORTANT: Only login/signup is real in this update. Orders, tracking, bills and reviews are still browser-only demos. Do not accept real paid orders until Firestore, secure order rules, and an owner dashboard are built and tested.

Firebase web config is public client configuration, not a service-account secret. Never commit service-account keys.
