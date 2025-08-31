import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_CONFIG, getApiUrl } from '@/config/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import StripePayment from '@/components/StripePayment';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Upload,
  Video,
  Play,
  Trophy,
  Target,
  Zap,
  AlertCircle,
  CheckCircle,
  Star,
  TrendingUp,
  Crown,
  Instagram,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';

interface UploadVideoResponse {
  video_id: string;
  filename: string;
  status: string;
  user_info: {
    email: string;
    is_new_user: boolean;
  };
  auth_token?: string;
}

const TennisAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [email, setEmail] = useState<string>('');
  const [showEmailValidation, setShowEmailValidation] = useState(false);
  const [gender, setGender] = useState<'men' | 'women' | null>(null);
  const [handedness, setHandedness] = useState<'righty' | 'lefty' | null>(null);
  const [experienceLevel, setExperienceLevel] = useState<'beginner' | 'intermediate' | 'advanced' | null>(null);
  const [shotType, setShotType] = useState<'forehand' | 'backhand' | 'serve' | null>(null);
  const [backhandType, setBackhandType] = useState<'1h' | '2h' | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emailTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (emailTimeoutRef.current) {
        clearTimeout(emailTimeoutRef.current);
      }
    };
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (!email || !validateEmail(email) || !gender || !handedness || !experienceLevel || !shotType || (shotType === 'backhand' && !backhandType)) {
      setError('Please complete all form fields before uploading a video');
      return;
    }
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    const allowedTypes = ['video/mp4', 'video/mov', 'video/avi'];
    const maxSize = 25 * 1024 * 1024; // 25MB

    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid video file (.mp4, .mov, .avi)');
      return;
    }

    if (file.size > maxSize) {
      setError('File too large. Maximum size is 25MB (~1 minute of video)');
      return;
    }

    setVideoFile(file);
    setError(null);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleFileInputClick = (e: React.MouseEvent) => {
    if (!email || !validateEmail(email) || !gender || !handedness || !experienceLevel || !shotType || (shotType === 'backhand' && !backhandType)) {
      e.preventDefault();
      setError('Please complete all form fields before selecting a video');
      return;
    }
  };

  const validateEmail = (email: string) => {
    return email.includes('@') && email.includes('.');
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setShowEmailValidation(false);
    
    // Clear existing timeout
    if (emailTimeoutRef.current) {
      clearTimeout(emailTimeoutRef.current);
    }
    
    // Only show validation if there's text and after user stops typing
    if (value.length > 0) {
      emailTimeoutRef.current = setTimeout(() => {
        setShowEmailValidation(true);
      }, 800); // 800ms delay
    }
  };


  const handleUpload = async () => {
    // Validate all required fields
    if (!videoFile) {
      setError('Please select a video file');
      return;
    }

    if (!email || !validateEmail(email)) {
      setError('Please enter a valid email address (must contain @ and .)');
      return;
    }

    if (!gender) {
      setError('Please select gender');
      return;
    }

    if (!handedness) {
      setError('Please select your handedness');
      return;
    }

    if (!experienceLevel) {
      setError('Please select your experience level');
      return;
    }

    if (!shotType) {
      setError('Please select the shot type');
      return;
    }

    if (shotType === 'backhand' && !backhandType) {
      setError('Please select backhand type (1H or 2H)');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);
    setError(null);

    try {

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);

      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('email', email);
      formData.append('name', email.split('@')[0]); // Use email prefix as name
      formData.append('gender', gender === 'men' ? 'male' : 'female');
      formData.append('dominant_hand', handedness); // Send exactly 'righty' or 'lefty'
      formData.append('experience_level', experienceLevel);
      
      // Handle shot type with backhand variants
      if (shotType === 'backhand') {
        formData.append('stroke_to_improve', backhandType === '1h' ? 'backhand_1h' : 'backhand_2h');
      } else {
        formData.append('stroke_to_improve', shotType);
      }
      
      // Also send handedness and shot_type for video metadata
      formData.append('handedness', handedness);
      if (shotType === 'backhand') {
        formData.append('shot_type', backhandType === '1h' ? 'backhand_1h' : 'backhand_2h');
      } else {
        formData.append('shot_type', shotType);
      }


      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.UPLOAD_VIDEO), {
        method: 'POST',
        body: formData
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.status === 413) {
        setError('Video too large. Maximum size is 25MB (~1 minute of video)');
        return;
      }

      if (!response.ok) {
        let errorMessage = 'Upload failed. Please try again.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          errorMessage = `Server error (${response.status}): ${response.statusText}`;
        }
        console.error('Upload error:', response.status, errorMessage);
        setError(errorMessage);
        return;
      }

      const result: UploadVideoResponse = await response.json();
      
      // Store auth token if provided
      if (result.auth_token) {
        sessionStorage.setItem('auth_token', result.auth_token);
      }
      
      // Store video info for analysis
      sessionStorage.setItem(`video_${result.video_id}`, JSON.stringify(result));
      
      // Redirect to analysis results page with video_id
      navigate(`/results?video_id=${result.video_id}`);
      
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
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
              {/* Email Input */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-800">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="your.email@example.com"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 bg-white ${
                    showEmailValidation && email && !validateEmail(email) 
                      ? 'border-red-300 focus:ring-red-500 text-red-900' 
                      : showEmailValidation && email && validateEmail(email)
                      ? 'border-green-300 focus:ring-green-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {showEmailValidation && email && !validateEmail(email) && (
                  <div className="flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle className="h-3 w-3" />
                    <span>Email must contain @ and . (example: name@domain.com)</span>
                  </div>
                )}
                {showEmailValidation && email && validateEmail(email) && (
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <CheckCircle className="h-3 w-3" />
                    <span>Valid email format</span>
                  </div>
                )}
              </div>

              {/* Stroke Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-800">
                  Select Stroke
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShotType('forehand');
                      setBackhandType(null);
                    }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      shotType === 'forehand'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Forehand
                  </button>
                  <button
                    type="button"
                    onClick={() => setShotType('backhand')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      shotType === 'backhand'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Backhand
                  </button>
                </div>
                
                {/* Backhand Type Selection - Only show when backhand is selected */}
                {shotType === 'backhand' && (
                  <div className="mt-4 space-y-3">
                    <label className="text-sm font-medium text-gray-700">
                      Backhand Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setBackhandType('1h')}
                        className={`p-3 rounded-lg border-2 transition-all text-sm ${
                          backhandType === '1h'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        1-Handed
                      </button>
                      <button
                        type="button"
                        onClick={() => setBackhandType('2h')}
                        className={`p-3 rounded-lg border-2 transition-all text-sm ${
                          backhandType === '2h'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        2-Handed
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Handedness Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-800">
                  Dominant Hand
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setHandedness('righty')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      handedness === 'righty'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Right-handed
                  </button>
                  <button
                    type="button"
                    onClick={() => setHandedness('lefty')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      handedness === 'lefty'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Left-handed
                  </button>
                </div>
              </div>

              {/* Experience Level Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-800">
                  Experience Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setExperienceLevel('beginner')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      experienceLevel === 'beginner'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-sm font-semibold">Beginner</div>
                      <div className="text-xs text-gray-500 mt-1"> 1 year</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setExperienceLevel('intermediate')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      experienceLevel === 'intermediate'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-sm font-semibold">Intermediate</div>
                      <div className="text-xs text-gray-500 mt-1">2-3 years</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setExperienceLevel('advanced')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      experienceLevel === 'advanced'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-sm font-semibold">Advanced</div>
                      <div className="text-xs text-gray-500 mt-1">4+ years</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Gender Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-800">
                  Gender
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setGender('men')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      gender === 'men'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Men
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('women')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      gender === 'women'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
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

              {/* Upload Area - Responsive */}
              <div
                className={`relative border-2 border-dashed rounded-xl p-4 md:p-8 text-center transition-colors ${
                  isDragOver
                    ? 'border-blue-400 bg-blue-50'
                    : videoFile
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".mp4,.mov,.avi"
                  onChange={handleFileInputChange}
                  onClick={handleFileInputClick}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                
                {videoFile ? (
                  <div className="py-3 md:py-4 relative z-0">
                    <CheckCircle className="h-10 w-10 md:h-12 md:w-12 text-green-500 mx-auto mb-2 md:mb-3" />
                    <p className="text-base md:text-lg font-medium text-gray-900">{videoFile.name}</p>
                    <p className="text-xs md:text-sm text-gray-500 mt-1">
                      {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="py-4 md:py-6 relative z-0">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                      <Upload className="h-6 w-6 md:h-8 md:w-8 text-gray-400" />
                    </div>
                    <p className="text-lg md:text-xl font-medium text-gray-700 mb-2">
                      Drop video here or click to browse
                    </p>
                    <p className="text-xs md:text-sm text-gray-500">
                      Supports .mp4, .mov, .avi (max 25MB)
                    </p>
                  </div>
                )}
              </div>

              {/* Instructions Box - Prettier */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3 md:p-4 shadow-sm">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <h4 className="font-semibold text-blue-800 text-sm md:text-base">How to Record</h4>
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                </div>
                <p className="text-center text-blue-700 text-sm md:text-base">
                  Film yourself playing a rally from behind, <span className="font-semibold bg-blue-100 px-1.5 md:px-2 py-0.5 rounded text-xs md:text-sm">max 1 minute</span>
                </p>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Processing video...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="bg-gray-200" />
                </div>
              )}

              {/* Error Display */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Upload Button - At Bottom */}
              <div className="pt-2 md:pt-4">
                <Button
                  onClick={handleUpload}
                  disabled={!videoFile || !email || !validateEmail(email) || !gender || !handedness || !experienceLevel || !shotType || (shotType === 'backhand' && !backhandType) || isUploading}
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 md:py-4 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <>Processing...</>
                  ) : !videoFile ? (
                    <>Select Video File First</>
                  ) : !email || !validateEmail(email) || !gender || !handedness || !experienceLevel || !shotType || (shotType === 'backhand' && !backhandType) ? (
                    <>Complete Form First</>
                  ) : (
                    <>Upload & Analyze</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Unlimited Analysis CTA */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 pb-8">
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 shadow-lg">
          <CardContent className="p-6 md:p-8">
            <div className="text-center mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
                Want unlimited analysis?
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Get unlimited AI tennis analysis, detailed feedback, and personalized training recommendations.
              </p>
            </div>
            <div className="max-w-md mx-auto">
              <StripePayment 
                amount={4900}
                productName="Tennis Analysis Pro"
                buttonText="Get Unlimited Analysis - $49"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-800">
              <Crown className="h-5 w-5 text-yellow-500" />
              Free Trial Used
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              You've used your free analysis! Get unlimited access to continue improving your game.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-white/70 rounded-lg border border-yellow-200">
              <h3 className="font-semibold mb-2 text-gray-800">Get Unlimited Analysis</h3>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Unlimited AI tennis analysis</li>
                <li>• Detailed biomechanical comparison</li>
                <li>• Personalized training recommendations</li>
                <li>• Progress tracking over time</li>
              </ul>
            </div>
            <StripePayment 
              amount={4900}
              productName="Tennis Analysis Pro"
              buttonText="Get Unlimited Access - $49"
              className="mb-4"
            />
            <Button 
              onClick={() => setShowUpgradeModal(false)} 
              variant="outline" 
              className="w-full border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              Maybe Later
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TennisAnalysis;