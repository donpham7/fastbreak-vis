import pandas as pd
import polars as pl
import sqlalchemy
import psycopg2

import seaborn as sb



def scale(value, original_min, original_max, target_min, target_max):
    return ((value - original_min) / (original_max - original_min)) * (target_max - target_min) + target_min
BASELINE_OFFSET = 0

def player_shotchart(player, engine):
    query = """ SELECT loc_x, loc_y, shot_made FROM shots WHERE PLAYER_NAME = %s """
    shots = pd.read_sql(query, engine, params=(player,))
    shots = pl.from_pandas(shots).drop_nulls()

    original_x = (25, -25)
    original_y = (0, 50)
    target_x = (-250, 250)
    target_y = (-50, 450)

    scaled = shots.with_columns([
        (pl.col("loc_x").map_elements(lambda x: scale(x, *original_x, *target_x), return_dtype=pl.Float64)).alias("loc_x"),
        (pl.col("loc_y").map_elements(lambda y: scale(y, *original_y, *target_y), return_dtype=pl.Float64)).alias("loc_y")
    ])

    return scaled