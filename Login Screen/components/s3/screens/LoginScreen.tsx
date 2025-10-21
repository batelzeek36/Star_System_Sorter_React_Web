import React from 'react';
import { Sparkles, Star } from 'lucide-react';
import { Button } from '../Button';

export default function LoginScreen() {
  const handleGoogleLogin = () => {
    // Placeholder for Google OAuth
    console.log('Google login initiated');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0118] via-[#1a0f2e] to-[#0a0118] text-white relative overflow-hidden">
      {/* Animated starfield background */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(2px 2px at 20% 30%, white, transparent),
                           radial-gradient(2px 2px at 60% 70%, white, transparent),
                           radial-gradient(1px 1px at 50% 50%, white, transparent),
                           radial-gradient(1px 1px at 80% 10%, white, transparent),
                           radial-gradient(2px 2px at 90% 60%, white, transparent),
                           radial-gradient(1px 1px at 33% 80%, white, transparent)`,
          backgroundSize: '200px 200px',
          backgroundRepeat: 'repeat'
        }} />
      </div>

      {/* Cosmic glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center justify-between min-h-screen p-6 py-12">
        {/* Logo and Title Section */}
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm">
          {/* Cosmic Logo */}
          <div className="relative mb-8">
            <div className="absolute inset-0 animate-pulse">
              <div className="w-24 h-24 bg-violet-500/20 rounded-full blur-xl" />
            </div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-violet-500/30 to-purple-600/30 rounded-full border-2 border-violet-400/40 flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="w-12 h-12 text-violet-300" strokeWidth={1.5} />
            </div>
            {/* Orbiting stars */}
            <Star className="absolute -top-2 -right-2 w-5 h-5 text-gold-400 animate-pulse" fill="#fbbf24" />
            <Star className="absolute -bottom-1 -left-1 w-4 h-4 text-violet-400 animate-pulse" fill="#a78bfa" style={{ animationDelay: '0.5s' }} />
          </div>

          {/* Title */}
          <h1 className="text-white mb-3">
            Star System Sorter
          </h1>
          <div className="text-violet-300 mb-6 tracking-widest">
            S³
          </div>

          {/* Tagline */}
          <p className="text-white/70 mb-8 max-w-xs">
            Discover your cosmic origins through the wisdom of Human Design
          </p>

          {/* Feature highlights */}
          <div className="space-y-3 mb-12 w-full">
            <div className="flex items-center gap-3 text-sm text-white/60">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              <span>Deterministic star system classification</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-white/60">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              <span>Personalized cosmic insights</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-white/60">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              <span>Join a community of seekers</span>
            </div>
          </div>
        </div>

        {/* Login Section */}
        <div className="w-full max-w-sm space-y-4">
          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 px-6 py-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl group"
          >
            {/* Google Icon */}
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="font-medium">Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#0a0118] text-white/40">or</span>
            </div>
          </div>

          {/* Guest Continue */}
          <button
            onClick={() => console.log('Continue as guest')}
            className="w-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white px-6 py-4 rounded-2xl transition-all duration-200 border border-white/10 hover:border-white/20"
          >
            Continue as Guest
          </button>

          {/* Legal Text */}
          <p className="text-xs text-white/40 text-center pt-4">
            By continuing, you agree to our{' '}
            <button className="text-violet-400 hover:text-violet-300 underline">
              Terms of Service
            </button>
            {' '}and{' '}
            <button className="text-violet-400 hover:text-violet-300 underline">
              Privacy Policy
            </button>
          </p>
        </div>

        {/* Footer tagline */}
        <div className="text-center text-xs text-white/30 pt-6">
          For insight & entertainment. Not medical, financial, or legal advice.
        </div>
      </div>
    </div>
  );
}
