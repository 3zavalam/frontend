import EmailCapture from "@/components/EmailCapture";
import SocialProof from "@/components/SocialProof";
import heroBackground from "@/assets/tennis-hero-bg.jpg";
import logo from "@/assets/winner-way-logo.png";

export default function Waitlist() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      <div className="absolute inset-0 bg-overlay/60" />
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 flex items-center justify-center gap-3">
            <img src={logo} alt="Winner Way Logo" className="h-20 w-auto" />
            <h2 className="text-white text-7xl font-bold">Winner Way</h2>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="text-primary">Film. Upload. Fix.</span>
            <br />
            AI coaching made simple.
          </h1>

          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
            Get personalized AI feedback to elevate your game.
          </p>

          <div className="mb-8">
            <EmailCapture />
          </div>

          <SocialProof />
        </div>
      </div>
    </div>
  );
}
