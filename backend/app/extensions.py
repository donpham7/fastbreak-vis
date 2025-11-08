from flask_caching import Cache
import sqlalchemy
from app.config import Config

cache = Cache()
engine = sqlalchemy.create_engine(Config.DATABASE_URL)
