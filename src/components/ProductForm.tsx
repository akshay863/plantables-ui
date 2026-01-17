import React, { useState, useEffect } from 'react';
import { useProductStore } from '../store/useProductStore';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { ProductPayload } from '../types';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  editMode?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({ isOpen, onClose, editMode = false }) => {
  const { currentProduct, saveProduct } = useProductStore();
  const [formData, setFormData] = useState<Partial<ProductPayload>>({});
  const [preview, setPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editMode && currentProduct) {
        setFormData({
          name: currentProduct.name,
          company: currentProduct.company,
          customer: currentProduct.customer,
          salesperson: currentProduct.salesperson,
          designer: currentProduct.designer,
          qty: currentProduct.totalQty,
          orderDate: currentProduct.orderDate ? new Date(currentProduct.orderDate).toISOString().split('T')[0] : '',
          deadline: currentProduct.deadline ? new Date(currentProduct.deadline).toISOString().split('T')[0] : '',
          image: currentProduct.imageURL
        });
        setPreview(currentProduct.imageURL);
      } else {
        setFormData({});
        setPreview('');
      }
    }
  }, [isOpen, editMode, currentProduct]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        setFormData(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    setIsSubmitting(true);
    try {
      await saveProduct({
        ...formData,
        action: editMode ? 'edit' : 'add',
        id: editMode && currentProduct ? currentProduct.id : undefined,
        steps: editMode && currentProduct ? currentProduct.stepsJSON : [],
        completedQty: editMode && currentProduct ? currentProduct.completedQty : 0
      });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900">
            {editMode ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                placeholder="e.g. Eco-Friendly Packaging Box"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Company</label>
              <input
                type="text"
                name="company"
                value={formData.company || ''}
                onChange={handleChange}
                placeholder="Client Company"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Customer Contact</label>
              <input
                type="text"
                name="customer"
                value={formData.customer || ''}
                onChange={handleChange}
                placeholder="Contact Person"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Salesperson</label>
              <input
                type="text"
                name="salesperson"
                value={formData.salesperson || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Designer</label>
              <input
                type="text"
                name="designer"
                value={formData.designer || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Total Quantity</label>
              <input
                type="number"
                name="qty"
                value={formData.qty || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Order Date</label>
                <input
                  type="date"
                  name="orderDate"
                  value={formData.orderDate || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Product Image</label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {preview ? (
                  <div className="relative h-40 w-full">
                    <img src={preview} alt="Preview" className="h-full w-full object-contain rounded-lg" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                      <span className="text-white font-medium flex items-center gap-2"><Upload className="w-4 h-4" /> Change Image</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <div className="p-3 bg-gray-100 rounded-full">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-medium">Click to upload image</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-gray-600 font-medium hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 disabled:opacity-70 flex items-center gap-2"
            >
              {isSubmitting ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
