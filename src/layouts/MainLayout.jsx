import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function MainLayout() {
  return (
    <div className="drawer md:drawer-open h-screen bg-base-100">
      {/* REQUIRED TOGGLE */}
      <input id="main-drawer" type="checkbox" className="drawer-toggle" />

      {/* PAGE CONTENT */}
      <div className="drawer-content flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto">
          <div className="px-4 md:px-6 lg:px-8 py-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* SIDEBAR */}
      <div className="drawer-side z-40">
        <label htmlFor="main-drawer" className="drawer-overlay" />
        <Sidebar />
      </div>
    </div>
  );
}
