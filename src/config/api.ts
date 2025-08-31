// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050',
  ENDPOINTS: {
    UPLOAD_VIDEO: '/api/videos/upload',
    ANALYZE_VIDEO: '/api/videos/analyze',
      GET_VIDEO: '/api/videos',
  }
};

export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function for API calls with error handling
export const apiCall = async (endpoint: string, options: RequestInit = {}): Promise<unknown> => {
  try {
    const response = await fetch(getApiUrl(endpoint), {
      ...options,
      headers: {
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};