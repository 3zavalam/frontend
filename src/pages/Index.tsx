import EmailCapture from "@/components/EmailCapture";
import SocialProof from "@/components/SocialProof";
import heroBackground from "@/assets/tennis-hero-bg.jpg";
import logo from "@/assets/winner-way-logo.png";

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-overlay/60" />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <div className="mb-8">
            <img 
              src={logo} 
              alt="Winner Way Logo" 
              className="w-16 h-16 mx-auto mb-4"
            />
            <h2 className="text-white text-2xl font-bold">Winner Way</h2>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="text-primary">Film. Upload. Fix.</span>
            <br />
            AI coaching made simple.
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
            Get personalized AI feedback to elevate your game.
          </p>
          
          {/* Email Capture */}
          <div className="mb-8">
            <EmailCapture />
          </div>
          
          {/* Social Proof */}
          <SocialProof />
        </div>
      </div>
    </div>
  );
};

export default Index;
