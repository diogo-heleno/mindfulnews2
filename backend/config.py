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
MAX_ARTICLES = int(os.getenv("MAX_ARTICLES", "80"))

# Maximum articles fetched per individual source (prevents any source from dominating)
MAX_ARTICLES_PER_SOURCE = int(os.getenv("MAX_ARTICLES_PER_SOURCE", "8"))

# Minimum characters per synthesized article
MIN_CHARACTERS = int(os.getenv("MIN_CHARACTERS", "2000"))

# Claude model to use
CLAUDE_MODEL = "claude-sonnet-4-20250514"

# ===================
# Categories
# ===================
CATEGORIES = [
    "Diplomacia e Paz",
    "Ambiente e Clima",
    "Saúde e Bem-estar",
    "Progresso Social",
    "Ciência e Inovação",
    "Economia e Comércio",
    "Cultura e Artes",
    "Histórias Humanas",
    "Soluções e Boas Notícias",
    "Assuntos Globais"
]

# ===================
# Positivity Scale
# ===================
# 5: Inspiradora - avanços notáveis, solidariedade, coragem humana
# 4: Positiva - desenvolvimentos construtivos, progresso visível
# 3: Equilibrada - situação complexa com desafios e respostas
# 2: Desafiante - problemas reais, com contexto de resiliência
# 1: Urgente - emergência, enquadrada com dignidade e foco na resposta

# ===================
# Source Weighting
# ===================
# Positive sources get extra weight in the balancing algorithm
POSITIVE_SOURCE_WEIGHT = int(os.getenv("POSITIVE_SOURCE_WEIGHT", "2"))
