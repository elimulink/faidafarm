import os

os.environ.setdefault("DATABASE_URL", "postgresql+psycopg://postgres:postgres@localhost:5432/faidafarm_test")
os.environ.setdefault("ENVIRONMENT", "development")
os.environ.setdefault("FRONTEND_URL", "http://localhost:5173")
