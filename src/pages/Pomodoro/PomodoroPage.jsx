import { useState, useEffect } from "react";
import { MdTimer } from "react-icons/md";

export default function PomodoroPage() {
  const WORK_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;

  const [seconds, setSeconds] = useState(WORK_TIME);
  const [isActive, setIsActive] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [sessions, setSessions] = useState(0);

  useEffect(() => {
    let interval = null;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
      }, 1000);
    } else if (seconds === 0 && isActive) {
      setIsWorkTime(!isWorkTime);
      setSeconds(isWorkTime ? BREAK_TIME : WORK_TIME);
      if (!isWorkTime) {
        setSessions(sessions + 1);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, seconds, isWorkTime, sessions]);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setSeconds(WORK_TIME);
    setIsWorkTime(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <MdTimer className="text-blue-600" /> Pomodoro Timer
        </h1>
        <p className="text-base-content/70">
          Stay focused with the Pomodoro Technique
        </p>
      </div>

      <div className="flex justify-center items-center">
        <div className="card bg-gradient-to-r from-primary to-secondary shadow-xl p-8">
          <div className="card-body text-center">
            <h2 className="text-primary-content mb-4 text-2xl font-bold">
              {isWorkTime ? "Focus Time" : "Break Time"}
            </h2>
            <div className="text-6xl font-bold text-primary-content mb-8 font-mono">
              {String(minutes).padStart(2, "0")}:{String(secs).padStart(2, "0")}
            </div>
            <div className="flex gap-4 justify-center mb-6">
              <button
                onClick={toggleTimer}
                className="btn btn-lg btn-outline text-primary-content border-primary-content hover:bg-primary-content hover:text-primary"
              >
                {isActive ? "Pause" : "Start"}
              </button>
              <button
                onClick={resetTimer}
                className="btn btn-lg btn-outline text-primary-content border-primary-content hover:bg-primary-content hover:text-primary"
              >
                Reset
              </button>
            </div>
            <p className="text-primary-content text-lg">
              Sessions Completed: <span className="font-bold">{sessions}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-base-200 shadow-md">
          <div className="card-body">
            <h2 className="card-title">Today's Stats</h2>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Total Focus Time:</span> 2h 30m
              </p>
              <p>
                <span className="font-semibold">Sessions:</span> {sessions}
              </p>
              <p>
                <span className="font-semibold">Current Streak:</span> 7 days
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-md">
          <div className="card-body">
            <h2 className="card-title">Tips</h2>
            <ul className="space-y-2 text-sm">
              <li>✓ Eliminate distractions during focus time</li>
              <li>✓ Use break time to stretch and hydrate</li>
              <li>✓ After 4 sessions, take a longer break</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
