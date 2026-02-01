from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from enum import Enum

class FactoryType(str, Enum):
    NONE = "None"
    TEXTILE = "Textile"
    CHEMICAL = "Chemical"
    ELECTRONICS = "Electronics"
    AUTOMOBILE = "Automobile"

class Locality(BaseModel):
    country: str
    state: str
    district: str
    city: str

class BaselineStats(BaseModel):
    aqi: float = Field(..., description="Air Quality Index")
    water_quality: float = Field(..., description="Water Quality Index (0-100)")
    pollution_index: float = Field(..., description="General Pollution Index")
    carbon_budget: float = Field(..., description="Remaining Carbon Budget")
    population: int = Field(..., description="Population Size")

class UserActions(BaseModel):
    build_factory: bool = False # Deprecated, use factory_type
    factory_type: FactoryType = FactoryType.NONE
    add_solar: bool = False
    trees_planted: int = 0
    trees_cut: int = 0
    increase_green_cover: bool = False # Deprecated in UI, keeping for backward compat if needed
    improve_waste_management: bool = False
    expand_public_transport: bool = False
    enforce_green_policy: bool = False

class PredictionRequest(BaseModel):
    locality: str
    baseline: BaselineStats
    actions: UserActions
    time_horizon_years: int = 20

class TimePoint(BaseModel):
    year: int
    aqi: float
    water_quality: float
    pollution_index: float
    carbon_budget: float
    health_index: float
    respiratory_risk: float
    social_inequality: float
    happiness_index: float

class PredictionResponse(BaseModel):
    locality: str
    predictions: List[TimePoint]
    explanations: List[str]
    trees_to_plant_for_happiness: int = 0
