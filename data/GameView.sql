-- Summary
    -- Added player, season, team columns from advanced to playerstatistics
    -- Created tables player_season and player_game
    -- Created GameView which is joined on player_season and player_game stats
    -- User can select a player and season, returns all of their games and advanced stats for that player's season

-- Purpose & Overall Design
    -- Alter playerstatitics by adding derived fields (player, season, team)
    -- Rebuilds a canonical player_season table
    -- Defines a GameView that joins many player stat sources (raw + advanced/normalized)
    -- Populates player_season with eligible entries from the advanced table

-- Data governance
    -- Canonical player_season acts as a gatekeeper for row validity
    -- Enforcing control over which records make it into the view

-- Data granularity
    -- GameView targets player-game level granularity, which is very specific and useful
    -- Using player_season as the backbone ensures only validated player_season records are used in aggregation


DROP VIEW IF EXISTS GameView;
DROP TABLE IF EXISTS player_season;
DROP TABLE IF EXISTS player_game;

ALTER TABLE playerstatistics ADD COLUMN player TEXT;
UPDATE playerstatistics
    SET player = firstname || ' ' || lastname;

ALTER TABLE playerstatistics ADD COLUMN season INT;
UPDATE playerstatistics
    SET season = CASE
        WHEN EXTRACT(MONTH FROM gamedate::timestamp) >= 1
            THEN EXTRACT (YEAR FROM gamedate::timestamp)::INT
        ELSE (EXTRACT (YEAR FROM gamedate::timestamp) + 1)::INT
END;

CREATE TABLE team_lookup (
    team_name TEXT PRIMARY KEY,
    team_code TEXT UNIQUE NOT NULL
);

INSERT INTO team_lookup (team_name, team_code)
VALUES
    ('Hawks', 'ATL'),
    ('Celtics', 'BOS'),
    ('Nets', 'BKN'),
    ('Hornets', 'CHA'),
    ('Bulls', 'CHI'),
    ('Cavaliers', 'CLE'),
    ('Mavericks', 'DAL'),
    ('Nuggets', 'DEN'),
    ('Pistons', 'DET'),
    ('Warriors', 'GSW'),
    ('Rockets', 'HOU'),
    ('Pacers', 'IND'),
    ('Clippers', 'LAC'),
    ('Lakers', 'LAL'),
    ('Grizzlies', 'MEM'),
    ('Heat', 'MIA'),
    ('Bucks', 'MIL'),
    ('Timberwolves', 'MIN'),
    ('Pelicans', 'NOP'),
    ('Knicks', 'NYK'),
    ('Thunder', 'OKC'),
    ('Magic', 'ORL'),
    ('76ers', 'PHI'),
    ('Suns', 'PHX'),
    ('Trail Blazers', 'POR'),
    ('Kings', 'SAC'),
    ('Spurs', 'SAS'),
    ('Raptors', 'TOR'),
    ('Jazz', 'UTA'),
    ('Wizards', 'WAS');

ALTER TABLE playerstatistics ADD COLUMN team TEXT;
UPDATE playerstatistics p
SET team = l.team_code
FROM team_lookup l
WHERE p.playerteamname = l.team_name;


ALTER TABLE playerstatistics ADD COLUMN player_id varchar(255);
UPDATE playerstatistics
SET player_id = sub.player_id
FROM (
    SELECT LOWER(TRIM(player)) AS clean_player, player_id
    FROM advanced
     ) sub
WHERE LOWER(TRIM(playerstatistics.firstname || ' ' || playerstatistics.lastname)) = sub.clean_player;


DROP TABLE player_season;
CREATE TABLE player_season (
    season int NOT NULL,
    player varchar(255) NOT NULL,
    player_id varchar(255) NOT NULL,
    team varchar(255) NOT NULL,
    pos varchar(255) NOT NULL,
    g int NOT NULL,
    mp int NOT NULL
);

DROP TABLE player_game;
CREATE TABLE player_game (
    season int NOT NULL,
    player_id varchar(255) NOT NULL,
    game_id int NOT NULL,
    team varchar(255) NOT NULL,
    PRIMARY KEY (player_id, game_id)
);

INSERT INTO player_season (season, player, player_id, team, pos, g, mp)
SELECT season, player, player_id, team, pos, g, mp
FROM advanced
WHERE g IS NOT NULL AND mp IS NOT NULL;

INSERT INTO player_game (season, player_id, game_id, team)
SELECT DISTINCT ON (player_id, gameid)
    season, player_id, gameid, team
FROM playerstatistics
WHERE player_id IS NOT NULL AND gameid IS NOT NULL AND team IS NOT NULL;

DROP VIEW GameView;
CREATE MATERIALIZED VIEW GameView AS
    SELECT
        pg.season,
        pg.player_id,
        pg.game_id,
        pg.team,
        ps.player,
        ps.pos,
        ps.g,
        ps.mp,
        pStat.personid,
        pStat.gamedate,
        pStat.playerteamcity,
        pStat.playerteamname,
        pStat.opponentteamcity,
        pStat.opponentteamname,
        pStat.gametype,
        pStat.gamelabel,
        pStat.gamesublabel,
        pStat.seriesgamenumber,
        pStat.win,
        pStat.home,
        pStat.numminutes,
        pStat.points,
        pStat.assists,
        pStat.blocks,
        pStat.steals,
        pStat.fieldgoalsattempted,
        pStat.fieldgoalsmade,
        pStat.fieldgoalspercentage,
        pStat.threepointersattempted,
        pStat.threepointersmade,
        pStat.threepointerspercentage,
        pStat.freethrowsattempted,
        pStat.freethrowsmade,
        pStat.freethrowspercentage,
        pStat.reboundsdefensive,
        pStat.reboundsoffensive,
        pStat.reboundstotal,
        pStat.foulspersonal,
        pStat.turnovers,
        pStat.plusminuspoints,
        adv.per,
        adv.ts_percent,
        adv.x3p_ar,
        adv.f_tr,
        adv.trb_percent,
        adv.ast_percent,
        adv.stl_percent,
        adv.blk_percent,
        adv.tov_percent,
        adv.usg_percent,
        adv.ows,
        adv.dws,
        adv.ws,
        adv.ws_2,
        adv.obpm,
        adv.dbpm,
        adv.bpm,
        adv.vorp,
        p36.fg_per_36_min,
        p36.fga_per_36_min,
        p36.fg_percent AS p36_fg_percent,
        p36.x3p_per_36_min,
        p36.x3pa_per_36_min,
        p36.x3p_percent AS p36_x3p_percent,
        p36.x2p_per_36_min,
        p36.x2pa_per_36_min,
        p36.x2p_percent AS p36_x2p_percent,
        p36.e_fg_percent AS p36_e_fg_percent,
        p36.ft_per_36_min,
        p36.fta_per_36_min,
        p36.ft_percent AS p36_ft_percent,
        p36.trb_per_36_min,
        p36.ast_per_36_min,
        p36.stl_per_36_min,
        p36.blk_per_36_min,
        p36.tov_per_36_min,
        p36.pf_per_36_min,
        p36.pts_per_36_min,
        p100.fg_per_100_poss,
        p100.fga_per_100_poss,
        p100.fg_percent AS p100_fg_percent,
        p100.x3p_per_100_poss,
        p100.x3pa_per_100_poss,
        p100.x3p_percent AS p100_x3p_percent,
        p100.x2p_per_100_poss,
        p100.x2pa_per_100_poss,
        p100.x2p_percent AS p100_x2p_percent,
        p100.e_fg_percent AS p100_e_fg_percent,
        p100.ft_per_100_poss,
        p100.fta_per_100_poss,
        p100.ft_percent AS p100_ft_percent,
        p100.trb_per_100_poss,
        p100.ast_per_100_poss,
        p100.stl_per_100_poss,
        p100.blk_per_100_poss,
        p100.tov_per_100_poss,
        p100.pf_per_100_poss,
        p100.pts_per_100_poss,
        p100.o_rtg,
        p100.d_rtg,
        perG.mp_per_game,
        perG.fg_per_game,
        perG.fga_per_game,
        perG.fg_percent AS pG_fg_percent,
        perG.x3p_per_game,
        perG.x3pa_per_game,
        perG.x3p_percent AS pG_x3p_percent,
        perG.x2p_per_game,
        perG.x2pa_per_game,
        perG.x2p_percent AS pG_x2p_percent,
        perG.e_fg_percent AS pG_e_fg_percent,
        perG.ft_per_game,
        perG.fta_per_game,
        perG.ft_percent AS pG_ft_percent,
        perG.trb_per_game,
        perG.ast_per_game,
        perG.stl_per_game,
        perG.blk_per_game,
        perG.tov_per_game,
        perG.pf_per_game,
        perG.pts_per_game,
        shoot.fg_percent AS shoot_fg_percent,
        shoot.avg_dist_fga,
        shoot.percent_fga_from_x2p_range,
        shoot.percent_fga_from_x0_3_range,
        shoot.percent_fga_from_x3_10_range,
        shoot.percent_fga_from_x10_16_range,
        shoot.percent_fga_from_x16_3p_range,
        shoot.percent_fga_from_x3p_range,
        shoot.fg_percent_from_x2p_range,
        shoot.fg_percent_from_x0_3_range,
        shoot.fg_percent_from_x3_10_range,
        shoot.fg_percent_from_x10_16_range,
        shoot.fg_percent_from_x16_3p_range,
        shoot.fg_percent_from_x3p_range,
        shoot.percent_assisted_x2p_fg,
        shoot.percent_assisted_x3p_fg,
        shoot.percent_dunks_of_fga,
        shoot.num_of_dunks,
        shoot.percent_corner_3s_of_3pa,
        shoot.corner_3_point_percent,
        shoot.num_heaves_attempted,
        shoot.num_heaves_made
FROM player_game pg
JOIN playerstatistics pStat ON pg.player_id = pStat.player_id AND pg.game_id = pStat.gameid
JOIN advanced adv ON pg.season = adv.season AND pg.player_id = adv.player_id AND pg.team = adv.team
JOIN per_36_minutes p36 ON pg.season = p36.season AND pg.player_id = p36.player_id AND pg.team = p36.team
JOIN per_100_poss p100 ON pg.season = p100.season AND pg.player_id = p100.player_id AND pg.team = p100.team
JOIN player_per_game perG ON pg.season = perG.season AND pg.player_id = perG.player_id AND pg.team = perG.team
JOIN player_shooting shoot ON pg.season = shoot.season AND pg.player_id = shoot.player_id AND pg.team = shoot.team
JOIN player_season ps ON pg.season = ps.season AND pg.player_id = ps.player_id AND pg.team = ps.team;


SELECT * FROM GameView WHERE player = 'Anthony Edwards' AND season = '2025';