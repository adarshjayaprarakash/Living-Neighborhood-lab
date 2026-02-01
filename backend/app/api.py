from fastapi import APIRouter, HTTPException
from app.models import PredictionRequest, PredictionResponse, BaselineStats, UserActions, Locality, FactoryType
from app.engine import PredictionEngine
from app.chatbot import CityExpert
from typing import List, Dict
from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str
    context: dict

router = APIRouter()
engine = PredictionEngine()
expert = CityExpert()

# Sample data database (In-memory for demo)
LOCALITIES_DB = {
    "India": {
        "Kerala": {
            "Palakkad": {
                "Palakkad Town": {
                    "baseline": {
                        "aqi": 75.0,
                        "water_quality": 65.0,
                        "pollution_index": 40.0,
                        "carbon_budget": 1200.0,
                        "population": 150000
                    }
                },
                 "Chittur": {
                    "baseline": {
                        "aqi": 60.0,
                        "water_quality": 70.0,
                        "pollution_index": 30.0,
                        "carbon_budget": 1500.0,
                        "population": 80000
                    }
                }
            },
            "Ernakulam": {
                "Kochi": {
                    "baseline": {
                        "aqi": 95.0,
                        "water_quality": 50.0,
                        "pollution_index": 80.0,
                        "carbon_budget": 800.0,
                        "population": 600000
                    }
                }
            }
        }
    }
}

@router.get("/localities", response_model=Dict)
def get_localities():
    """
    Returns the hierarchy of available localities.
    """
    return LOCALITIES_DB

@router.get("/locality/{city_name}/baseline", response_model=BaselineStats)
def get_locality_baseline(city_name: str):
    # Flatten search for simplicity
    for country, states in LOCALITIES_DB.items():
        for state, districts in states.items():
            for district, cities in districts.items():
                if city_name in cities:
                    return BaselineStats(**cities[city_name]["baseline"])
                if city_name == district:
                     # Just return first city as proxy if district selected
                     first_city = list(cities.keys())[0]
                     return BaselineStats(**cities[first_city]["baseline"])

    raise HTTPException(status_code=404, detail="Locality not found")

@router.post("/predict", response_model=PredictionResponse)
def predict_outcome(request: PredictionRequest):
    """
    Generates predictions based on baseline and actions.
    """
    try:
        predictions, explanations, trees_needed = engine.predict(
            baseline=request.baseline,
            actions=request.actions,
            years=request.time_horizon_years
        )
        
        return PredictionResponse(
            locality=request.locality,
            predictions=predictions,
            explanations=explanations,
            trees_to_plant_for_happiness=trees_needed
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat")
def chat_with_expert(request: ChatRequest):
    try:
        response = expert.get_response(request.message, request.context)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
