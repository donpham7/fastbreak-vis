import polars as pl
import pandas as pd
import psycopg2
import sqlalchemy
from sklearn.neighbors import NearestNeighbors
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

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
]

feat_inc = [
    "mp",
    "fga_per_36_min",
    "fg_percent",
    "x3pa_per_36_min",
    "x3p_percent",
    "x2pa_per_36_min",
    "x2p_percent",
    "e_fg_percent",
    "fta_per_36_min",
    "ft_percent",
    "orb_per_36_min",
    "drb_per_36_min",
    "trb_per_36_min",
    "ast_per_36_min",
    "stl_per_36_min",
    "blk_per_36_min",
    "tov_per_36_min",
    "pf_per_36_min",
    "pts_per_36_min",
]


def player_similarity(player_id, season, engine):
    # SQL query
    query = "SELECT * FROM per_36_minutes"

    # Read into pandas DataFrame
    per36 = pd.read_sql(query, engine)
    per36 = pl.from_pandas(per36)
    per36_clean = per36.drop_nans().drop_nulls()
    ids = per36_clean.drop(feat_inc)
    data = per36_clean[feat_inc]
    scaler = StandardScaler()
    knn = NearestNeighbors(n_neighbors=5, metric="euclidean")

    data_scaled = scaler.fit_transform(data)
    pl_scaled = pl.DataFrame(data_scaled, data.schema)
    mask = (pl.col("player_id") == player_id) & (pl.col("season") == int(season))
    index = ids.select(pl.arange(0, ids.height).filter(mask)).to_series()[0]
    scaled_stats = pl_scaled[index]
    knn = NearestNeighbors(n_neighbors=5, metric="euclidean")
    knn.fit(data_scaled)
    distances, indices = knn.kneighbors(scaled_stats)
    for i, (dists, idxs) in reversed(list(enumerate(zip(distances, indices)))):
        query_id = ids[i]
        neighbor_ids = ids[idxs[1:]]  # skip idx[0] (self)
        neighbor_dists = dists[1:]

        print(
            f"\nTop 3 similar rows to '{query_id["player"][0]} in {query_id["season"][0]}':"
        )
        for i, dist in enumerate(neighbor_dists):
            print(
                f"  -> ID: {neighbor_ids[i]["season"][0]}, {neighbor_ids[i]["player"][0]}, Distance: {dist:.3f}"
            )
        return neighbor_ids
