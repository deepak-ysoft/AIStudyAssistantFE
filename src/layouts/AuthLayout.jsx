import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-base-100 rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">AI Study Assistant</h1>
            <p className="text-base-content/70">Learn smarter, not harder</p>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
