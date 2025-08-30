import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getApiUrl } from '@/config/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  ChevronRight,
  ChevronLeft,
  Play,
  Target,
  Zap,
  TrendingUp,
  CheckCircle,
  RotateCcw,
  Home,
  Video,
} from 'lucide-react';

interface Drill {
  title: string;
  objective: string;
  description: string;
  biomechanical_focus?: string;
  steps: string[];
  coaching_cues?: string[];
  progression: string;
}

interface AnalysisResponse {
  video_id: string;
  analysis: {
    user_shot?: {
      file: string;
      gender: string;
      handedness: string;
      shot_type: string;
    };
    personalized_drills: Drill[];
  };
}

const DrillPlayground: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get('video_id');
  
  const [analysisData, setAnalysisData] = useState<AnalysisResponse | null>(null);
  const [currentDrillIndex, setCurrentDrillIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!videoId) {
      setError('No video ID provided');
      setIsLoading(false);
      return;
    }

    loadAnalysisData();
  }, [videoId]);

  const loadAnalysisData = () => {
    const storedData = sessionStorage.getItem(`analysis_${videoId}`);
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setAnalysisData(data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load drill data');
        setIsLoading(false);
      }
    } else {
      setError('No drill data found. Please analyze your video first.');
      setIsLoading(false);
    }
  };

  const currentDrill = analysisData?.analysis.personalized_drills[currentDrillIndex];
  const totalDrills = analysisData?.analysis.personalized_drills.length || 0;
  const progress = totalDrills > 0 ? ((currentDrillIndex + 1) / totalDrills) * 100 : 0;

  const handleNext = () => {
    if (currentDrillIndex < totalDrills - 1) {
      setCurrentDrillIndex(currentDrillIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentDrillIndex > 0) {
      setCurrentDrillIndex(currentDrillIndex - 1);
    }
  };

  const handleRestart = () => {
    setCurrentDrillIndex(0);
  };

  const isLastDrill = currentDrillIndex === totalDrills - 1;
  const isFirstDrill = currentDrillIndex === 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A3A7A] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Play className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-pulse" />
            <h2 className="text-xl font-semibold mb-2">Loading Drills...</h2>
            <p className="text-gray-600">Preparing your personalized training</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !analysisData || !currentDrill) {
    return (
      <div className="min-h-screen bg-[#0A3A7A] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Target className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-4">No Drills Available</h2>
            <p className="text-gray-600 mb-6">
              {error || 'No personalized drills found for this analysis.'}
            </p>
            <div className="space-y-3">
              <Button onClick={() => navigate(`/analysis?video_id=${videoId}`)}>
                View Analysis Results
              </Button>
              <Button variant="outline" onClick={() => navigate('/tennis-analysis')}>
                Analyze New Video
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
        <nav className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(`/analysis?video_id=${videoId}`)}
            className="text-[#0A2342] hover:text-[#0A3A7A]"
          >
            Back to Results
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-[#0A2342] hover:text-[#0A3A7A]"
          >
            <Home className="h-4 w-4" />
          </Button>
        </nav>
      </header>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Personalized Training Drills
            </h1>
            <span className="text-white/90 text-sm">
              {currentDrillIndex + 1} of {totalDrills}
            </span>
          </div>
          <Progress value={progress} className="h-2 bg-white/20" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Video Player */}
          <Card className="bg-white/95 border-white/20 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-6 w-6 text-blue-500" />
                Your Shot Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysisData?.analysis.user_shot?.file ? (
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <video 
                    controls 
                    className="w-full h-full object-contain"
                    src={`${getApiUrl('')}/${analysisData.analysis.user_shot.file}`}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : videoId ? (
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <video 
                    controls 
                    className="w-full h-full object-contain"
                    src={`${getApiUrl('')}/processed_videos/${videoId}/${videoId}_keypoints.mp4`}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <div className="text-center p-8 aspect-video flex items-center justify-center bg-gray-100 rounded-lg">
                  <div>
                    <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Video not available</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Current Drill Card */}
          <Card className="bg-white/95 border-white/20 shadow-xl rounded-2xl">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">{currentDrillIndex + 1}</span>
              </div>
              <CardTitle className="text-2xl md:text-3xl text-blue-900 mb-2">
                {currentDrill.title}
              </CardTitle>
              <p className="text-lg text-blue-700 font-medium">
                {currentDrill.objective}
              </p>
            </CardHeader>
          
            <CardContent className="space-y-6">
              {/* Description */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-800 text-lg leading-relaxed">
                  {currentDrill.description}
                </p>
              </div>

              {/* Biomechanical Focus */}
              {currentDrill.biomechanical_focus && (
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Biomechanical Focus
                  </h3>
                  <p className="text-purple-800">{currentDrill.biomechanical_focus}</p>
                </div>
              )}
              
              {/* Steps */}
              {currentDrill.steps && currentDrill.steps.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-500" />
                    Training Steps
                  </h3>
                  <div className="space-y-3">
                    {currentDrill.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600 flex-shrink-0 mt-0.5">
                          {stepIndex + 1}
                        </div>
                        <p className="text-gray-800 text-lg">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Coaching Cues */}
              {currentDrill.coaching_cues && currentDrill.coaching_cues.length > 0 && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Key Coaching Cues
                  </h3>
                  <div className="grid gap-2">
                    {currentDrill.coaching_cues.map((cue, cueIndex) => (
                      <div key={cueIndex} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                        <span className="text-green-800 font-medium">"{cue}"</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Progression */}
              {currentDrill.progression && (
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h3 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Progression Path
                  </h3>
                  <p className="text-orange-800">{currentDrill.progression}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center">
          <Button
            onClick={handlePrevious}
            disabled={isFirstDrill}
            variant="outline"
            size="lg"
            className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ChevronLeft className="h-5 w-5" />
            Previous
          </Button>

          <div className="flex gap-3">
            <Button
              onClick={handleRestart}
              variant="outline"
              size="lg"
              className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RotateCcw className="h-4 w-4" />
              Restart
            </Button>
          </div>

          {!isLastDrill ? (
            <Button
              onClick={handleNext}
              size="lg"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              Next Drill
              <ChevronRight className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              onClick={() => navigate(`/analysis?video_id=${videoId}`)}
              size="lg"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-5 w-5" />
              Complete Training
            </Button>
          )}
        </div>

        {/* Drill Counter */}
        <div className="mt-8 text-center">
          <div className="flex justify-center gap-2">
            {Array.from({ length: totalDrills }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentDrillIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentDrillIndex
                    ? 'bg-blue-500'
                    : index < currentDrillIndex
                    ? 'bg-green-500'
                    : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrillPlayground;