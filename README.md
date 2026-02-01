# Locality Future Prediction System

A Digital Twin project that simulates the environmental, health, and social future of a locality based on user interventions.

## Project Structure

- `backend/`: FastAPI application with hybrid prediction engine.
- `frontend/`: React + Vite application with TailwindCSS and Recharts.

## Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18+

### 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API will run at `http://localhost:8000`.
Docs available at `http://localhost:8000/docs`.

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The UI will run at `http://localhost:5173`.

## Features

- **Dynamic Locality Selection**: Choose from hierarchical data (Country -> State -> District -> City).
- **Interactive Scenarios**: Toggle interventions like "Build Factory" or "Green Policy".
- **Realistic Modeling**: Uses a hybrid of historical trend analysis and causal logic.
- **Visualizations**: 20-year forecasts for AQI, Health, and Social Inequality.
