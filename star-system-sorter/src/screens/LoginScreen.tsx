import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { Sparkles, Star } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface GoogleJWT {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}

export default function LoginScreen() {
  const navigate = useNavigate();
  const { login, loginAsGuest } = useAuthStore();

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        console.error('No credential received');
        return;
      }

      const decoded = jwtDecode<GoogleJWT>(credentialResponse.credential);
      
      login({
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        isGuest: false,
      });

      console.log('Google login successful:', decoded.name);
      navigate('/onboarding');
    } catch (error) {
      console.error('Error decoding Google credential:', error);
    }
  };

  const handleGoogleError = () => {
    console.error('Google login failed');
  };

  const handleGuestContinue = () => {
    loginAsGuest();
    console.log('Continue as guest');
    navigate('/onboarding');
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
            <Star className="absolute -top-2 -right-2 w-5 h-5 text-yellow-400 animate-pulse" fill="#fbbf24" />
            <Star className="absolute -bottom-1 -left-1 w-4 h-4 text-violet-400 animate-pulse" fill="#a78bfa" style={{ animationDelay: '0.5s' }} />
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-white mb-3">
            Star System Sorter
          </h1>
          <div className="text-2xl font-light text-violet-300 mb-6 tracking-widest">
            S³
          </div>

          {/* Tagline */}
          <p className="text-lg text-white/70 mb-8 max-w-xs">
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
          <div className="w-full flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              theme="filled_blue"
              size="large"
              text="continue_with"
              shape="rectangular"
              width="384"
            />
          </div>

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
            onClick={handleGuestContinue}
            className="w-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white px-6 py-4 rounded-2xl transition-all duration-200 border border-white/10 hover:border-white/20 min-h-[44px]"
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
