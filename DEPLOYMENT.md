# Deployment Instructions

## Backend Configuration

### Development (Local Backend)
1. Keep the current `.env` configuration:
   ```
   VITE_API_BASE_URL="http://localhost:8000"
   ```

### Production (VPS Backend)
1. Update your `.env` file with your VPS URL:
   ```
   VITE_API_BASE_URL="https://your-vps-domain.com"
   # OR if using IP with port:
   VITE_API_BASE_URL="http://your-vps-ip:8000"
   ```

## Required Backend Endpoints

Your backend needs to implement these endpoints:

### 1. Check User Plan
- **URL**: `/api/check-user-plan`
- **Method**: `POST`
- **Body**: `{ "email": "user@example.com" }`
- **Response**: `{ "plan": "pro" | "normal", "total_analyses": number }`

### 2. Upload Video
- **URL**: `/api/upload-video`  
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Body**:
  ```
  video: File
  email: string
  gender: "men" | "women"
  handedness: "righty" | "lefty"
  experience_level: "beginner" | "intermediate" | "advanced"
  shot_type: "forehand" | "backhand_1h" | "backhand_2h" | "serve"
  ```
- **Response**: Analysis result object

## CORS Configuration

Make sure your backend allows CORS from your frontend domain:

```python
# For FastAPI
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://your-frontend-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Build and Deploy Frontend

1. Update environment variables for production
2. Build the frontend:
   ```bash
   npm run build
   ```
3. Deploy the `dist` folder to your hosting service (Vercel, Netlify, etc.)

## Testing the Connection

1. Check if your backend is running and accessible
2. Test the endpoints manually with curl or Postman
3. Update the frontend configuration
4. Test the full upload flow