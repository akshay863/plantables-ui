import React, { useEffect, useState, FormEvent } from 'react';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ProductDetail } from './components/ProductDetail';
import { ProductForm } from './components/ProductForm';
import { useProductStore } from './store/useProductStore';
import { Sidebar } from './components/Sidebar';
import { Menu, Lock } from 'lucide-react'; // Added Lock icon for the login screen

function App() {
  // --- AUTHENTICATION STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  
  // CHANGE YOUR PASSWORD HERE
  const SECRET_PASSWORD = "admin"; 

  // --- APP STATE ---
  const { fetchProducts, isLoading } = useProductStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formState, setFormState] = useState<{ isOpen: boolean; editMode: boolean }>({
    isOpen: false,
    editMode: false
  });

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // --- HANDLE LOGIN SUBMISSION ---
  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (passwordInput === SECRET_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect password');
    }
  };

  // --- RENDER 1: LOGIN SCREEN (If not authenticated) ---
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
          <div className="flex flex-col items-center mb-6">
            <div className="p-3 bg-green-100 rounded-full mb-3">
              <Lock className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Plantables Hub</h2>
            <p className="text-gray-500">Please enter access password</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Password"
                autoFocus
              />
            </div>
            {authError && (
              <p className="text-sm text-red-600 text-center font-medium bg-red-50 p-2 rounded">
                {authError}
              </p>
            )}
            <button
              type="submit"
              className="w-full px-4 py-3 text-white font-semibold bg-green-600 rounded-lg hover:bg-green-700 active:transform active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- RENDER 2: LOADING SCREEN ---
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-paper text-primary">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="font-medium animate-pulse">Loading Plantables Hub...</p>
        </div>
      </div>
    );
  }

  // --- RENDER 3: MAIN APP (Your Original Code) ---
  return (
    <div className="flex h-screen bg-paper overflow-hidden font-sans text-gray-900">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        onNewProduct={() => setFormState({ isOpen: true, editMode: false })} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Mobile Header */}
        <div className="lg:hidden bg-primary text-white p-4 flex items-center justify-between shadow-md z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="p-1 hover:bg-white/10 rounded">
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-bold tracking-wide">PLANTABLES</span>
          </div>
        </div>

        <ProductDetail onEdit={() => setFormState({ isOpen: true, editMode: true })} />
      </div>

      {/* Product Form Modal */}
      <ProductForm 
        isOpen={formState.isOpen} 
        editMode={formState.editMode}
        onClose={() => setFormState({ ...formState, isOpen: false })} 
      />
    </div>
  );
}

export default App;