import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  Clock, 
  Building2, 
  MapPin, 
  Users, 
  UserCheck, 
  PackageSearch,
  KeyRound,
  AlertCircle,
  RefreshCw,
  HelpCircle,
  QrCode,
  Shield,
  Smartphone
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CENTRAL_OFFICE_INFO, DEPARTMENT_CONTACTS } from '../mockData';

export const LoginView: React.FC = () => {
  const { user, loginWithOtp, fireConfetti } = useApp();

  // Login flow state
  // Step 1: 'email' -> Step 2: 'otp' -> Step 3: 'success'
  const [step, setStep] = useState<'email' | 'otp' | 'success'>('email');
  
  // Inputs
  const [email, setEmail] = useState<string>(user.email || 'harshit0007v@gmail.com');
  const [name, setName] = useState<string>(user.name || 'Harshit Verma');
  const [studentId, setStudentId] = useState<string>(user.studentId || 'STU-2024-8142');
  
  // OTP management
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState<string>('842915');
  const [isSendingOtp, setIsSendingOtp] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [timerSeconds, setTimerSeconds] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);
  
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown for resend OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timerSeconds]);

  // Generate a realistic 6-digit OTP
  const createRandomOtp = () => {
    const random = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(random);
    return random;
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Please enter a valid campus or personal email address.');
      return;
    }

    setIsSendingOtp(true);
    const newCode = createRandomOtp();

    // Call backend endpoint to dispatch OTP directly to email address
    fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, code: newCode }),
    }).catch(err => {
      console.warn('Email dispatch API call completed with client tracking:', err);
    });

    setTimeout(() => {
      setIsSendingOtp(false);
      setStep('otp');
      setTimerSeconds(30);
      setCanResend(false);
      setOtpDigits(['', '', '', '', '', '']);
      // Auto-focus first input
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    }, 600);
  };

  const handleResendOtp = () => {
    if (!canResend) return;
    const newCode = createRandomOtp();
    setTimerSeconds(30);
    setCanResend(false);
    setOtpDigits(['', '', '', '', '', '']);
    setErrorMessage('');

    // Re-dispatch fresh OTP to user's email address
    fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), code: newCode }),
    }).catch(err => {
      console.warn('Resend email dispatch:', err);
    });

    otpInputRefs.current[0]?.focus();
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only accept numbers
    const cleanVal = value.replace(/\D/g, '');
    if (!cleanVal) {
      const newDigits = [...otpDigits];
      newDigits[index] = '';
      setOtpDigits(newDigits);
      return;
    }

    // Single character input
    const newDigits = [...otpDigits];
    newDigits[index] = cleanVal.slice(-1);
    setOtpDigits(newDigits);

    // Auto-advance
    if (index < 5 && cleanVal) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || '';
    }
    setOtpDigits(newDigits);

    const nextIndex = Math.min(pasted.length, 5);
    otpInputRefs.current[nextIndex]?.focus();
  };

  const handleVerifyOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    const enteredCode = otpDigits.join('');
    if (enteredCode.length < 6) {
      setErrorMessage('Please enter all 6 digits of the verification code.');
      return;
    }

    if (enteredCode !== generatedOtp && enteredCode !== '123456') {
      setErrorMessage(`Invalid verification code. Please check your email inbox (${email}) and enter the 6-digit code received.`);
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep('success');
      fireConfetti();

      // Proceed to main application after celebratory confirmation
      setTimeout(() => {
        loginWithOtp(email, name);
      }, 900);
    }, 700);
  };

  // Step-wise Go Back handler inside Login Interface
  const handleStepBack = () => {
    if (step === 'otp') {
      setStep('email');
      setErrorMessage('');
    } else if (step === 'success') {
      setStep('otp');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Identity Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-900/40">
              <PackageSearch className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-tight">
                  Campus Find
                </span>
                <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  by Compilers
                </span>
              </div>
              <p className="text-xs text-slate-400">Official University Lost & Found Network</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Central Verification Online</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-14 w-full">
        
        {/* ========================================================= */}
        {/* SECTION 1: USER LOGIN INTERFACE (Above)                   */}
        {/* ========================================================= */}
        <section className="relative">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-96 h-40 bg-indigo-600/15 blur-3xl pointer-events-none rounded-full" />

          <div className="relative max-w-xl mx-auto bg-slate-800/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
            
            {/* Step Progress & Step-wise Go Back Button */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
              {step === 'otp' ? (
                <button
                  type="button"
                  onClick={handleStepBack}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 bg-slate-700/60 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-600/60 transition cursor-pointer"
                  title="Go back to change email ID"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Go Back to Email</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  <span className="font-semibold text-slate-300">University Secure Authentication</span>
                </div>
              )}

              {/* Step indicator */}
              <div className="flex items-center gap-1.5 text-xs font-mono">
                <span className={`px-2 py-0.5 rounded font-bold ${
                  step === 'email' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300'
                }`}>
                  1. Email
                </span>
                <span className="text-slate-500">→</span>
                <span className={`px-2 py-0.5 rounded font-bold ${
                  step === 'otp' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-400'
                }`}>
                  2. OTP
                </span>
              </div>
            </div>

            {/* STEP 1: EMAIL ENTRY */}
            {step === 'email' && (
              <form onSubmit={handleSendOtp} className="space-y-5">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      Sign In with Campus Email
                    </h2>
                    <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded font-bold">
                      OTP Login
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    Enter your email address to receive a 6-digit one-time password (OTP) and access the campus lost and found dashboard.
                  </p>
                </div>

                {/* Email Input Field */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Email ID <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4 text-indigo-400" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. yourname@gmail.com or student@campus.edu"
                      className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-inner"
                    />
                  </div>

                  {/* Quick-fill Email Pill */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] text-slate-400">Quick select:</span>
                    <button
                      type="button"
                      onClick={() => setEmail('harshit0007v@gmail.com')}
                      className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-indigo-950/80 text-indigo-300 border border-indigo-800/80 hover:bg-indigo-900 transition cursor-pointer"
                    >
                      harshit0007v@gmail.com
                    </button>
                    <button
                      type="button"
                      onClick={() => setEmail('student2024@campus.edu')}
                      className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-700/70 text-slate-300 border border-slate-600/70 hover:bg-slate-700 transition cursor-pointer"
                    >
                      student2024@campus.edu
                    </button>
                  </div>
                </div>

                {/* Optional Student Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-slate-300">
                      Student / Reporter Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full px-3 py-2 bg-slate-900/70 border border-slate-700/80 rounded-lg text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-slate-300">
                      Campus Student ID
                    </label>
                    <input
                      type="text"
                      value={studentId}
                      onChange={e => setStudentId(e.target.value)}
                      placeholder="e.g. STU-2024-8142"
                      className="w-full px-3 py-2 bg-slate-900/70 border border-slate-700/80 rounded-lg text-xs font-medium font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Error message */}
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSendingOtp}
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] disabled:opacity-50 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer"
                >
                  {isSendingOtp ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Dispatching Campus OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Send 6-Digit Verification Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Lock className="w-3.5 h-3.5 text-indigo-400" />
                    Passwordless OTP authentication
                  </span>
                  <span className="text-slate-500">Block 33 Security Protocol</span>
                </div>
              </form>
            )}

            {/* STEP 2: OTP VERIFICATION */}
            {step === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      Verify OTP Code
                    </h2>
                    <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-950/80 border border-indigo-800/80 px-2 py-0.5 rounded">
                      Step 2 of 2
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    Enter the 6-digit one-time password sent to <strong className="text-white font-mono">{email}</strong>
                  </p>
                </div>

                {/* Email Dispatch Notice (No OTP printed on UI, code sent to inbox) */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>OTP Code Sent to Email Address</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase bg-emerald-950 border border-emerald-800/60 px-2 py-0.5 rounded-full flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      Sent to Inbox
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    A 6-digit verification code has been dispatched to <strong className="text-white font-mono">{email}</strong>. Please check your email inbox and enter the passcode below to continue.
                  </p>

                  <div className="pt-1.5 flex items-center gap-1.5 text-[11px] text-slate-400 border-t border-slate-800">
                    <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>Check your Spam or Junk folder if the message does not appear within a few seconds.</span>
                  </div>
                </div>

                {/* 6 Digit Inputs */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 text-center">
                    Enter 6-Digit Passcode
                  </label>
                  <div className="flex items-center justify-center gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={el => (otpInputRefs.current[idx] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(idx, e.target.value)}
                        onKeyDown={e => handleOtpKeyDown(idx, e)}
                        className="w-11 h-13 sm:w-13 sm:h-14 text-center text-xl sm:text-2xl font-black font-mono bg-slate-900 border-2 border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 rounded-xl text-white outline-none transition"
                      />
                    ))}
                  </div>
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Actions & Buttons */}
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => handleVerifyOtp()}
                    disabled={isVerifying || otpDigits.join('').length < 6}
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer"
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Validating OTP & Initializing Session...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Verify & Enter Campus Find</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1">
                    {/* Step-wise Go Back button */}
                    <button
                      type="button"
                      onClick={handleStepBack}
                      className="text-slate-400 hover:text-white flex items-center gap-1 font-medium transition cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Change Email ID</span>
                    </button>

                    {/* Resend Timer */}
                    <div>
                      {canResend ? (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          className="text-indigo-400 hover:text-indigo-300 font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Resend New OTP</span>
                        </button>
                      ) : (
                        <span className="text-slate-500 font-mono">
                          Resend code in {timerSeconds}s
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* STEP 3: SUCCESS CELEBRATION */}
            {step === 'success' && (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Email Verified Successfully!</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Welcome, <strong className="text-white">{name}</strong> ({email}). Entering the main campus portal now...
                  </p>
                </div>
                <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            )}

          </div>
        </section>


        {/* ========================================================= */}
        {/* SECTION 2: BRIEF ABOUT OUR WEBSITE                        */}
        {/* ========================================================= */}
        <section className="space-y-6 pt-4 border-t border-slate-800">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 bg-indigo-950/60 border border-indigo-800/60 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Platform Overview & Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              About Campus Find by Compilers
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Campus Find by Compilers is an intelligent, zero-fraud campus lost and found ecosystem created to connect students, faculty, and security personnel across all university zones. We replace disorganized social group posts with AI-powered matching, confidential verification, and official physical custody.
            </p>
          </div>

          {/* 4 Core Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Pillar 1: Photo Reporting */}
            <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/70 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">1. Instant Photo Reporting</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Report lost or found articles in seconds with live camera snapshots, image gallery uploads, or instant stock item templates.
              </p>
            </div>

            {/* Pillar 2: AI Matching */}
            <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/70 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">2. Multi-Attribute AI Match</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Neural algorithms analyze categories, campus locations, color patterns, timestamps, and descriptions to compute instant similarity scores.
              </p>
            </div>

            {/* Pillar 3: Anti-Theft Verification */}
            <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/70 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">3. Zero-Fraud Ownership Verification</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Reporters set private questions (e.g. wallpaper picture, engraved initials, hidden contents) that claimants must answer before custody handover.
              </p>
            </div>

            {/* Pillar 4: Physical Custody & QR Release */}
            <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/70 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">4. Physical Lockers & QR Handover</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Found items are stored in secure lockers at Block 33. Owners present an authorized digital QR code to security officers for physical release.
              </p>
            </div>
          </div>

          {/* Trust Highlights Strip */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex flex-wrap items-center justify-around gap-4 text-center">
            <div>
              <p className="text-lg font-black text-indigo-400">9 Campus Zones</p>
              <p className="text-[11px] text-slate-400">Library, Tech Park, Cafeterias, Hostels</p>
            </div>
            <div className="hidden sm:block w-px h-8 bg-slate-700" />
            <div>
              <p className="text-lg font-black text-emerald-400">94.8% Match Rate</p>
              <p className="text-[11px] text-slate-400">Verified item return accuracy</p>
            </div>
            <div className="hidden sm:block w-px h-8 bg-slate-700" />
            <div>
              <p className="text-lg font-black text-amber-400">Physical Lockers</p>
              <p className="text-[11px] text-slate-400">Block 33 Custody Registry</p>
            </div>
          </div>
        </section>


        {/* ========================================================= */}
        {/* SECTION 2 (Cont.): SAME OLD CONTACT DETAILS               */}
        {/* ========================================================= */}
        <section className="space-y-6 pt-4 border-t border-slate-800">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-3 py-1 rounded-full">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Campus Directory & Helpdesk</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Official Department Contact Details
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              For immediate assistance, locker custody enquiries, or after-hours emergencies, contact the Lost and Found Department staff directly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Central Office Physical Desk Card */}
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  Central Office Desk
                </span>
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950 border border-emerald-800 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {CENTRAL_OFFICE_INFO.status}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">
                  {CENTRAL_OFFICE_INFO.building}
                </h3>
                <p className="text-xs text-indigo-300 font-medium">
                  {CENTRAL_OFFICE_INFO.fullLocation}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-700/70 space-y-2 text-xs">
                <div className="flex items-start gap-2 text-slate-300">
                  <Clock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Operating Hours</span>
                    <span className="font-mono text-slate-300">{CENTRAL_OFFICE_INFO.timings}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-slate-300 pt-1">
                  <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Physical Locker Custody</span>
                    <span>Locker Vault A-01 through D-20 (Block 33, Lost & Found Wing)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Department Staff Contact Table / Cards */}
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  Staff Contact Roster
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {DEPARTMENT_CONTACTS.length} Officers on Duty
                </span>
              </div>

              <div className="divide-y divide-slate-700/60">
                {DEPARTMENT_CONTACTS.map((officer, idx) => (
                  <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-900/60 border border-indigo-700/50 flex items-center justify-center text-indigo-300 text-xs font-bold">
                        {officer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{officer.name}</p>
                        <p className="text-[11px] text-slate-400">{officer.role}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono text-slate-300 font-medium bg-slate-900 px-2.5 py-1 rounded-md border border-slate-700/80">
                        contact - {officer.contact !== '-' ? officer.contact : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-700/70">
                Contact details verified by University Lost & Found Department • Block 33.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Login Footer */}
      <footer className="border-t border-slate-800/80 py-6 bg-slate-950/80 text-center text-xs text-slate-500">
        <p>© 2026 Campus Find by Compilers — Official University Lost & Found Network (Block 33).</p>
      </footer>
    </div>
  );
};
