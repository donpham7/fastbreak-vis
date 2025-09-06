import torch
import torch.nn as nn
import torch.nn.functional as F
import polars as pl
import pandas as pd


class GamePredModel(nn.Module):
    def __init__(self, input_dim=420, hidden_dim=4096, output_dim=360, n_components=3):
        super().__init__()
        self.output_dim = output_dim
        self.n_components = n_components

        self.hidden = nn.Sequential(
            nn.Linear(input_dim, hidden_dim), nn.ReLU(), nn.Dropout(0.4)
        )
        self.hidden1 = nn.Sequential(nn.Linear(hidden_dim, hidden_dim), nn.ReLU())
        self.hidden2 = nn.Sequential(nn.Linear(hidden_dim, hidden_dim), nn.ReLU())

        # MDN output heads
        self.pi = nn.Linear(hidden_dim, output_dim * n_components)
        self.mu = nn.Linear(hidden_dim, output_dim * n_components)
        self.sigma = nn.Linear(hidden_dim, output_dim * n_components)

    def forward(self, x):
        h = self.hidden(x)
        h = self.hidden1(h)
        h = self.hidden2(h)
        # (B, D, K)
        pi = self.pi(h).view(-1, self.output_dim, self.n_components)
        pi = F.softmax(pi, dim=-1)  # mixture weights sum to 1

        mu = self.mu(h).view(-1, self.output_dim, self.n_components)

        # Use softplus instead of exp for numerical stability and avoid exploding std
        sigma = (
            F.softplus(self.sigma(h).view(-1, self.output_dim, self.n_components))
            + 1e-6
        )  # ensure strictly positive

        return pi, mu, sigma


def mdn_loss(pi, mu, sigma, target, eps=1e-8):
    """
    pi: (B, D, K) — mixture weights (sum to 1)
    mu: (B, D, K) — means
    sigma: (B, D, K) — stds (positive)
    target: (B, D)
    """
    B, D, K = pi.shape
    target = target.unsqueeze(-1)  # (B, D, 1)

    # Log prob of normal distribution
    log_probs = -0.5 * (
        ((target - mu) / sigma) ** 2
        + torch.log(torch.tensor(2 * torch.pi))
        + 2 * torch.log(sigma)
    )  # (B, D, K)

    # Weighted log sum: log(sum_k pi_k * N_k)
    log_pi = torch.log(pi + eps)
    log_mix = log_pi + log_probs  # (B, D, K)

    log_sum = torch.logsumexp(log_mix, dim=-1)  # (B, D)

    return -log_sum.mean()


def get_players_from_game(game_id, game_csv_path, player_stats_path):
    games = pl.read_csv(game_csv_path)
    player_stats = pl.read_csv(player_stats_path)
    print(player_stats.schema)
    encodedHome = games.filter(pl.col("gameId") == game_id).select("encodedHomeTeam")[
        0, "encodedHomeTeam"
    ]
    encodedAway = games.filter(pl.col("gameId") == game_id).select("encodedAwayTeam")[
        0, "encodedAwayTeam"
    ]
    print(encodedHome, encodedAway)

    home_players = (
        player_stats.filter(
            (pl.col("gameId") == game_id) & (pl.col("encodedTeam") == encodedHome)
        )
        .sort(by="numMinutes", descending=True)
        .limit(15)
        .select("personId")
    )

    away_players = (
        player_stats.filter(
            (pl.col("gameId") == game_id) & (pl.col("encodedTeam") == encodedAway)
        )
        .sort(by="numMinutes", descending=True)
        .limit(15)
        .select("personId")
    )

    return home_players, away_players


def players_and_stats(raw_stats, game_id, data):
    # Get player IDs for this game
    ids = data[data["game_id"] == game_id].iloc[0, 4:34].values  # shape (30,)
    stats_df = pd.DataFrame({'personId': ids})

    # Assume raw_stats is a (1, m*30) numpy array
    n_players = 30
    stats = ["points", "assists", "blocks", "steals", "rebounds"]
    n_stats = 5
    stats_matrix = raw_stats.reshape(n_stats, n_players).T

    # Add each stat as a column to stats_df
    for i in range(len(stats)):
        stats_df[stats[i]] = stats_matrix[:, i]

    print(stats_df)
    return stats_df