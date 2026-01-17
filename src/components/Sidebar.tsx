import React from 'react';
import { useProductStore } from '../store/useProductStore';
import { Plus, Search, Filter, Leaf, RefreshCw } from 'lucide-react';
import { ProductStatus } from '../types';
import clsx from 'clsx';

interface SidebarProps {
  onNewProduct: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNewProduct, isOpen, onClose }) => {
  const { 
    getFilteredProducts, 
    searchQuery, 
    setSearchQuery, 
    statusFilter, 
    setStatusFilter,
    currentProduct,
    selectProduct,
    isSaving
  } = useProductStore();

  const products = getFilteredProducts();

  const getStatusColor = (p: any) => {
    const total = Number(p.totalQty) || 0;
    const done = Number(p.completedQty) || 0;
    if (done >= total && total > 0) return 'bg-completed';
    if (!p.deadline) return 'bg-primary';
    const diff = (new Date(p.deadline).getTime() - new Date().getTime()) / (86400000);
    return diff < 3 ? 'bg-urgent' : 'bg-primary';
  };

  return (
    <aside className={clsx(
      "fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Leaf className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900 leading-tight">PLANTABLES</h1>
                <span className="text-xs text-gray-500 tracking-wider uppercase">Manufacturing Hub</span>
              </div>
            </div>
          </div>

          <button 
            onClick={onNewProduct}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white py-2.5 px-4 rounded-xl transition-all shadow-lg shadow-primary/20 font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            New Product
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 space-y-3 bg-paper/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ProductStatus | 'all')}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="urgent">Urgent</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {products.map((product) => (
            <div 
              key={product.id}
              onClick={() => {
                selectProduct(product);
                if (window.innerWidth < 1024) onClose();
              }}
              className={clsx(
                "p-3 rounded-xl cursor-pointer transition-all border-2",
                currentProduct?.id === product.id 
                  ? "bg-white border-primary shadow-md" 
                  : "bg-transparent border-transparent hover:bg-white hover:shadow-sm"
              )}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className={clsx(
                  "font-semibold text-sm truncate pr-2",
                  currentProduct?.id === product.id ? "text-primary" : "text-gray-700"
                )}>
                  {product.name}
                </h3>
                <span className={clsx("w-2 h-2 rounded-full mt-1.5 flex-shrink-0", getStatusColor(product))} />
              </div>
              <p className="text-xs text-gray-500 truncate">{product.company || 'Direct Client'}</p>
            </div>
          ))}
          
          {products.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm">
              No products found
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-3">
          <div className="flex items-center justify-between text-xs font-medium text-gray-500">
            <div className="flex items-center gap-2">
              <div className={clsx("w-2 h-2 rounded-full", isSaving ? "bg-yellow-400 animate-pulse" : "bg-green-500")} />
              {isSaving ? "Syncing..." : "System Online"}
            </div>
          </div>

          <a 
            href="https://akshay863.github.io/plantable-sop/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-xs font-medium text-primary hover:text-primary-dark transition-colors w-full py-2 bg-white rounded-lg border border-gray-200"
          >
            <Leaf className="w-3 h-3" />
            View General SOPs
          </a>
        </div>
      </div>
    </aside>
  );
};
