#Breezy - Full Stack Weather App

Breezy is a full-stack weather application that provides real-time weather updates and customized weather descriptions using advanced AI. It utilizes React.js and Tailwind CSS for the front end, Node.js/Express for the backend API, OpenWeatherMap for weather data, and Gemini AI to create personalized weather descriptions.

Features
Real-time weather updates from the OpenWeatherMap API.
AI-generated weather descriptions based on current weather conditions powered by Gemini AI.
Responsive and modern UI built with React.js and Tailwind CSS.
Docker containerization for seamless deployment and local testing.
Deployed on Google Cloud Run.

Tech Stack
Frontend: React.js, Tailwind CSS
Backend: Node.js, Express.js
Weather API: OpenWeatherMap API
AI: Gemini AI for weather descriptions
Containerization: Docker
Deployment: Google Cloud Run

Installation
Prerequisites
Node.js (v14 or above)
Docker (for containerization)
A Google Cloud account (for deployment)
OpenWeatherMap API key
Gemini AI API key

1. Clone the repository
git clone https://github.com/your-username/breezy.git
cd breezy
2. Set up the frontend
Navigate to the /breezy folder and install dependencies:
cd breezy
npm install
3. Set up the backend
cd backend
npm install
4. Environment Variables
Create a .env file in the root of the project and add the following environment variables:
REACT_APP_WEATHER_API_KEY=your_openweathermap_api_key
GEMINI_AI_API_KEY=your_gemini_ai_api_key
PORT=8080
5. Running Locally
To run locally change the backendUrl in App.jsx and AIDescription to http://localhost:8080/
then then containerize the backend and front end in the root directory run
docker-compose up --build