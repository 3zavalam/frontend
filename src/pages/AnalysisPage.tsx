import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import logoImage from '@/assets/winner-way-logo-usopen.png';

interface Shot {
  shot_id: number;
  analyzed: boolean;
}

interface TopMatch {
  pro_name: string;
  strengths: string[];
  improvements: string[];
}

interface AnalysisData {
  success: boolean;
  session_id: string;
  processing: {
    shots_detected: number;
    keypoints_video_url: string;
    keypoints_video_filename: string;
  };
  shots: Shot[];
  comparison: {
    best_match: { pro_name: string };
    top_matches: TopMatch[];
  };
  feedback: {
    overall_assessment: string;
    key_strengths: string[];
    areas_for_improvement: string[];
    drill_recommendations: string[];
  };
}

export default function AnalysisPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [currentShotId, setCurrentShotId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = searchParams.get('session');
    const shotId = searchParams.get('shot');

    if (!sessionId || !shotId) {
      navigate('/');
      return;
    }

    const storedData = sessionStorage.getItem(`analysis_${sessionId}`);
    if (!storedData) {
      navigate('/');
      return;
    }

    try {
      const data = JSON.parse(storedData) as AnalysisData;
      setAnalysisData(data);
      setCurrentShotId(parseInt(shotId));
      setLoading(false);
    } catch (error) {
      console.error('Error parsing analysis data:', error);
      navigate('/');
    }
  }, [searchParams, navigate]);

  const handleShotChange = (shotId: number) => {
    if (analysisData) {
      setCurrentShotId(shotId);
      const newParams = new URLSearchParams(searchParams);
      newParams.set('shot', shotId.toString());
      navigate(`?${newParams.toString()}`, { replace: true });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl">Loading analysis...</div>
      </div>
    );
  }

  if (!analysisData || !currentShotId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl">Analysis not found</div>
      </div>
    );
  }

  const currentShot = analysisData.shots.find(s => s.shot_id === currentShotId);
  if (!currentShot) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl">Shot not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src={logoImage} 
                alt="Winner Way" 
                className="h-8 w-auto"
              />
              <h1 className="text-xl font-bold text-gray-900">Winner Way</h1>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Shot Navigation */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tennis Analysis Results</h2>
          <div className="flex flex-wrap gap-2">
            {analysisData.shots.map((shot) => (
              <button
                key={shot.shot_id}
                onClick={() => handleShotChange(shot.shot_id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  shot.shot_id === currentShotId
                    ? 'bg-blue-600 text-white'
                    : shot.analyzed
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600'
                }`}
                disabled={!shot.analyzed}
              >
                Shot {shot.shot_id} {shot.analyzed ? '✓' : '⏳'}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Feedback Cards */}
          <div className="space-y-6">
            {/* Overall Assessment */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Overall Assessment</h3>
              <p className="text-gray-700 leading-relaxed">{analysisData.feedback.overall_assessment}</p>
            </div>

            {/* Best Match */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Best Professional Match</h3>
              <p className="text-lg font-medium text-blue-600">{analysisData.comparison.best_match.pro_name}</p>
            </div>

            {/* Key Strengths */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Strengths</h3>
              <ul className="space-y-2">
                {analysisData.feedback.key_strengths.map((strength, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas for Improvement */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Areas for Improvement</h3>
              <ul className="space-y-2">
                {analysisData.feedback.areas_for_improvement.map((area, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span className="text-gray-700">{area}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Drill Recommendations */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Recommended Drills</h3>
              <ul className="space-y-2">
                {analysisData.feedback.drill_recommendations.map((drill, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-blue-500 font-bold">→</span>
                    <span className="text-gray-700">{drill}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Top Matches Detailed */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Professional Comparisons</h3>
              <div className="space-y-4">
                {analysisData.comparison.top_matches.map((match, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{match.pro_name}</h4>
                    <div className="mb-2">
                      <span className="text-sm font-medium text-green-600">Strengths:</span>
                      <ul className="text-sm text-gray-600 ml-2">
                        {match.strengths.map((strength, i) => (
                          <li key={i}>• {strength}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-orange-600">Improvements:</span>
                      <ul className="text-sm text-gray-600 ml-2">
                        {match.improvements.map((improvement, i) => (
                          <li key={i}>• {improvement}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Video */}
          <div className="lg:sticky lg:top-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Analysis Video - Shot {currentShotId}
              </h3>
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <video
                  src={analysisData.processing.keypoints_video_url}
                  controls
                  className="w-full h-full object-contain"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>Shots detected: {analysisData.processing.shots_detected}</p>
                <p>Filename: {analysisData.processing.keypoints_video_filename}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}