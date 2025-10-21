/**
 * Reusable animation styles with vendor prefixes for mobile browser support
 * Includes -webkit- prefixes for iOS Safari compatibility
 */
export const animationStyles = `
  @-webkit-keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  @keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  
  @-webkit-keyframes fadeInUp {
    0% { opacity: 0; -webkit-transform: translateY(20px); transform: translateY(20px); }
    100% { opacity: 1; -webkit-transform: translateY(0); transform: translateY(0); }
  }
  @keyframes fadeInUp {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  
  @-webkit-keyframes fadeInDown {
    0% { opacity: 0; -webkit-transform: translateY(-10px); transform: translateY(-10px); }
    100% { opacity: 1; -webkit-transform: translateY(0); transform: translateY(0); }
  }
  @keyframes fadeInDown {
    0% { opacity: 0; transform: translateY(-10px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  
  @-webkit-keyframes scaleIn {
    0% { opacity: 0; -webkit-transform: scale(0.9); transform: scale(0.9); }
    100% { opacity: 1; -webkit-transform: scale(1); transform: scale(1); }
  }
  @keyframes scaleIn {
    0% { opacity: 0; transform: scale(0.9); }
    100% { opacity: 1; transform: scale(1); }
  }
  
  @-webkit-keyframes glowPulse {
    0%, 100% { box-shadow: 0 0 20px rgba(167, 139, 250, 0.2); }
    50% { box-shadow: 0 0 40px rgba(167, 139, 250, 0.4); }
  }
  @keyframes glowPulse {
    0%, 100% { box-shadow: 0 0 20px rgba(167, 139, 250, 0.2); }
    50% { box-shadow: 0 0 40px rgba(167, 139, 250, 0.4); }
  }
  
  @-webkit-keyframes float {
    0%, 100% { -webkit-transform: translateY(0px); transform: translateY(0px); }
    50% { -webkit-transform: translateY(-10px); transform: translateY(-10px); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  .animate-fade-in {
    -webkit-animation: fadeIn 0.8s ease-out forwards;
    animation: fadeIn 0.8s ease-out forwards;
  }
  
  .animate-fade-in-down {
    -webkit-animation: fadeInDown 0.7s ease-out forwards;
    animation: fadeInDown 0.7s ease-out forwards;
  }
  
  .animate-fade-in-up {
    -webkit-animation: fadeInUp 0.8s ease-out forwards;
    animation: fadeInUp 0.8s ease-out forwards;
  }
  
  .animate-scale-in {
    -webkit-animation: scaleIn 0.7s ease-out forwards;
    animation: scaleIn 0.7s ease-out forwards;
  }
  
  .animate-glow-pulse {
    -webkit-animation: glowPulse 3s ease-in-out infinite;
    animation: glowPulse 3s ease-in-out infinite;
  }
  
  .animate-float {
    -webkit-animation: float 6s ease-in-out infinite;
    animation: float 6s ease-in-out infinite;
  }
`;
