"""
Mindful News v2 - Configuration
"""

import os
from dotenv import load_dotenv

load_dotenv()

# ===================
# API Keys
# ===================
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

# ===================
# Supabase
# ===================
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

# ===================
# Processing Settings
# ===================
# How many hours back to fetch articles
FETCH_HOURS = int(os.getenv("FETCH_HOURS", "12"))

# Maximum raw articles to process per run
MAX_ARTICLES = int(os.getenv("MAX_ARTICLES", "50"))

# Minimum characters per synthesized article
MIN_CHARACTERS = int(os.getenv("MIN_CHARACTERS", "2000"))

# Claude model to use
CLAUDE_MODEL = "claude-sonnet-4-20250514"

# ===================
# Categories
# ===================
CATEGORIES = [
    "Diplomacy & Peace",
    "Conflict & Crisis",
    "Environment & Climate",
    "Health & Wellbeing",
    "Social Progress",
    "Science & Innovation",
    "Economy & Trade",
    "Culture & Arts",
    "Positive News",
    "World Affairs"
]

# ===================
# Positivity Scale
# ===================
# 5: Very positive - uplifting, solutions-focused, hopeful
# 4: Positive - constructive, encouraging
# 3: Neutral - balanced, factual reporting
# 2: Slightly negative - concerning but informative
# 1: Negative - conflicts, disasters, crises
