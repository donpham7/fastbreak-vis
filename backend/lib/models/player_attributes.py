import pandas as pd
import polars as pl
import sqlalchemy
import psycopg2

import seaborn as sb

feat_exc = [
    "season",
    "lg",
    "player",
    "player_id",
    "age",
    "team",
    "pos",
    "g",
    "gs",
    "mp",
    "fg_per_36_min",
    "fga_per_36_min",
    "fg_percent_per_36_min",
    "x3p_per_36_min",
    "x3pa_per_36_min",
    "x3p_percent",
    "x2p_per_36_min",
    "x2pa_per_36_min",
    "x2p_percent",
    "e_fg_percent",
    "ft_per_36_min",
    "ft_percent",
    "orb_per_36_min",
    "drb_per_36_min",
    "pf_per_36_min",
    "tov_per_36_min",

]

feat_inc = [
    "season",
    "player",
    "fta_per_36_min",
    "trb_per_36_min",
    "ast_per_36_min",
    "stl_per_36_min",
    "blk_per_36_min",
    "pts_per_36_min",
]


def player_attributes(player, season, engine):
    # SQL query
    query = "SELECT * FROM per_36_minutes"

    # Read into pandas DataFrame
    per36 = pd.read_sql(query, engine)
    per36 = pl.from_pandas(per36)
    per36_clean = per36.drop_nans().drop_nulls()
    data = per36_clean[feat_inc]
    szn = data.filter(pl.col("season") == int(season))


    def findPlayerPercentiles(group_season):
        percentiled_columns = []
        for col in group_season.columns:
            if col not in ["season", "player"]:
                rank_expr = pl.col(col).rank(method="average")
                percentile_expr = (rank_expr / pl.count() * 100).round(0).cast(pl.Int64)
                percentiled_columns.append(percentile_expr.alias(col + "_percentile"))
        
        updated_group = group_season.with_columns(percentiled_columns)
        return updated_group


    players_percentile = findPlayerPercentiles(szn)
    player_percentile = players_percentile.filter(pl.col("player") == player)
    return player_percentile



