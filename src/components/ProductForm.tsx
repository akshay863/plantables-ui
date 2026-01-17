import React, { useState, useEffect } from 'react';
import { useProductStore } from '../store/useProductStore';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { ProductPayload } from '../types';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  editMode?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  isOpen,
  onClose,
  editMode = false,
}) => {
  const { currentProduct, saveProduct } = useProductStore();
  const [formData, setFormData] = useState<Partial<ProductPayload>>({});
  const [preview, setPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (editMode && currentProduct) {
      setFormData({
        name: currentProduct.name,
        company: currentProduct.company,
        customer: currentProduct.customer,
        salesperson: currentProduct.salesperson,
        designer: currentProduct.designer,
        qty: currentProduct.totalQty,
        orderDate: currentProduct.orderDate
          ? new Date(currentProduct.orderDate).toISOString().split('T')[0]
          : '',
        deadline: currentProduct.deadline
          ? new Date(currentProduct.deadline).toISOString().split('T')[0]
          : '',
        image: currentProduct.imageURL,
      });
      setPreview(currentProduct.imageURL || '');
    } else {
      setFormData({});
      setPreview('');
    }
  }, [isOpen, editMode, currentProduct]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      setFormData((p) => ({ ...p, image: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    setIsSubmitting(true);
    try {
      await saveProduct({
        ...formData,
        action: editMode ? 'edit' : 'add',
        id: editMode ? currentProduct?.id : undefined,
        steps: editMode ? currentProduct?.stepsJSON || [] : [],
        completedQty: editMode ? currentProduct?.completedQty || 0 : 0,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-3">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b px-5 py-4 flex justify-between items-center">
          <h2 className="text-lg font-bold">
            {editMode ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Product Name *" name="name" value={formData.name} onChange={handleChange} required />
            <Input label="Company" name="company" value={formData.company} onChange={handleChange} />
            <Input label="Customer Contact" name="customer" value={formData.customer} onChange={handleChange} />
            <Input label="Salesperson" name="salesperson" value={formData.salesperson} onChange={handleChange} />
            <Input label="Designer" name="designer" value={formData.designer} onChange={handleChange} />
            <Input label="Total Quantity" name="qty" type="number" value={formData.qty} onChange={handleChange} />

            <div className="grid grid-cols-2 gap-3">
              <Input label="Order Date" name="orderDate" type="date" value={formData.orderDate} onChange={handleChange} />
              <Input label="Deadline" name="deadline" type="date" value={formData.deadline} onChange={handleChange} />
            </div>

            {/* Image */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold mb-2">Product Image</label>
              <div className="relative border-2 border-dashed rounded-xl p-4 text-center">
                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                {preview ? (
                  <img src={preview} className="max-h-40 mx-auto rounded-lg object-contain" />
                ) : (
                  <div className="text-gray-400 flex flex-col items-center gap-2">
                    <ImageIcon />
                    <span className="text-sm">Tap to upload image</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-lg bg-primary text-white font-medium disabled:opacity-60"
            >
              {isSubmitting ? 'Saving…' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* Reusable Input */
const Input = ({ label, ...props }: any) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-bold">{label}</label>
    <input
      {...props}
      className="px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
    />
  </div>
);
