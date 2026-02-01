from app.models import BaselineStats, UserActions, TimePoint
from typing import List

class CityExpert:
    def __init__(self):
        pass

    def get_response(self, question: str, context: dict) -> str:
        """
        Context contains: 'locality', 'current_stats' (TimePoint), 'actions' (UserActions)
        """
        q = question.lower()
        stats = context.get('current_stats')
        actions = context.get('actions')
        
        # Simple keyword matching expert system
        
        if "happiness" in q:
            if stats['happiness_index'] < 50:
                return "Happiness is low due to poor environmental conditions. Try planting more trees (at least 500) or enforcing green policies to improve air quality."
            return "The community is generally happy! Maintaining green cover and social equality is key to keeping this score high."
            
        if "tree" in q or "plant" in q:
            needed = context.get('trees_needed', 0)
            if needed > 0:
                return f"We've lost significant green cover. To restore balance and happiness, I recommend planting about {needed} trees immediately."
            return "Our green cover is healthy. Planting more trees is always beneficial for long-term carbon offsetting."

        if "aqi" in q or "air" in q:
            if stats['aqi'] > 100:
                return "Air quality is dangerous. If you have factories enabled, consider switching to 'Electronics' or 'None', or turn on 'Expand Public Transport'."
            return "Air quality is acceptable. Keep expanding renewable energy to maintain this."

        if "factory" in q:
            if actions['factory_type'] == "Chemical":
                return "The Chemical factory is causing severe water pollution. This lowers the Health Index drastically."
            return "Factories boost the economy but cost environment points. Ensure you offset their emissions with Solar infrastructure."

        return "I am the City Expert. You can ask me about Happiness, AQI, Trees, or how to improve the locality."
