from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "ASCLEPIUS"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    
    # Database
    SQLITE_URL: str = "sqlite:///./asclepius.db"
    
    # LLM/ADK Settings
    GOOGLE_API_KEY: str | None = None
    
    # Development Settings
    DEBUG: bool = True

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

settings = Settings()
