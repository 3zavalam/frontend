import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Trophy, Zap, Target } from 'lucide-react';

const Success: React.FC = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Start countdown
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/analysis');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleGoNow = () => {
    navigate('/analysis');
  };

  return (
    <div className="min-h-screen bg-[#0A3A7A]">
      {/* Header */}
      <header className="bg-white flex justify-between items-center px-4 md:px-6 py-4 shadow-sm">
        <div className="flex items-center gap-2">
          <img 
            src="/src/assets/winner-way-logo-usopen.png" 
            alt="WinnerWay Logo" 
            className="w-6 h-6 md:w-8 md:h-8 object-contain"
          />
          <span className="text-[#0A2342] font-bold text-lg md:text-xl">WinnerWay</span>
        </div>
      </header>

      {/* Success Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-16">
        <div className="text-center">
          <Card className="bg-white/95 border-white/20 shadow-xl rounded-2xl max-w-2xl mx-auto">
            <CardContent className="p-8 md:p-12">
              {/* Success Icon */}
              <div className="mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  Payment Successful!
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Thank you for your purchase. You now have unlimited access to Tennis Analysis Pro.
                </p>
              </div>

              {/* Features Unlocked */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Unlimited Analysis</h3>
                  <p className="text-sm text-gray-600">Upload as many videos as you want</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="h-6 w-6 text-purple-500" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Detailed Feedback</h3>
                  <p className="text-sm text-gray-600">Complete biomechanical analysis</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Trophy className="h-6 w-6 text-yellow-500" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Training Drills</h3>
                  <p className="text-sm text-gray-600">Personalized exercises</p>
                </div>
              </div>

              {/* Countdown and Button */}
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-blue-800 text-center">
                    Redirecting automatically in <span className="font-bold text-xl">{countdown}</span> seconds
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    onClick={handleGoNow}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3"
                  >
                    Analyze Now →
                  </Button>
                  
                  <Button 
                    onClick={() => navigate('/')}
                    variant="outline"
                    size="lg"
                    className="border-gray-300 text-gray-600 hover:bg-gray-50 px-8 py-3"
                  >
                    Go to Home
                  </Button>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600 text-center">
                  Have questions? Contact our support: 
                  <a href="/contact" className="text-blue-600 hover:underline ml-1">
                    support@winnerway.com
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Success;