import { useEffect, useMemo, useState } from "react";
import "./App.css";

const MIN_POINTS = 1;
const DEFAULT_POINTS = 5;

const distanceBetween = (x1, y1, x2, y2) => {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
};

const generateRandomPoints = (count) => {
  const generated = [];
  const safeCount = Math.max(MIN_POINTS, Number(count) || DEFAULT_POINTS);

  const minDistance =
    safeCount <= 10
      ? 14
      : safeCount <= 30
      ? 10
      : safeCount <= 80
      ? 7
      : 4;

  for (let i = 1; i <= safeCount; i++) {
    let top = 0;
    let left = 0;

    let validPosition = false;
    let attempts = 0;

    while (!validPosition && attempts < 3000) {
      top = Math.random() * 90 + 5;
      left = Math.random() * 90 + 5;

      validPosition = true;

      for (const point of generated) {
        const distance = distanceBetween(
          left,
          top,
          point.rawLeft,
          point.rawTop
        );

        if (distance < minDistance) {
          validPosition = false;
          break;
        }
      }

      attempts++;
    }

    generated.push({
      id: i,
      label: String(i),
      top: `${top}%`,
      left: `${left}%`,
      rawTop: top,
      rawLeft: left,
    });
  }

  return generated;
};

const getPointSize = (count) => {
  if (count <= 5) return 64;
  if (count <= 10) return 58;
  if (count <= 20) return 50;
  if (count <= 40) return 42;
  if (count <= 80) return 34;
  return 28;
};

export default function App() {
  const [pointsInput, setPointsInput] = useState(DEFAULT_POINTS);

  const [gameCount, setGameCount] = useState(DEFAULT_POINTS);

  const [points, setPoints] = useState([]);

  const [nextExpected, setNextExpected] = useState(1);

  const [isCleared, setIsCleared] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const [time, setTime] = useState(0);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);

  const [fadingPoints, setFadingPoints] = useState([]);


  const [hasStarted, setHasStarted] = useState(false);


  const nextHint = useMemo(() => {
    if (isCleared || isGameOver) {return "-";}
    return nextExpected;}, [nextExpected, isCleared, isGameOver]);

  const pointSize = useMemo(() => {
    return getPointSize(gameCount);
  }, [gameCount]);

  const boardStyle = useMemo(() => {
    return {
      "--point-size": `${pointSize}px`,
    };
  }, [pointSize]);

  useEffect(() => {
    if (!hasStarted) return;
    if (isCleared) return;
    if (isGameOver) return;

    const timer = setInterval(() => {
      setTime((prev) => +(prev + 0.1).toFixed(1));
    }, 100);
    return () => clearInterval(timer);
  }, [hasStarted, isCleared, isGameOver]);

  useEffect(() => {
    if (!hasStarted) return;
    if (!autoPlayEnabled) return;
    if (isCleared) return;
    if (isGameOver) return;
    if (nextExpected > gameCount) return;

    const autoTimer = setTimeout(() => {
      handlePointClick(nextExpected, true);
      
    }, 600);
    return () => clearTimeout(autoTimer);
  }, [nextExpected, autoPlayEnabled, isCleared, isGameOver, hasStarted, gameCount]);


  const startGame = () => {
    const normalized = Math.max(
      MIN_POINTS,
      Number(pointsInput) || DEFAULT_POINTS
    );

    setGameCount(normalized);

    const generatedPoints = generateRandomPoints(normalized);

    setPoints(generatedPoints);

    setNextExpected(1);

    setIsCleared(false);
    setIsGameOver(false);

    setTime(0);

    setHasStarted(true);
    setAutoPlayEnabled(false);

    setFadingPoints([]);
  };

  const handleRestart = () => {
    if (!hasStarted) {
      setHasStarted(true);
    }

    startGame();
  };

  const handlePointClick = (id, isAutoPlayClick = false) => {
  if (!hasStarted) return;

  if (isCleared) return;
  if (isGameOver) return;

  if (!isAutoPlayClick && autoPlayEnabled) return;

  if (id !== nextExpected) {
    if(!isAutoPlayClick) {
      setIsGameOver(true);
    }
    return;
  }


  setNextExpected((prev) => prev + 1);

  if (id === gameCount) {
    setIsCleared(true);
  }


  setFadingPoints((prev) => [
    ...prev,
    {
      id,
      timeLeft: 2,
    },
  ]);

  const fadeInterval = setInterval(() => {
    setFadingPoints((prev) =>
      prev
        .map((point) => {
          if (point.id === id) {
            return {
              ...point,
              timeLeft: +(point.timeLeft - 0.1).toFixed(1),
            };
          }

          return point;
        })
        .filter((point) => point.timeLeft > 0)
    );
  }, 100);


  setTimeout(() => {
    clearInterval(fadeInterval);

    setPoints((prev) =>
      prev.filter((point) => point.id !== id)
    );
  }, 2000);
};

  const handlePointsInputChange = (e) => {
    let value = e.target.value;

    value = value.replace(/[^0-9]/g, "");

    if (value === "") {
      setPointsInput("");
      return;
    }

    const numericValue = Math.max(MIN_POINTS, Number(value));

    setPointsInput(numericValue);
  };
  const handlePointsInputBlur = () => {
    if (pointsInput === "") {
      setPointsInput(DEFAULT_POINTS);
    }
  };
  const handleFakeAutoplayButton = () => {
    setAutoPlayEnabled((prev) => !prev);
  };


  return (
    <div className="app-shell">
      <div className="game-card">
          <h1 className={`title ${isCleared ? "title-cleared" : ""} ${isGameOver ? "title-game-over" : ""}`}>
            {isCleared
              ? "ALL CLEARED!"
              : isGameOver
              ? "GAME OVER"
              : "LET'S PLAY!"}
          </h1>
          <div className="top-panel">
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Points</span>

                <input
                  className="points-input"
                  type="text"
                  inputMode="numeric"
                  placeholder={DEFAULT_POINTS}
                  value={pointsInput}
                  onChange={handlePointsInputChange}
                  onBlur={handlePointsInputBlur}
                />
              </div>

              <div className="info-item">
                <span className="label">Time</span>

                <span className="time-value">
                  {time.toFixed(1)}s
                </span>
              </div>
            </div>

            <div className="button-row">
              <button className="btn primary-btn" onClick={handleRestart}>
                {hasStarted ? "Restart" : "Play"}
              </button>

              {hasStarted && (
                <button
                  className={`btn auto-btn ${
                    autoPlayEnabled ? "auto-on" : "auto-off"
                  }`}
                  onClick={handleFakeAutoplayButton}
                >
                  AutoPlay: {autoPlayEnabled ? "ON" : "OFF"}
                </button>
              )}
            </div>
          </div>
        <div className="board" style={boardStyle}>
          {points.map((point) => {
            const fadingData = fadingPoints.find(
              (item) => item.id === point.id
            );

            const isFading = !!fadingData;

            const timeLeft = fadingData?.timeLeft || 0;

            const opacity = isFading
              ? Math.max(timeLeft / 2, 0)
              : 1;

            return (
              <button
                key={point.id}
                className="point"
                style={{
                  top: point.top,
                  left: point.left,
                  opacity,
                }}
                onClick={() => handlePointClick(point.id)}
              >
                <span className="point-number">
                  {point.label}
                </span>

                {isFading && (
                  <span className="point-timer">
                    {timeLeft.toFixed(1)}s
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="bottom-hint">
          <span className="label">Next:</span>

          <span className="next-value">{nextHint}</span>
        </div>


      </div>
    </div>
  );
}