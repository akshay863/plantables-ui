import React, { useState, useEffect } from 'react';

const Guard = ({ children }: { children: React.ReactNode }) => {
  const [pass, setPass] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const [error, setError] = useState(false);

  // Check if they already logged in during this session
  useEffect(() => {
    if (sessionStorage.getItem('site_auth') === 'true') {
      setIsAuth(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // SET YOUR PASSWORD HERE
    if (pass === 'plantables2026') { 
      sessionStorage.setItem('site_auth', 'true');
      setIsAuth(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (isAuth) return <>{children}</>;

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Internal Access Only</h1>
          <p className="text-slate-500 text-sm">Please enter the company password.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
          {error && <p className="text-red-500 text-xs font-medium">Incorrect password. Please try again.</p>}
          <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-emerald-200 transition-all transform active:scale-[0.98]">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Guard;