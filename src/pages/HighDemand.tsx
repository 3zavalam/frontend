import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import logoImage from '@/assets/winner-way-logo-usopen.png';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Upload,
  Video,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

const HighDemand: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from("waitlist")
        .insert([{ email }]);

      if (error) {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      } else {
        setSubmitted(true);
        setEmail("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A3A7A]">
      {/* Header */}
      <header className="bg-white flex justify-between items-center px-4 md:px-6 py-4 shadow-sm">
        <div className="flex items-center gap-2">
          <img 
            src={logoImage} 
            alt="WinnerWay Logo" 
            className="w-6 h-6 md:w-8 md:h-8 object-contain"
          />
          <span className="text-[#0A2342] font-bold text-lg md:text-xl">WinnerWay</span>
        </div>
        <nav className="hidden md:absolute md:left-1/2 md:transform md:-translate-x-1/2 md:flex items-center gap-8">
          <a href="/" className="text-[#0A2342] hover:text-[#0A3A7A] font-medium transition-colors">
            Home
          </a>
          <a href="/contact" className="text-[#0A2342] hover:text-[#0A3A7A] font-medium transition-colors">
            Contact Us
          </a>
          <a href="/pricing" className="text-[#0A2342] hover:text-[#0A3A7A] font-medium transition-colors">
            Pricing
          </a>
        </nav>
        <div className="w-0 md:w-[120px]"></div>
      </header>

      {/* Centered Title */}
      <div className="text-center mb-8 md:mb-12 mt-8 md:mt-16 px-4">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
          Get Your Tennis Analyzed by AI in Minutes
        </h1>
        <p className="text-base md:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
          Upload your stroke and receive clear feedback + personalized drills.
          <br />
          <span className="text-[#FFD21E] font-semibold"> Free exclusive trial during the US Open.</span>
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Left Side - Form */}
          <Card className="bg-white/95 border-white/20 shadow-xl rounded-2xl">
            <CardContent className="p-4 md:p-8 space-y-4 md:space-y-6">
              {/* Email Input - Disabled */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-800">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  disabled
                  className="w-full px-4 py-3 border rounded-lg bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* Disabled Form Elements */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-500">
                  Select Stroke
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled
                    className="p-4 rounded-lg border-2 border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                  >
                    Forehand
                  </button>
                  <button
                    type="button"
                    disabled
                    className="p-4 rounded-lg border-2 border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                  >
                    Backhand
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-500">
                  Dominant Hand
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled
                    className="p-4 rounded-lg border-2 border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                  >
                    Right-handed
                  </button>
                  <button
                    type="button"
                    disabled
                    className="p-4 rounded-lg border-2 border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                  >
                    Left-handed
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-500">
                  Experience Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    disabled
                    className="p-3 rounded-lg border-2 border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                  >
                    <div className="text-center">
                      <div className="text-sm font-semibold">Beginner</div>
                      <div className="text-xs text-gray-400 mt-1">≤ 1 year</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    disabled
                    className="p-3 rounded-lg border-2 border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                  >
                    <div className="text-center">
                      <div className="text-sm font-semibold">Intermediate</div>
                      <div className="text-xs text-gray-400 mt-1">2-3 years</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    disabled
                    className="p-3 rounded-lg border-2 border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                  >
                    <div className="text-center">
                      <div className="text-sm font-semibold">Advanced</div>
                      <div className="text-xs text-gray-400 mt-1">4+ years</div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-500">
                  Gender
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled
                    className="p-4 rounded-lg border-2 border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                  >
                    Men
                  </button>
                  <button
                    type="button"
                    disabled
                    className="p-4 rounded-lg border-2 border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                  >
                    Women
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Side - Video Upload */}
          <Card className="bg-white/95 border-white/20 shadow-xl rounded-2xl">
            <CardContent className="p-4 md:p-8 space-y-4 md:space-y-6">
              {/* Video Camera Icon */}
              <div className="text-center">
                <Video className="h-12 w-12 md:h-16 md:w-16 text-gray-400 mx-auto mb-3 md:mb-4" />
              </div>

              {/* Upload Area - Disabled */}
              <div className="relative border-2 border-dashed border-gray-300 bg-gray-100 rounded-xl p-4 md:p-8 text-center">
                <div className="py-4 md:py-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <Upload className="h-6 w-6 md:h-8 md:w-8 text-gray-400" />
                  </div>
                  <p className="text-lg md:text-xl font-medium text-gray-500 mb-2">
                    Drop video here or click to browse
                  </p>
                  <p className="text-xs md:text-sm text-gray-400">
                    Supports .mp4, .mov, .avi (max 25MB)
                  </p>
                </div>
              </div>

              {/* Instructions Box */}
              <div className="bg-gray-100 border border-gray-200 rounded-xl p-3 md:p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <h4 className="font-semibold text-gray-600 text-sm md:text-base">How to Record</h4>
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>
                <p className="text-center text-gray-600 text-sm md:text-base">
                  Film yourself playing a rally from behind, <span className="font-semibold bg-gray-200 px-1.5 md:px-2 py-0.5 rounded text-xs md:text-sm">max 1 minute</span>
                </p>
              </div>

              {/* Upload Button - Disabled */}
              <div className="pt-2 md:pt-4">
                <Button
                  disabled
                  size="lg"
                  className="w-full bg-gray-400 text-white font-semibold py-3 md:py-4 text-sm md:text-base cursor-not-allowed"
                >
                  Upload & Analyze
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* High Demand Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-white/95 backdrop-blur-sm border-white/20 shadow-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-gray-800 mb-4">
              <span className="text-[#0A3A7A]">WinnerWay is in High Demand</span> 🎾
            </DialogTitle>
          </DialogHeader>
          
          {!submitted ? (
            <div className="space-y-6">
              <p className="text-center text-gray-700 leading-relaxed">
                Sorry for the inconvenience! We're currently processing more requests than expected during the US Open week.
                Leave your email to be among the first to access your AI tennis analysis.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 px-4 text-center bg-white border-gray-300 focus:border-blue-500"
                />
                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="w-full h-12 bg-[#0A3A7A] hover:bg-[#0A2342] text-white font-bold"
                >
                  {isLoading ? "Joining..." : "Join Early Access"}
                </Button>
              </form>
            </div>
          ) : (
            <div className="space-y-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-800">
                You're on the list ✅
              </h3>
              
              <p className="text-gray-700">
                We'll notify you as soon as your analysis is ready.
              </p>
              
              <p className="text-sm text-gray-600">
                Follow us on Instagram{" "}
                <a 
                  href="https://instagram.com/WinnerWayai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#0A3A7A] hover:underline font-semibold"
                >
                  @WinnerWayAI
                </a>{" "}
                for live updates.
              </p>
              
              <Button
                onClick={() => window.location.href = '/'}
                size="lg"
                className="w-full bg-[#0A3A7A] hover:bg-[#0A2342] text-white font-bold"
              >
                Back to Home
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HighDemand;