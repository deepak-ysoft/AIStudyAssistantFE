import { useState, useEffect, useRef } from "react";
import { MdTimer } from "react-icons/md";
import PageHeader from "../../components/PageHeader";
import { pomodoroApi } from "../../api/pomodoroApi";
import { IoCheckmarkDoneSharp } from "react-icons/io5";

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

export default function PomodoroPage() {
  const [seconds, setSeconds] = useState(WORK_TIME);
  const [isActive, setIsActive] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [sessions, setSessions] = useState(0);
  const [stats, setStats] = useState(null);
  const sessionIdRef = useRef(null);

  /* -------------------- TIMER -------------------- */
  useEffect(() => {
    let interval = null;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    }

    if (seconds === 0 && isActive) {
      completeSession();
    }

    return () => clearInterval(interval);
  }, [isActive, seconds]);

  /* -------------------- API -------------------- */
  const startSession = async () => {
    try {
      const res = await pomodoroApi.startSession({
        type: isWorkTime ? "WORK" : "BREAK",
        duration: isWorkTime ? WORK_TIME : BREAK_TIME,
      });

      sessionIdRef.current = res.data.data._id;
      setIsActive(true);
    } catch (err) {
      console.error(err);
    }
  };

  const completeSession = async () => {
    try {
      setIsActive(false);

      if (sessionIdRef.current) {
        await pomodoroApi.endSession({
          sessionId: sessionIdRef.current,
        });
      }

      if (isWorkTime) {
        setSessions((prev) => prev + 1);
      }

      setIsWorkTime(!isWorkTime);
      setSeconds(isWorkTime ? BREAK_TIME : WORK_TIME);
      sessionIdRef.current = null;

      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await pomodoroApi.getTodayStats();
      setStats(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  /* -------------------- UI HELPERS -------------------- */
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  const resetTimer = () => {
    setIsActive(false);
    setIsWorkTime(true);
    setSeconds(WORK_TIME);
    sessionIdRef.current = null;
  };

  /* -------------------- UI -------------------- */
  return (
    <div>
      <PageHeader
        icon={MdTimer}
        title="Pomodoro Timer"
        content="Boost productivity with focused work sessions"
      />

      <div className="rounded-3xl border border-base-300 bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 p-6">
        <div className="grid grid-cols-1 gap-6">
          {/* TIMER CARD */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-xs py-16 rounded-3xl shadow-xl bg-gradient-to-br from-primary to-secondary text-center">
              <h2 className="text-primary-content text-2xl font-bold">
                {isWorkTime ? "Focus Time" : "Break Time"}
              </h2>

              <div className="text-6xl font-mono font-extrabold text-primary-content mt-6">
                {String(minutes).padStart(2, "0")}:
                {String(secs).padStart(2, "0")}
              </div>

              <div className="flex justify-center gap-3 mt-6">
                {!isActive ? (
                  <button
                    onClick={startSession}
                    className="btn btn-outline btn-primary-content rounded-full px-6"
                  >
                    Start
                  </button>
                ) : (
                  <button
                    onClick={() => setIsActive(false)}
                    className="btn btn-outline btn-primary-content rounded-full px-6"
                  >
                    Pause
                  </button>
                )}

                <button
                  onClick={resetTimer}
                  className="btn btn-outline btn-primary-content rounded-full px-6"
                >
                  Reset
                </button>
              </div>

              <p className="text-primary-content/80 text-sm mt-4">
                Sessions completed:{" "}
                <span className="font-semibold">{sessions}</span>
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* STATS */}
            <div className="card bg-primary/30 shadow-lg rounded-3xl">
              <div className="card-body">
                <h2 className="card-title">Today's Stats</h2>

                <div className="space-y-2 text-sm mt-2">
                  <p className="flex justify-between">
                    <span>Total Focus Time</span>
                    <span className="font-semibold">
                      {stats
                        ? `${Math.floor(stats.totalFocusSeconds / 60)} min`
                        : "--"}
                    </span>
                  </p>

                  <p className="flex justify-between">
                    <span>Sessions</span>
                    <span className="font-semibold">
                      {stats?.sessions ?? 0}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* TIPS */}
            <div className="card bg-primary/30 shadow-lg rounded-3xl">
              <div className="card-body">
                <h2 className="card-title">Focus Tips</h2>
                <ul className="space-y-2 text-sm mt-2">
                  <li className="flex gap-4">
                    <IoCheckmarkDoneSharp className="text-primary text-lg" />{" "}
                    Remove distractions
                  </li>
                  <li className="flex gap-4">
                    <IoCheckmarkDoneSharp className="text-primary text-lg" />{" "}
                    Stretch during breaks
                  </li>
                  <li className="flex gap-4">
                    <IoCheckmarkDoneSharp className="text-primary text-lg" />{" "}
                    After 4 sessions, take a long break
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
