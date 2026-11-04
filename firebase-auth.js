// Firebase Authentication integration for the GitHub Pages website.
// The Firebase web configuration is public; never put service-account keys here.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, updateProfile } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';

const firebaseConfig = {
  apiKey: 'AIzaSyD0AnFdr0Pg2ps67qiuJ5kxDgGIlgy1Zuw',
  authDomain: 'where-is-my-protein-d1a86.firebaseapp.com',
  projectId: 'where-is-my-protein-d1a86',
  storageBucket: 'where-is-my-protein-d1a86.firebasestorage.app',
  messagingSenderId: '681213180740',
  appId: '1:681213180740:web:4b97659576a954ad6af511'
};
const auth = getAuth(initializeApp(firebaseConfig));
const msg = document.getElementById('authMessage');
const accountButton = document.getElementById('accountButton');
const logoutButton = document.getElementById('logoutButton');
const form = document.getElementById('authForm');
function message(text, error = false) { msg.textContent = text; msg.classList.toggle('error', error); }
function friendly(error) {
  const map = {
    'auth/email-already-in-use': 'This email already has an account. Please log in.',
    'auth/invalid-email': 'Enter a valid email address.',
    'auth/weak-password': 'Choose a stronger password (at least 6 characters).',
    'auth/invalid-credential': 'Incorrect email or password.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Check your internet connection.'
  };
  return map[error.code] || 'Authentication could not be completed. Please try again.';
}
accountButton.addEventListener('click', () => {
  if (auth.currentUser && auth.currentUser.emailVerified) {
    message(`Signed in as ${auth.currentUser.email}`);
    logoutButton.hidden = false;
  } else { message('Create an account or sign in with your email address.'); }
  showModal('loginModal');
});
logoutButton.addEventListener('click', async () => {
  try { await signOut(auth); message('You have been logged out.'); hideModal('loginModal'); }
  catch (e) { message(friendly(e), true); }
});
document.getElementById('resetPassword').addEventListener('click', async () => {
  const email = document.getElementById('authContact').value.trim();
  if (!email) { message('Enter your email address first, then click Forgot password.', true); return; }
  try { await sendPasswordResetEmail(auth, email); message('If this address has an account, a password reset email will arrive shortly.'); }
  catch (e) { message(friendly(e), true); }
});
form.addEventListener('submit', async event => {
  event.preventDefault();
  const email = document.getElementById('authContact').value.trim();
  const password = document.getElementById('authPassword').value;
  const name = document.getElementById('authName').value.trim();
  const submit = document.getElementById('authSubmit');
  if (authMode === 'signup' && !name) { message('Please enter your name.', true); return; }
  submit.disabled = true; message('Please wait...');
  try {
    if (authMode === 'signup') {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      await sendEmailVerification(result.user);
      await signOut(auth);
      message('Account created! Check your inbox (and spam) for the verification email. Verify it, then log in.');
      document.getElementById('authPassword').value = '';
    } else {
      const result = await signInWithEmailAndPassword(auth, email, password);
      if (!result.user.emailVerified) {
        await sendEmailVerification(result.user);
        await signOut(auth);
        message('Please verify your email first. We sent another verification link.');
        return;
      }
      message('Login successful.');
      hideModal('loginModal');
      if (pendingMenuId !== null) { const id = pendingMenuId; pendingMenuId = null; addItem(id); }
      else if (Object.keys(cart).length) openCart();
    }
  } catch (e) { message(friendly(e), true); }
  finally { submit.disabled = false; }
});
onAuthStateChanged(auth, user => {
  const ready = Boolean(user?.emailVerified);
  isLoggedIn = ready;
  customerName = ready ? (user.displayName || user.email) : '';
  accountButton.textContent = ready ? `Account: ${customerName}` : 'Login / Sign up';
  logoutButton.hidden = !ready;
});
