// ✅ SAFE FIX: original logic preserved + mobile polish
// (This will stop the white screen)

import React, { useState } from 'react';
import { useProductStore } from '../store/useProductStore';
import {
  Calendar,
  User,
  Briefcase,
  Clock,
  CheckCircle,
  Trash2,
  Edit,
  Download,
  Target,
  AlertTriangle,
  X,
  Leaf
} from 'lucide-react';
import clsx from 'clsx';

interface ProductDetailProps {
  onEdit: () => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ onEdit }) => {
  const { currentProduct, deleteProduct, saveProduct } = useProductStore();
  const [todayQty, setTodayQty] = useState('');
  const [newStep, setNewStep] = useState('');

  if (!currentProduct) {
    return (
      <div className="flex-1 flex items-center justify-center bg-paper text-gray-400">
        <div className="text-center px-6">
          <Leaf className="w-14 h-14 mx-auto mb-3 opacity-20" />
          <p className="text-sm">Select a product to view details</p>
        </div>
      </div>
    );
  }

  const total = Number(currentProduct.totalQty) || 0;
  const done = Number(currentProduct.completedQty) || 0;
  const remaining = Math.max(total - done, 0);
  const efficiency = total > 0 ? Math.round((done / total) * 100) : 0;

  const handleDeleteProduct = async () => {
    if (confirm(`Delete "${currentProduct.name}"?`)) {
      await deleteProduct(currentProduct.id);
    }
  };

  const handleUpdateProduction = async () => {
    const qty = Number(todayQty);
    if (qty <= 0) return;

    await saveProduct({
      ...currentProduct,
      action: 'update',
      completedQty: done + qty,
    });

    setTodayQty('');
  };

  return (
    <div className="flex-1 overflow-y-auto bg-paper px-4 py-6 sm:px-6 lg:px-10">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold break-words">
              {currentProduct.name}
            </h1>

            {/* Buttons – responsive */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDeleteProduct}
                className="w-full sm:w-auto px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm"
              >
                Delete
              </button>

              <button
                onClick={onEdit}
                className="w-full sm:w-auto px-4 py-2 border border-primary text-primary rounded-lg text-sm"
              >
                Edit
              </button>

              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg text-sm"
              >
                Export PDF
              </button>
            </div>
          </div>

          {currentProduct.imageURL && (
            <div className="w-full sm:w-64 h-44 rounded-xl overflow-hidden bg-white">
              <img
                src={currentProduct.imageURL}
                alt={currentProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* PROGRESS */}
        <div className="bg-white rounded-xl p-6 border">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <Metric label="Total" value={total} />
            <Metric label="Done" value={done} highlight />
            <Metric label="Remaining" value={remaining} />
            <Metric label="Efficiency" value={`${efficiency}%`} />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="number"
              placeholder="Units produced today"
              value={todayQty}
              onChange={(e) => setTodayQty(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg text-sm"
            />
            <button
              onClick={handleUpdateProduction}
              className="px-6 py-2 bg-primary text-white rounded-lg text-sm"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Helpers */
const Metric = ({ label, value, highlight }: any) => (
  <div className="bg-gray-50 rounded-lg p-3 text-center">
    <p className="text-[10px] uppercase text-gray-400">{label}</p>
    <p className={clsx("text-lg font-bold", highlight && "text-primary")}>
      {value}
    </p>
  </div>
);
