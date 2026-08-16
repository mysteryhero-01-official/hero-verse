// auth/auth.js
// Minimal auth scaffold that expects Firebase v8 (namespaced) SDK to be loaded
// Usage: include firebase-config.js (which sets `firebaseConfig`) and Firebase SDK scripts in index.html

(function () {
  // Helper: create element
  function el(tag, attrs, children) {
    const e = document.createElement(tag);
    (attrs || {}).forEach?.call?.(function(){})
    if (attrs) for (const k in attrs) {
      if (k === 'class') e.className = attrs[k];
      else if (k === 'text') e.textContent = attrs[k];
      else e.setAttribute(k, attrs[k]);
    }
    (children || []).forEach(c => e.appendChild(c));
    return e;
  }

  // Initialize Firebase if firebaseConfig provided
  function initFirebase() {
    if (window.firebase && window.firebase.apps && window.firebaseConfig) {
      try {
        if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
        console.log('Firebase initialized');
      } catch (e) {
        console.error('Firebase init error', e);
      }
    } else {
      console.warn('Firebase SDK or firebaseConfig not found. Add SDK scripts and firebase-config.js');
    }
  }

  // Insert simple auth UI into #authRoot or body
  function renderAuthUI() {
    const root = document.getElementById('authRoot') || document.body;

    const container = document.createElement('div');
    container.className = 'auth-card';
    container.style.maxWidth = '420px';
    container.style.margin = '40px auto';

    container.innerHTML = `
      <div class="brand">
        <div class="brand-icon">⚡</div>
        <h1>Hero-Verse</h1>
        <p>Login / Signup</p>
      </div>
      <div class="input-group">
        <label>Email</label>
        <div class="input-wrap"><input id="email" placeholder="Email" /></div>
        <div class="live-error field-error" id="emailError"></div>
      </div>
      <div class="input-group">
        <label>Password</label>
        <div class="input-wrap"><input id="password" type="password" placeholder="Password" /></div>
        <div class="live-error field-error" id="passwordError"></div>
      </div>
      <button class="primary-btn" id="emailSignUp">Sign up (email)</button>
      <button class="secondary-btn" id="emailSignIn">Sign in (email)</button>
      <hr style="margin:16px 0;border-color:rgba(255,255,255,.04)" />
      <div id="phoneSection">
        <label>Phone (+91 only for now)</label>
        <div class="input-wrap"><input id="phone" placeholder="+91XXXXXXXXXX" /></div>
        <div id="recaptcha-container"></div>
        <div class="live-error field-error" id="phoneError"></div>
        <button class="primary-btn" id="sendOtp">Send OTP</button>
        <div class="input-group" id="otpGroup" style="display:none">
          <div class="input-wrap"><input id="otp" placeholder="Enter OTP" /></div>
          <div class="live-error field-error" id="otpError"></div>
          <button class="primary-btn" id="verifyOtp">Verify OTP</button>
        </div>
      </div>
    `;

    root.appendChild(container);

    // Wire events
    document.getElementById('emailSignUp').addEventListener('click', emailSignUp);
    document.getElementById('emailSignIn').addEventListener('click', emailSignIn);
    document.getElementById('sendOtp').addEventListener('click', sendOtp);
    document.getElementById('verifyOtp').addEventListener('click', verifyOtp);
  }

  // Validation helpers
  function setError(id, msg) { document.getElementById(id).textContent = msg || ''; }

  function validatePasswordRules(pw) {
    // min 8, at least one uppercase, at least one special char
    if (!pw || pw.length < 8) return 'Minimum 8 characters required';
    if (!/[A-Z]/.test(pw)) return 'At least one uppercase character required';
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw)) return 'At least one special character required';
    return null;
  }

  // Email signup
  async function emailSignUp() {
    setError('emailError',''); setError('passwordError','');
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    if (!email) return setError('emailError','Email required');
    const pwErr = validatePasswordRules(password);
    if (pwErr) return setError('passwordError', pwErr);
    try {
      const userCred = await firebase.auth().createUserWithEmailAndPassword(email, password);
      console.log('User created', userCred.user.uid);
      // TODO: redirect to profile setup
      alert('Signup success — check console for UID and continue to profile setup (not implemented)');
    } catch (err) {
      setError('emailError', err.message || 'Signup failed');
      console.error(err);
    }
  }

  // Email sign in
  async function emailSignIn() {
    setError('emailError',''); setError('passwordError','');
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    if (!email) return setError('emailError','Email required');
    if (!password) return setError('passwordError','Password required');
    try {
      const res = await firebase.auth().signInWithEmailAndPassword(email, password);
      console.log('Signed in', res.user.uid);
      alert('Signed in — implement redirect to dashboard');
    } catch (err) {
      setError('emailError', err.message || 'Sign in failed');
    }
  }

  // Phone OTP (restrict +91)
  function sendOtp() {
    setError('phoneError','');
    const phone = document.getElementById('phone').value.trim();
    if (!phone) return setError('phoneError','Phone required');
    if (!phone.startsWith('+91')) return setError('phoneError','Only +91 numbers allowed');

    // render recaptcha
    window.recaptchaVerifier = window.recaptchaVerifier || new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible'
    });

    const verifier = window.recaptchaVerifier;
    firebase.auth().signInWithPhoneNumber(phone, verifier)
      .then(confirmationResult => {
        window.confirmationResult = confirmationResult;
        document.getElementById('otpGroup').style.display = '';
        alert('OTP sent');
      })
      .catch(err => {
        setError('phoneError', err.message || 'OTP send failed');
        console.error('sendOtp err', err);
      });
  }

  function verifyOtp() {
    setError('otpError','');
    const code = document.getElementById('otp').value.trim();
    if (!code) return setError('otpError','OTP required');
    if (!window.confirmationResult) return setError('otpError','No confirmation result');
    window.confirmationResult.confirm(code)
      .then(res => {
        console.log('Phone auth success', res.user.uid);
        alert('Phone verified — implement redirect/profile setup');
      })
      .catch(err => {
        setError('otpError', err.message || 'OTP verify failed');
      });
  }

  // Auto init on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    initFirebase();
    renderAuthUI();
  });

})();
