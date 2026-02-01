import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from app.models import BaselineStats, UserActions, TimePoint, FactoryType
from typing import List, Tuple

class PredictionEngine:
    def __init__(self):
        pass

    def generate_synthetic_history(self, baseline: BaselineStats, years=10) -> pd.DataFrame:
        history = []
        current_year = 2025
        base_aqi = baseline.aqi
        base_water = baseline.water_quality
        base_carbon = baseline.carbon_budget
        
        for i in range(years):
            year = current_year - (years - i)
            aqi_noise = np.random.normal(0, 2)
            hist_aqi = base_aqi - (3 * (years - i)) + aqi_noise
            water_noise = np.random.normal(0, 2)
            hist_water = base_water + (1 * (years - i)) + water_noise
            carbon_noise = np.random.normal(0, 5)
            hist_carbon = base_carbon + (10 * (years - i)) + carbon_noise
            
            history.append({
                "year": year,
                "aqi": max(0, hist_aqi),
                "water_quality": min(100, max(0, hist_water)),
                "carbon_budget": hist_carbon
            })
            
        history.append({
            "year": current_year,
            "aqi": baseline.aqi,
            "water_quality": baseline.water_quality,
            "carbon_budget": baseline.carbon_budget
        })
        return pd.DataFrame(history)

    def calculate_impacts(self, actions: UserActions) -> dict:
        impacts = {
            "aqi_change": 2.0, 
            "water_change": -1.0, 
            "carbon_change": -5.0, 
            "health_impact": 0.0,
            "inequality_impact": 0.0,
            "happiness_base": 0.0
        }
        explanations = []

        # Factory Logic
        if actions.factory_type != FactoryType.NONE:
            if actions.factory_type == FactoryType.TEXTILE:
                impacts["water_change"] -= 5.0
                impacts["inequality_impact"] -= 1.0 # Jobs
                explanations.append("Textile factories pollute water significantly but provide jobs.")
            elif actions.factory_type == FactoryType.CHEMICAL:
                impacts["water_change"] -= 8.0
                impacts["aqi_change"] += 4.0
                impacts["health_impact"] -= 5.0
                explanations.append("Chemical plants offer high risks to health and water quality.")
            elif actions.factory_type == FactoryType.ELECTRONICS:
                impacts["carbon_change"] -= 15.0 # High energy
                impacts["aqi_change"] += 1.0
                impacts["inequality_impact"] -= 2.0 # High tech jobs
                explanations.append("Electronics manufacturing consumes high energy but boosts economy.")
            elif actions.factory_type == FactoryType.AUTOMOBILE:
                impacts["aqi_change"] += 6.0
                impacts["carbon_change"] -= 12.0
                explanations.append("Auto factories contribute heavily to air pollution.")

        # Tree Logic
        net_trees = actions.trees_planted - actions.trees_cut
        if actions.trees_cut > 0:
            impacts["aqi_change"] += (actions.trees_cut / 50.0) # Cutting trees hurts immediately
            impacts["happiness_base"] -= (actions.trees_cut / 10.0) # People are sad about lost trees
            explanations.append(f"Cutting {actions.trees_cut} trees has immediate negative effects on air and happiness.")
        
        if actions.trees_planted > 0:
            # Planting takes time to heal, but we simplify for simulation
            impacts["aqi_change"] -= (actions.trees_planted / 100.0)
            impacts["carbon_change"] += (actions.trees_planted / 20.0) 
            impacts["happiness_base"] += (actions.trees_planted / 50.0)
            explanations.append(f"Planting {actions.trees_planted} trees will gradually improve air and carbon offset.")

        # Other Actions
        if actions.add_solar:
            impacts["carbon_change"] += 3.0
            impacts["aqi_change"] -= 1.5
            explanations.append("Solar infrastructure slows carbon depletion.")

        if actions.improve_waste_management:
            impacts["water_change"] += 4.0
            impacts["health_impact"] += 1.5
            explanations.append("Better waste management improves water quality.")
            
        if actions.expand_public_transport:
            impacts["aqi_change"] -= 2.0
            impacts["inequality_impact"] -= 1.0
            explanations.append("Public transport improves social mobility.")

        if actions.enforce_green_policy:
            impacts["aqi_change"] -= 1.0
            impacts["carbon_change"] += 2.0
            explanations.append("Green policies enforce stricter standards.")

        return impacts, explanations

    def predict(self, baseline: BaselineStats, actions: UserActions, years: int) -> Tuple[List[TimePoint], List[str], int]:
        history_df = self.generate_synthetic_history(baseline)
        X = history_df[["year"]].values
        
        models = {}
        for col in ["aqi", "water_quality", "carbon_budget"]:
            model = LinearRegression()
            model.fit(X, history_df[col].values)
            models[col] = model

        impacts, explanations = self.calculate_impacts(actions)
        
        predictions = []
        current_year = 2025
        
        curr_aqi = baseline.aqi
        curr_water = baseline.water_quality
        curr_carbon = baseline.carbon_budget
        curr_inequality = 50.0

        for i in range(1, years + 1):
            future_year = current_year + i
            
            aqi_slope = models["aqi"].coef_[0]
            water_slope = models["water_quality"].coef_[0]
            carbon_slope = models["carbon_budget"].coef_[0]
            
            curr_aqi += (aqi_slope * 0.5) + impacts["aqi_change"]
            curr_water += (water_slope * 0.5) + impacts["water_change"]
            curr_carbon += (carbon_slope * 0.5) + impacts["carbon_change"]
            
            curr_aqi = max(0, curr_aqi)
            curr_water = max(0, min(100, curr_water))
            curr_carbon = max(0, curr_carbon)

            curr_health = 50 + (curr_water * 0.3) - (curr_aqi * 0.2) + impacts["health_impact"]
            curr_resp_risk = (curr_aqi / 5) - (curr_health / 10)
            curr_inequality += impacts["inequality_impact"]
            
            # Happiness Calculation
            # Factors: Health (+), Inequality (-), AQI (-), Green Cover/Trees (implicit in impacts)
            # Base 50 + Health(0.4) - Inequality(0.3) - AQI(0.1) + FactoryJobs(0.1 implicit in inequality) + TreeHappiness
            happiness = 50 + (curr_health * 0.3) - (curr_inequality * 0.3) - (curr_aqi * 0.1) + impacts["happiness_base"]
            
            curr_health = max(0, min(100, curr_health))
            curr_resp_risk = max(0, min(100, curr_resp_risk))
            curr_inequality = max(0, min(100, curr_inequality))
            happiness = max(0, min(100, happiness))

            predictions.append(TimePoint(
                year=future_year,
                aqi=round(curr_aqi, 2),
                water_quality=round(curr_water, 2),
                pollution_index=round(curr_aqi * 1.2, 2),
                carbon_budget=round(curr_carbon, 2),
                health_index=round(curr_health, 2),
                respiratory_risk=round(curr_resp_risk, 2),
                social_inequality=round(curr_inequality, 2),
                happiness_index=round(happiness, 2)
            ))
            
        # Trees recommendation
        # If happiness < 60 or AQI > 80, suggest trees.
        # Simple heuristic: 10 trees gain ~0.2 happiness/year cumulative? No, based on logic above: 
        # Planting 50 trees = +1 happiness base.
        # Desired Happiness = 80.
        # Current Happiness (end state) = H_final.
        # Deficit = 80 - H_final.
        # Needed Boost = Deficit.
        # Trees needed = needed_boost * 50.
        
        final_happiness = predictions[-1].happiness_index
        trees_needed = 0
        if final_happiness < 70:
            deficit = 70 - final_happiness
            # Plus penalty for cut trees
            trees_needed = int(deficit * 60) # E.g., deficit 10 -> 600 trees
            if actions.trees_cut > 0:
                trees_needed += int(actions.trees_cut * 1.5) # Needs to replace + more
        
        return predictions, explanations, trees_needed
