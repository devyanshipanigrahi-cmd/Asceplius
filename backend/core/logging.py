import logging
import sys

def setup_logging() -> None:
    """Initialize system-wide logging for ASCLEPIUS."""
    logging.basicConfig(
        stream=sys.stdout,
        level=logging.INFO,
        format="%(asctime)s - [%(levelname)s] - %(name)s: %(message)s",
        datefmt="%Y-%m-%dT%H:%M:%S%z"
    )

def get_logger(name: str) -> logging.Logger:
    """Get a pre-configured logger instance."""
    return logging.getLogger(name)
