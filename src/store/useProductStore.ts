import { create } from 'zustand';
import { Product, ProductPayload, ProductStatus, Step } from '../types';
import { api } from '../api/products';

interface ProductStore {
  products: Product[];
  currentProduct: Product | null;
  isLoading: boolean;
  isSaving: boolean; // New state for background saving indicator
  error: string | null;
  searchQuery: string;
  statusFilter: ProductStatus | 'all';
  
  fetchProducts: (silent?: boolean) => Promise<void>;
  selectProduct: (product: Product) => void;
  saveProduct: (payload: ProductPayload) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: ProductStatus | 'all') => void;
  
  // Computed
  getFilteredProducts: () => Product[];
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  currentProduct: null,
  isLoading: false,
  isSaving: false,
  error: null,
  searchQuery: '',
  statusFilter: 'all',

  fetchProducts: async (silent = false) => {
    if (!silent) set({ isLoading: true, error: null });
    try {
      const products = await api.getProducts();
      set((state) => {
        // Preserve current selection if possible
        const currentId = state.currentProduct?.id;
        const newCurrent = products.find(p => p.id === currentId) || products[0] || null;
        return { 
          products, 
          isLoading: false, 
          currentProduct: state.currentProduct ? newCurrent : (products.length > 0 ? products[0] : null)
        };
      });
    } catch (err) {
      set({ error: 'Failed to fetch products', isLoading: false });
    }
  },

  selectProduct: (product) => set({ currentProduct: product }),

  saveProduct: async (payload) => {
    const state = get();
    const isAdd = payload.action === 'add';
    
    // Optimistic Updates
    if (!isAdd) {
      set((state) => {
        let newProducts = [...state.products];
        let newCurrent = state.currentProduct;

        if (payload.action === 'delete' && payload.id) {
          newProducts = newProducts.filter(p => p.id !== payload.id);
          newCurrent = newProducts.length > 0 ? newProducts[0] : null;
        } else if ((payload.action === 'edit' || payload.action === 'update') && payload.id) {
          newProducts = newProducts.map(p => {
            if (p.id === payload.id) {
              // Merge existing product with payload updates
              // Note: payload might not have all fields, so be careful
              const updated = { ...p, ...payload } as Product;
              if (state.currentProduct?.id === p.id) newCurrent = updated;
              return updated;
            }
            return p;
          });
        }
        return { products: newProducts, currentProduct: newCurrent, isSaving: true };
      });
    } else {
      set({ isSaving: true });
    }

    try {
      await api.saveProduct(payload);
      
      // For 'add', we MUST refetch to get the ID.
      // For others, we can refetch silently to ensure consistency but don't block UI.
      if (isAdd) {
        await get().fetchProducts(false); // Show loader for Add as it's a major change
      } else {
        // Silent sync in background
        get().fetchProducts(true); 
      }
    } catch (err) {
      // Revert on error? For now just show error
      set({ error: 'Failed to save changes' });
      // Force fetch to restore state
      get().fetchProducts(true);
    } finally {
      set({ isSaving: false });
    }
  },

  deleteProduct: async (id) => {
    await get().saveProduct({ action: 'delete', id });
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),

  getFilteredProducts: () => {
    const { products, searchQuery, statusFilter } = get();
    return products.filter(p => {
      const matchesSearch = (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.company || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      if (statusFilter === 'all') return matchesSearch;
      
      // Calculate status logic
      const total = Number(p.totalQty) || 0;
      const done = Number(p.completedQty) || 0;
      let status: ProductStatus = 'active';
      
      if (done >= total && total > 0) status = 'completed';
      else if (p.deadline) {
        const diff = (new Date(p.deadline).getTime() - new Date().getTime()) / (86400000);
        if (diff < 3) status = 'urgent';
      }
      
      return matchesSearch && status === statusFilter;
    });
  }
}));
