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
    <div className="flex flex-col h-full space-y-4">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-base-300 bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 p-8">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2 flex gap-3">
            <MdTimer className="text-primary" /> Pomodoro Timer
          </h1>
          <p className="text-base-content/70">
            Stay focused with the Pomodoro Technique
          </p>
        </div>
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
      </div>
      <div className="rounded-3xl border border-base-300 bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 p-8 h-[calc(80vh-100px)]">
        <div className="space-y-6">
          {/* TIMER */}
          <div className="lg:col-span-1 flex justify-center items-start">
            <div className="relative w-full max-w-xs py-16 rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br from-primary to-secondary p-8">
              {/* Glow */}
              <div className="absolute inset-0 bg-black/10" />

              <div className="relative text-center space-y-6">
                <h2 className="text-primary-content text-2xl font-bold tracking-wide">
                  {isWorkTime ? "Focus Time" : "Break Time"}
                </h2>

                <div className="text-6xl font-mono font-extrabold text-primary-content">
                  {String(minutes).padStart(2, "0")}:
                  {String(secs).padStart(2, "0")}
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-3">
                  <button
                    onClick={toggleTimer}
                    className="btn btn-outline btn-primary-content rounded-full px-6"
                  >
                    {isActive ? "Pause" : "Start"}
                  </button>

                  <button
                    onClick={resetTimer}
                    className="btn btn-outline btn-primary-content rounded-full px-6"
                  >
                    Reset
                  </button>
                </div>

                <p className="text-primary-content/90 text-sm">
                  Sessions completed:{" "}
                  <span className="font-semibold">{sessions}</span>
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* STATS */}
            <div className="card bg-primary/35 shadow-lg rounded-3xl">
              <div className="card-body">
                <h2 className="card-title">Today's Stats</h2>

                <div className="space-y-2 text-sm">
                  <p className="flex justify-between">
                    <span className="text-base-content/70">
                      Total Focus Time
                    </span>
                    <span className="font-semibold">2h 30m</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-base-content/70">Sessions</span>
                    <span className="font-semibold">{sessions}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-base-content/70">Current Streak</span>
                    <span className="font-semibold">7 days</span>
                  </p>
                </div>
              </div>
            </div>

            {/* TIPS */}
            <div className="card bg-primary/35 shadow-lg rounded-3xl">
              <div className="card-body">
                <h2 className="card-title">Focus Tips</h2>

                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <span className="text-success">✓</span>
                    Eliminate distractions during focus time
                  </li>
                  <li className="flex gap-2">
                    <span className="text-success">✓</span>
                    Use break time to stretch and hydrate
                  </li>
                  <li className="flex gap-2">
                    <span className="text-success">✓</span>
                    After 4 sessions, take a longer break
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
