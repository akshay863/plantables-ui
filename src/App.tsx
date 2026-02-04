import React, { useEffect, useState } from 'react';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ProductDetail } from './components/ProductDetail';
import { ProductForm } from './components/ProductForm';
import { useProductStore } from './store/useProductStore';
import { Sidebar } from './components/Sidebar';
import { Menu } from 'lucide-react';
// IMPORT THE GUARD COMPONENT
import Guard from './components/Guard'; 

function App() {
  const { fetchProducts, isLoading } = useProductStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formState, setFormState] = useState<{ isOpen: boolean; editMode: boolean }>({
    isOpen: false,
    editMode: false
  });

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // We wrap the entire return in the Guard
  return (
    <Guard>
      {/* 1. Loading State (Now protected) */}
      {isLoading ? (
        <div className="flex h-screen items-center justify-center bg-paper text-primary">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="font-medium animate-pulse">Loading Plantables Hub...</p>
          </div>
        </div>
      ) : (
        /* 2. Main Dashboard (Now protected) */
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
      )}
    </Guard>
  );
}

export default App;