import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))

from app.database.base import Base

# Import ALL models
import app.models

target_metadata = Base.metadata