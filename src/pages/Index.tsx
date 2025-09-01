import SocialProof from "@/components/SocialProof";
import heroBackground from "@/assets/tennis-hero-bg.jpg";
import logo from "@/assets/winner-way-logo.png";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const handleTryItNow = () => {
    navigate('/high-demand');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-overlay/60" />
      
      {/* Minimal Header */}
      <header className="relative z-10 flex justify-center items-center pt-8 pb-4">
        <nav className="flex items-center gap-8">
          <a 
            href="/contact" 
            className="text-white hover:text-white/80 font-medium transition-colors text-lg"
          >
            Contact Us
          </a>
          <button 
            onClick={handleTryItNow}
            className="text-white hover:text-white/80 font-medium transition-colors text-lg"
          >
            Try it now
          </button>
        </nav>
      </header>
      
      {/* Content */}
      <div className="relative z-10 min-h-[calc(100vh-120px)] flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <div className="mb-8 flex items-center justify-center gap-3">
            <img 
              src={logo} 
              alt="Winner Way Logo" 
              className="h-20 w-auto"
            />
            <h2 className="text-white text-7xl font-bold">Winner Way</h2>
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
          
          {/* Try It Now Button */}
          <div className="mb-8">
            <Button 
              onClick={handleTryItNow}
              size="lg"
              className="bg-primary text-black hover:bg-primary/90 font-bold text-2xl px-16 py-8 rounded-lg shadow-2xl transform hover:scale-105 transition-all duration-200"
            >
              Try it now →
            </Button>
          </div>

          {/* Secondary Text */}
          <p className="text-lg text-white/70 mb-8">
            No signup required • Instant analysis
          </p>
          
          {/* Social Proof */}
          <SocialProof />
        </div>
      </div>
    </div>
  );
};

export default Index;
