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
    "fg_per_36_min",
    "fga_per_36_min",
    "fg_percent_per_36_min",
    "x3p_per_36_min",
    "x3pa_per_36_min",
    "x3p_percent",
    "x2p_per_36_min",
    "x2pa_per_36_min",
    "x2p_percent",
    "ft_per_36_min",
    "ft_percent",
    "orb_per_36_min",
    "drb_per_36_min",

]

feat_inc = [
    "season",
    "player",
    "pos",
    "fta_per_36_min",
    "trb_per_36_min",
    "ast_per_36_min",
    "stl_per_36_min",
    "blk_per_36_min",
    "pts_per_36_min",
    "tov_per_36_min",
    "pf_per_36_min",
    "ts_percent",
    "p36_e_fg_percent"

    # "e_fg_percent",
    # "mp"

]


def player_attributes(player, season, scope, engine):

    if scope == "overall":
        query = """ SELECT player, fta_per_36_min, trb_per_36_min, ast_per_36_min, stl_per_36_min, blk_per_36_min, pts_per_36_min, tov_per_36_min, pf_per_36_min, ts_percent, p36_e_fg_percent FROM GameView WHERE season = %s """
        df = pd.read_sql(query, engine, params=(season,))

    else:
        pos_query = """ SELECT pos FROM GameView WHERE player = %s AND season = %s LIMIT 1 """
        pos_df = pd.read_sql(pos_query, engine, params=(player, season))
        pos = pos_df.iloc[0]["pos"]
        query = """ SELECT player, fta_per_36_min, trb_per_36_min, ast_per_36_min, stl_per_36_min, blk_per_36_min, pts_per_36_min, tov_per_36_min, pf_per_36_min, ts_percent, p36_e_fg_percent FROM GameView WHERE season = %s AND pos = %s """
        df = pd.read_sql(query, engine, params=(season, pos))


    pl_df = pl.from_pandas(df)
    data = pl_df.drop_nans().drop_nulls()

    # z-score each component
    data = data.with_columns([
        ((pl.col("ast_per_36_min") - pl.col("ast_per_36_min").mean()) / pl.col("ast_per_36_min").std()).alias("ast_z"),
        ((pl.col("tov_per_36_min") - pl.col("tov_per_36_min").mean()) / pl.col("tov_per_36_min").std()).alias("tov_z"),
        ((pl.col("trb_per_36_min") - pl.col("trb_per_36_min").mean()) / pl.col("trb_per_36_min").std()).alias("trb_z"),
        ((pl.col("pf_per_36_min") - pl.col("pf_per_36_min").mean()) / pl.col("pf_per_36_min").std()).alias("pf_z"),
        ((pl.col("stl_per_36_min") - pl.col("stl_per_36_min").mean()) / pl.col("stl_per_36_min").std()).alias("stl_z"),
        ((pl.col("blk_per_36_min") - pl.col("blk_per_36_min").mean()) / pl.col("blk_per_36_min").std()).alias("blk_z"),
        ((pl.col("ts_percent") - pl.col("ts_percent").mean()) / pl.col("ts_percent").std()).alias("ts_z"),
        ((pl.col("p36_e_fg_percent") - pl.col("p36_e_fg_percent").mean()) / pl.col("p36_e_fg_percent").std()).alias("efg_z")


    ])

    # maybe add weights?
    data = data.with_columns([
        (pl.col("ast_z") / pl.col("tov_z")).alias("playmaking_per_36_min"),
        (pl.col("trb_z") + pl.col("pf_z")).alias("offensiveaggression_per_36_min"),
        (pl.col("stl_z") + pl.col("pf_z") + pl.col("blk_z")).alias("defensiveaggression_per_36_min"),
        (pl.col("ts_z") + pl.col("efg_z")).alias("shooting_per_36_min")

    ])

    data = data.drop(["ast_z", "tov_z", "trb_z", "pf_z", "stl_z", "blk_z", "ts_z", "efg_z", "ts_percent", "p36_e_fg_percent"])

    def findPlayerPercentiles(group_season):
        percentiled_columns = []
        for col in group_season.columns:
            if col not in ["season", "player"]:
                rank_expr = pl.col(col).rank(method="average")
                percentile_expr = (rank_expr / pl.count() * 100).round(0).cast(pl.Int64)
                percentiled_columns.append(percentile_expr.alias(col + "_percentile"))
        
        updated_group = group_season.with_columns(percentiled_columns)
        return updated_group


    players_percentile = findPlayerPercentiles(data)
    player_percentile = players_percentile.filter(pl.col("player") == player)
    return player_percentile



