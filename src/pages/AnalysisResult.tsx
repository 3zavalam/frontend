import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_CONFIG, getApiUrl, apiCall } from '@/config/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import StripePayment from '@/components/StripePayment';
import {
  Trophy,
  Target,
  Zap,
  AlertCircle,
  CheckCircle,
  Star,
  TrendingUp,
  Play,
  User,
  Award,
  Video,
} from 'lucide-react';

interface AnalysisResponse {
  video_id: string;
  status: string;
  shots_detected: number;
  analysis: {
    user_shot: {
      file: string;
      gender: string;
      handedness: string;
      shot_type: string;
    };
    best_match: {
      pro_name: string;
      overall_similarity: number;
      file: string;
    };
    all_matches: Array<{
      pro_name: string;
      overall_similarity: number;
    }>;
    analysis: {
      overall_rating: string;
      similarity_percentage: number;
      most_similar_pro: string;
      strengths?: Array<{
        aspect: string;
        score: number;
        comment: string;
      }>;
      areas_for_improvement?: Array<{
        aspect: string;
        score: number;
        comment: string;
      }>;
    };
    recommendations: {
      strengths: string[];
      improvements: string[];
    };
    ai_analysis: {
      detailed_feedback?: string;
      technical_points?: string[];
      ai_analysis?: {
        overall_assessment: string;
        key_observations: string[];
        specific_recommendations: string[];
        focus_areas: string[];
      };
    };
    personalized_drills: Array<{
      title: string;
      objective: string;
      description: string;
      biomechanical_focus?: string;
      steps: string[];
      coaching_cues?: string[];
      progression: string;
    }>;
  };
}

const AnalysisResult: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get('video_id');
  
  const [analysisData, setAnalysisData] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const fetchVideoUrl = async (videoId: string) => {
    try {
      const response = await apiCall(`/api/videos/${videoId}`) as { s3_url: string };
      setVideoUrl(response.s3_url);
    } catch (err) {
      console.error('Failed to fetch video URL:', err);
    }
  };

  useEffect(() => {
    if (!videoId) {
      setError('No video ID provided');
      setIsLoading(false);
      return;
    }

    // Fetch video URL
    fetchVideoUrl(videoId);

    // Check if we already have analysis results
    const existingAnalysis = sessionStorage.getItem(`analysis_${videoId}`);
    if (existingAnalysis) {
      try {
        const data = JSON.parse(existingAnalysis);
        setAnalysisData(data);
        setIsLoading(false);
        setProgress(100);
        return;
      } catch (err) {
        console.error('Failed to parse existing analysis:', err);
      }
    }

    analyzeVideo();
  }, [videoId]);

  const analyzeVideo = async () => {
    setIsLoading(true);
    setProgress(10);

    try {
      const authToken = sessionStorage.getItem('auth_token');
      
      // First try to analyze the video
      const analyzeResponse = await fetch(getApiUrl(`/api/videos/analyze/${videoId}`), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        }
      });

      setProgress(50);

      if (!analyzeResponse.ok) {
        const errorData = await analyzeResponse.json();
        if (analyzeResponse.status === 402) {
          setError('Upgrade required for analysis');
          return;
        }
        throw new Error(errorData.error || 'Analysis failed');
      }

      const analyzeResult = await analyzeResponse.json();
      console.log('Backend response:', analyzeResult); // Debug
      console.log('Analysis structure:', analyzeResult.analysis); // Debug analysis object
      console.log('Recommendations:', analyzeResult.analysis?.recommendations); // Debug recommendations
      console.log('Best match:', analyzeResult.analysis?.best_match); // Debug best match
      setProgress(100);
      setAnalysisData(analyzeResult);
      
      // Store analysis data for DrillPlayground
      sessionStorage.setItem(`analysis_${videoId}`, JSON.stringify(analyzeResult));

    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 0.8) return 'text-green-600';
    if (similarity >= 0.6) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getSimilarityBadge = (rating: string) => {
    const colors = {
      'Excellent': 'bg-green-100 text-green-800',
      'Good': 'bg-blue-100 text-blue-800',
      'Average': 'bg-yellow-100 text-yellow-800',
      'Needs Work': 'bg-orange-100 text-orange-800'
    };
    return colors[rating as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (!videoId) {
    return (
      <div className="min-h-screen bg-[#0A3A7A] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Invalid Request</h2>
            <p className="text-gray-600 mb-4">No video ID provided for analysis.</p>
            <Button onClick={() => navigate('/analysis')}>
              Upload New Video
            </Button>
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
        <nav className="hidden md:flex items-center gap-8">
          <a href="/" className="text-[#0A2342] hover:text-[#0A3A7A] font-medium transition-colors">
            Home
          </a>
          <a href="/analysis" className="text-[#0A2342] hover:text-[#0A3A7A] font-medium transition-colors">
            New Analysis
          </a>
        </nav>
      </header>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {isLoading ? (
          <div className="text-center">
            <Card className="bg-white/95 border-white/20 shadow-xl rounded-2xl max-w-md mx-auto">
              <CardContent className="p-8">
                <div className="mb-6">
                  <Target className="h-16 w-16 text-blue-500 mx-auto animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Analyzing Your Shot...
                </h2>
                <p className="text-gray-600 mb-6">
                  Our AI is comparing your technique with professional players
                </p>
                <Progress value={progress} className="mb-4" />
                <p className="text-sm text-gray-500">{progress}% complete</p>
              </CardContent>
            </Card>
          </div>
        ) : error ? (
          <div className="text-center">
            <Card className="bg-white/95 border-white/20 shadow-xl rounded-2xl max-w-md mx-auto">
              <CardContent className="p-8">
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Analysis Failed</h2>
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
                <div className="space-y-3">
                  <Button onClick={analyzeVideo} className="w-full">
                    Try Again
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/analysis')}
                    className="w-full"
                  >
                    Upload New Video
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : analysisData && (
          <div className="space-y-8">
            {/* Results Header */}
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Your Tennis Analysis Results
              </h1>
              <p className="text-lg text-white/90">
                Shot analyzed • {analysisData.shots_detected} shot{analysisData.shots_detected !== 1 ? 's' : ''} detected
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left column - Strengths and Areas to Improve */}
              <div className="space-y-6">
                {/* Your Strengths */}
                <Card className="bg-white/95 border-white/20 shadow-xl rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-6 w-6" />
                      Your Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {(analysisData.analysis.analysis?.strengths || []).map((strength, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                          <Star className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <span className="text-green-800 font-medium">{strength.aspect}</span>
                            <p className="text-green-700 text-sm mt-1">{strength.comment}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Areas to Improve */}
                <Card className="bg-white/95 border-white/20 shadow-xl rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-600">
                      <TrendingUp className="h-6 w-6" />
                      Areas to Improve
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {(analysisData.analysis.analysis?.areas_for_improvement || []).map((improvement, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                          <Target className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <span className="text-orange-800 font-medium">{improvement.aspect}</span>
                            <p className="text-orange-700 text-sm mt-1">{improvement.comment}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right column - Video */}
              <div>
                <Card className="bg-white/95 border-white/20 shadow-xl rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Play className="h-6 w-6 text-blue-500" />
                      Your Shot Video
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analysisData.analysis.user_shot?.file ? (
                      <div className="aspect-video bg-black rounded-lg overflow-hidden">
                        <video 
                          controls 
                          className="w-full h-full object-contain"
                          src={videoUrl}
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ) : (
                      <div className="text-center p-8">
                        <Video className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                        <p className="text-gray-600">Video not available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* AI Analysis */}
            {analysisData.analysis.ai_analysis?.ai_analysis && 
             !analysisData.analysis.ai_analysis.ai_analysis.overall_assessment.includes('Error generating') &&
             !analysisData.analysis.ai_analysis.ai_analysis.overall_assessment.includes('temporarily unavailable') && (
              <Card className="bg-white/95 border-white/20 shadow-xl rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-6 w-6 text-purple-500" />
                    AI Technical Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Overall Assessment */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Overall Assessment</h4>
                      <p className="text-gray-700 leading-relaxed">
                        {analysisData.analysis.ai_analysis.ai_analysis.overall_assessment}
                      </p>
                    </div>

                    {/* Key Observations */}
                    {analysisData.analysis.ai_analysis.ai_analysis.key_observations?.length > 0 && 
                     !analysisData.analysis.ai_analysis.ai_analysis.key_observations.some(obs => 
                       obs.includes('temporarily unavailable') || obs.includes('try again later')) && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">Key Observations</h4>
                        <ul className="space-y-3">
                          {analysisData.analysis.ai_analysis.ai_analysis.key_observations.map((observation, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600 mt-0.5 flex-shrink-0">
                                {index + 1}
                              </div>
                              <span className="text-gray-700">{observation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Specific Recommendations */}
                    {analysisData.analysis.ai_analysis.ai_analysis.specific_recommendations?.length > 0 && 
                     !analysisData.analysis.ai_analysis.ai_analysis.specific_recommendations.some(rec => 
                       rec.includes('try again later') || rec.includes('temporarily unavailable')) && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">Specific Recommendations</h4>
                        <ul className="space-y-3">
                          {analysisData.analysis.ai_analysis.ai_analysis.specific_recommendations.map((recommendation, index) => (
                            <li key={index} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                              <Target className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                              <span className="text-purple-800">{recommendation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Focus Areas */}
                    {analysisData.analysis.ai_analysis.ai_analysis.focus_areas?.length > 0 && 
                     !analysisData.analysis.ai_analysis.ai_analysis.focus_areas.some(area => 
                       area.includes('pending') || area.includes('temporarily unavailable')) && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">Practice Focus Areas</h4>
                        <div className="flex flex-wrap gap-2">
                          {analysisData.analysis.ai_analysis.ai_analysis.focus_areas.map((area, index) => (
                            <Badge key={index} variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Unlimited Analysis CTA */}
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

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {/* Start Training Button - Only show if there are drills */}
              {analysisData.analysis.personalized_drills?.length > 0 && (
                <Button 
                  onClick={() => navigate(`/drills?video_id=${videoId}`)}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                >
                  <Play className="h-5 w-5" />
                  Start Training Drills
                </Button>
              )}
              
              <Button 
                onClick={() => navigate('/analysis')}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Analyze Another Shot
              </Button>
              <Button 
                variant="outline"
                size="lg"
                onClick={() => navigate('/')}
              >
                Back to Home
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisResult;