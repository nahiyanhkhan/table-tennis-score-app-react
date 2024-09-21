import React, { useState, useEffect } from "react";
import "./score.css";

const TableTennisScoreCalculator = () => {
  const [gameType, setGameType] = useState("single");
  const [players, setPlayers] = useState(["Player 1", "Player 2", "", ""]);
  const [scores, setScores] = useState([0, 0]);
  const [setWins, setSetWins] = useState([0, 0]);
  const [settings, setSettings] = useState({
    pointsPerSet: 11,
    winByPoints: 2,
    bestOfSets: 5,
    servesPerRotation: 2,
    servesAfterDeuce: 1,
  });
  const [savedSettings, setSavedSettings] = useState(null);
  const [firstServeTeam, setFirstServeTeam] = useState(null);
  const [firstServePlayer, setFirstServePlayer] = useState(null);
  const [firstReceivePlayer, setFirstReceivePlayer] = useState(null);

  useEffect(() => {
    const storedSettings = localStorage.getItem("tableTennisSettings");
    if (storedSettings) {
      setSavedSettings(JSON.parse(storedSettings));
    }
  }, []);

  useEffect(() => {
    if (savedSettings) {
      setSettings(savedSettings);
    }
  }, [savedSettings]);

  const handleGameTypeChange = (e) => {
    setGameType(e.target.value);
    setPlayers(
      e.target.value === "single"
        ? ["Player 1", "Player 2", "", ""]
        : ["Player 1", "Player 2", "Player 3", "Player 4"]
    );
  };

  const handlePlayerNameChange = (index, name) => {
    const newPlayers = [...players];
    newPlayers[index] = name;
    setPlayers(newPlayers);
  };

  const handleFirstServeTeamChange = (e) => {
    setFirstServeTeam(e.target.value);
  };

  const handleFirstServePlayerChange = (e) => {
    setFirstServePlayer(e.target.value);
  };

  const handleFirstReceivePlayerChange = (e) => {
    setFirstReceivePlayer(e.target.value);
  };

  const handleScoreChange = (team, change) => {
    const newScores = [...scores];
    if (newScores[team] + change >= 0) {
      newScores[team] += change;
      setScores(newScores);

      // Check for set win
      if (
        newScores[team] >= settings.pointsPerSet &&
        newScores[team] - newScores[1 - team] >= settings.winByPoints
      ) {
        const newSetWins = [...setWins];
        newSetWins[team]++;
        setSetWins(newSetWins);
        // Reset scores
        setScores([0, 0]);
      }
    }
  };

  const handleSettingChange = (setting, value) => {
    setSettings({ ...settings, [setting]: value });
  };

  const handleSaveSettings = () => {
    localStorage.setItem("tableTennisSettings", JSON.stringify(settings));
    setSavedSettings(settings);
  };

  const handleLoadSettings = () => {
    if (savedSettings) {
      setSettings(savedSettings);
    }
  };

  const getTeamName = (team) => {
    if (gameType === "single") {
      return players[team];
    } else {
      return team === 0
        ? `${players[0]}-${players[1]}`
        : `${players[2]}-${players[3]}`;
    }
  };

  const getServeTeamPlayers = () => {
    if (firstServeTeam === "player1-player2") {
      return [players[0], players[1]];
    } else {
      return [players[2], players[3]];
    }
  };

  const getReceiveTeamPlayers = () => {
    if (firstServeTeam === "player1-player2") {
      return [players[2], players[3]];
    } else {
      return [players[0], players[1]];
    }
  };

  const getSingleServePlayer = () => {
    return [players[0], players[1]];
  };

  return (
    <div>
      <h1>Table Tennis Score Calculator</h1>

      <div>
        <label>
          <input
            type="radio"
            value="single"
            checked={gameType === "single"}
            onChange={handleGameTypeChange}
          />
          Single
        </label>
        <label>
          <input
            type="radio"
            value="double"
            checked={gameType === "double"}
            onChange={handleGameTypeChange}
          />
          Double
        </label>
      </div>
      <br />
      <div>
        {players.map((player, index) => (
          <React.Fragment key={index}>
            <input
              type="text"
              value={player}
              onChange={(e) => handlePlayerNameChange(index, e.target.value)}
              placeholder={`Player ${index + 1}`}
              disabled={gameType === "single" && index > 1}
            />
            {" || "}
            {index % 2 === 1 && <br /> && (
              <>
                <br /> <br />
              </>
            )}
          </React.Fragment>
        ))}
      </div>

      {(gameType === "single" || gameType === "double") && (
        <div>
          {gameType === "single" ? (
            <div>
              <h2>First Serve Player</h2>
              {getSingleServePlayer().map((player, index) => (
                <label key={index}>
                  <input
                    type="radio"
                    value={player}
                    checked={firstServePlayer === player}
                    onChange={handleFirstServePlayerChange}
                  />
                  {player}
                </label>
              ))}
            </div>
          ) : (
            <div>
              <h2>First Serve Team</h2>
              <label>
                <input
                  type="radio"
                  value="player1-player2"
                  checked={firstServeTeam === "player1-player2"}
                  onChange={handleFirstServeTeamChange}
                />
                {players[0]}-{players[1]}
              </label>
              <label>
                <input
                  type="radio"
                  value="player3-player4"
                  checked={firstServeTeam === "player3-player4"}
                  onChange={handleFirstServeTeamChange}
                />
                {players[2]}-{players[3]}
              </label>

              <h2>First Serve Player</h2>
              {getServeTeamPlayers().map((player, index) => (
                <label key={index}>
                  <input
                    type="radio"
                    value={player}
                    checked={firstServePlayer === player}
                    onChange={handleFirstServePlayerChange}
                  />
                  {player}
                </label>
              ))}

              <h2>First Receive Player</h2>
              {getReceiveTeamPlayers().map((player, index) => (
                <label key={index}>
                  <input
                    type="radio"
                    value={player}
                    checked={firstReceivePlayer === player}
                    onChange={handleFirstReceivePlayerChange}
                  />
                  {player}
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      <div>
        <h2>Score</h2>
        <div>
          <span>{getTeamName(0)}: </span>
          <button
            onClick={() => handleScoreChange(0, -1)}
            disabled={scores[0] === 0}
          >
            -
          </button>
          <span> {scores[0]} </span>
          <button onClick={() => handleScoreChange(0, 1)}>+</button>
        </div>
        <br />
        <div>
          <span>{getTeamName(1)}: </span>
          <button
            onClick={() => handleScoreChange(1, -1)}
            disabled={scores[1] === 0}
          >
            -
          </button>
          <span> {scores[1]} </span>
          <button onClick={() => handleScoreChange(1, 1)}>+</button>
        </div>
      </div>

      <div>
        <h3>Set Wins</h3>
        <span>
          {getTeamName(0)}: {setWins[0]}
        </span>
        <br />
        <br />
        <span>
          {getTeamName(1)}: {setWins[1]}
        </span>
      </div>

      <div>
        <h2>Settings</h2>
        <label>
          Set to:{" "}
          <input
            type="number"
            value={settings.pointsPerSet}
            onChange={(e) =>
              handleSettingChange("pointsPerSet", parseInt(e.target.value))
            }
          />{" "}
          points
        </label>
        <br />
        <br />
        <label>
          Win by:{" "}
          <input
            type="number"
            value={settings.winByPoints}
            onChange={(e) =>
              handleSettingChange("winByPoints", parseInt(e.target.value))
            }
          />{" "}
          points
        </label>
        <br />
        <br />
        <label>
          Match: Best of:{" "}
          <input
            type="number"
            value={settings.bestOfSets}
            onChange={(e) =>
              handleSettingChange("bestOfSets", parseInt(e.target.value))
            }
          />{" "}
          sets
        </label>
        <br />
        <br />
        <label>
          Serve rotation after:{" "}
          <input
            type="number"
            value={settings.servesPerRotation}
            onChange={(e) =>
              handleSettingChange("servesPerRotation", parseInt(e.target.value))
            }
          />{" "}
          serves
        </label>
        <br />
        <br />
        <label>
          Serve rotation after deuce:{" "}
          <input
            type="number"
            value={settings.servesAfterDeuce}
            onChange={(e) =>
              handleSettingChange("servesAfterDeuce", parseInt(e.target.value))
            }
          />{" "}
          points
        </label>
        <br />
        <br />
        <button onClick={handleSaveSettings}>Save Settings</button>
        <br />
        <br />
        <button onClick={handleLoadSettings}>Load Saved Settings</button>
      </div>
    </div>
  );
};

export default TableTennisScoreCalculator;
