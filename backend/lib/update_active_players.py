import json, time, sys, os
from datetime import datetime

vendor_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'vendor', 'nba_api', 'src'))
sys.path.append(vendor_path)


from nba_api.stats.static import players
from nba_api.stats.endpoints import commonplayerinfo
from sqlalchemy import create_engine, Column, Integer, String, Date, CHAR
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

class ActivePlayer(Base):
    __tablename__ = 'active_players'
    PERSON_ID = Column(Integer, primary_key=True)
    FIRST_NAME = Column(String(50))
    LAST_NAME = Column(String(50))
    DISPLAY_FIRST_LAST = Column(String(100))
    DISPLAY_LAST_COMMA_FIRST = Column(String(100))
    DISPLAY_FI_LAST = Column(String(50))
    PLAYER_SLUG = Column(String(100))
    BIRTHDATE = Column(Date)
    SCHOOL = Column(String(100))
    COUNTRY = Column(String(50))
    LAST_AFFILIATION = Column(String(100))
    HEIGHT = Column(String(10))
    WEIGHT = Column(Integer)
    SEASON_EXP = Column(Integer)
    JERSEY = Column(String(10))
    POSITION = Column(String(50))
    ROSTERSTATUS = Column(String(20))
    GAMES_PLAYED_CURRENT_SEASON_FLAG = Column(CHAR(1))
    TEAM_ID = Column(Integer)
    TEAM_NAME = Column(String(100))
    TEAM_ABBREVIATION = Column(String(10))
    TEAM_CODE = Column(String(50))
    TEAM_CITY = Column(String(50))
    PLAYERCODE = Column(String(100))
    FROM_YEAR = Column(Integer)
    TO_YEAR = Column(Integer)
    DLEAGUE_FLAG = Column(CHAR(1))
    NBA_FLAG = Column(CHAR(1))
    GAMES_PLAYED_FLAG = Column(CHAR(1))
    DRAFT_YEAR = Column(String(10))
    DRAFT_ROUND = Column(String(10))
    DRAFT_NUMBER = Column(String(10))
    GREATEST_75_FLAG = Column(CHAR(1))

CACHE_FILE = "roster_cache.json"

def get_player_info(player_id):
    info = commonplayerinfo.CommonPlayerInfo(player_id=player_id)
    result_set = info.get_dict()['resultSets'][0]
    if not result_set:
        return None
    headers = result_set['headers']
    values = result_set['rowSet'][0]
    player_info = dict(zip(headers, values))

    return player_info

def fetch_and_cache_roster():
    print("Fetching roster from NBA API...")
    active_players = players.get_active_players()
    roster = []

    for i, player in enumerate(active_players):
        try:
            data = get_player_info(player["id"])
            if data:
                roster.append(data)
            time.sleep(0.5) 
        except Exception as e:
            print(f"Error fetching {player['full_name']} ({player['id']}): {e}")
            continue

    with open(CACHE_FILE, "w") as f:
        json.dump(roster, f, indent=2)

    return roster



DATABASE_URL = "postgresql://u7btk4p5c5m73u:p8d8ff8ddeaabbc4fa6652587c63a9944594a63a232b3eba87c457007b20de8c6@cc6sr55p5nfmlu.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com:5432/d6jnenvoupkq12"

def insert_roster_into_db(roster):
    engine = create_engine(DATABASE_URL)
    Session = sessionmaker(bind=engine)
    session = Session()


    with open('roster_cache.json', 'r', encoding='utf-8') as f:
        roster = json.load(f)

    for player in roster:
        birthdate = player.get("BIRTHDATE")
        birthdate = datetime.strptime(birthdate, "%Y-%m-%dT%H:%M:%S").date() if birthdate else None

        new_player = ActivePlayer(
            PERSON_ID=player.get("PERSON_ID"),
            FIRST_NAME=player.get("FIRST_NAME"),
            LAST_NAME=player.get("LAST_NAME"),
            DISPLAY_FIRST_LAST=player.get("DISPLAY_FIRST_LAST"),
            DISPLAY_LAST_COMMA_FIRST=player.get("DISPLAY_LAST_COMMA_FIRST"),
            DISPLAY_FI_LAST=player.get("DISPLAY_FI_LAST"),
            PLAYER_SLUG=player.get("PLAYER_SLUG"),
            BIRTHDATE=birthdate,
            SCHOOL=player.get("SCHOOL"),
            COUNTRY=player.get("COUNTRY"),
            LAST_AFFILIATION=player.get("LAST_AFFILIATION"),
            HEIGHT=player.get("HEIGHT"),
            WEIGHT=player.get("WEIGHT"),
            SEASON_EXP=player.get("SEASON_EXP"),
            JERSEY=player.get("JERSEY"),
            POSITION=player.get("POSITION"),
            ROSTERSTATUS=player.get("ROSTERSTATUS"),
            GAMES_PLAYED_CURRENT_SEASON_FLAG=player.get("GAMES_PLAYED_CURRENT_SEASON_FLAG"),
            TEAM_ID=player.get("TEAM_ID"),
            TEAM_NAME=player.get("TEAM_NAME"),
            TEAM_ABBREVIATION=player.get("TEAM_ABBREVIATION"),
            TEAM_CODE=player.get("TEAM_CODE"),
            TEAM_CITY=player.get("TEAM_CITY"),
            PLAYERCODE=player.get("PLAYERCODE"),
            FROM_YEAR=player.get("FROM_YEAR"),
            TO_YEAR=player.get("TO_YEAR"),
            DLEAGUE_FLAG=player.get("DLEAGUE_FLAG"),
            NBA_FLAG=player.get("NBA_FLAG"),
            GAMES_PLAYED_FLAG=player.get("GAMES_PLAYED_FLAG"),
            DRAFT_YEAR=player.get("DRAFT_YEAR"),
            DRAFT_ROUND=player.get("DRAFT_ROUND"),
            DRAFT_NUMBER=player.get("DRAFT_NUMBER"),
            GREATEST_75_FLAG=player.get("GREATEST_75_FLAG")
        )

        session.merge(new_player)

    session.commit()
    session.close()

if __name__ == "__main__":
    roster = fetch_and_cache_roster()
    insert_roster_into_db(roster)
