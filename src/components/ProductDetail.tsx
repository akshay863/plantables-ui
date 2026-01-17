import React, { useState } from 'react';
import { useProductStore } from '../store/useProductStore';
import { Calendar, User, Briefcase, Clock, CheckCircle, AlertCircle, Trash2, Edit, Download, Save, Plus, X, Leaf, Target, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';
import { Step } from '../types';

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
        <div className="text-center">
          <Leaf className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p>Select a product to view details</p>
        </div>
      </div>
    );
  }

  const total = Number(currentProduct.totalQty) || 0;
  const done = Number(currentProduct.completedQty) || 0;
  const efficiency = total > 0 ? Math.min(Math.round((done / total) * 100), 100) : 0;
  const remaining = Math.max(total - done, 0);

  // Date Calculations
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let daysLeft = 0;
  let isOverdue = false;
  let dailyTarget = 0;

  if (currentProduct.deadline) {
    const deadlineDate = new Date(currentProduct.deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    const diffTime = deadlineDate.getTime() - today.getTime();
    daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    isOverdue = daysLeft < 0;
    
    if (remaining > 0 && daysLeft > 0) {
      dailyTarget = Math.ceil(remaining / daysLeft);
    }
  }

  const getStatus = () => {
    if (done >= total && total > 0) return { label: 'Completed', color: 'bg-completed text-white' };
    if (isOverdue) return { label: 'Overdue', color: 'bg-red-600 text-white' };
    if (daysLeft < 3) return { label: 'Urgent', color: 'bg-urgent text-white' };
    return { label: 'Active', color: 'bg-primary text-white' };
  };

  const status = getStatus();

  const handleUpdateProduction = async () => {
    const val = Number(todayQty);
    if (val <= 0) return;
    
    await saveProduct({
      ...currentProduct,
      action: 'update',
      completedQty: done + val
    });
    setTodayQty('');
  };

  const handleToggleStep = async (index: number) => {
    const steps = [...(currentProduct.stepsJSON || [])];
    steps[index].done = !steps[index].done;
    await saveProduct({
      ...currentProduct,
      action: 'update',
      steps
    });
  };

  const handleAddStep = async () => {
    if (!newStep.trim()) return;
    const steps = [...(currentProduct.stepsJSON || []), { name: newStep, done: false }];
    await saveProduct({
      ...currentProduct,
      action: 'update',
      steps
    });
    setNewStep('');
  };

  const handleDeleteStep = async (index: number) => {
    const steps = [...(currentProduct.stepsJSON || [])];
    steps.splice(index, 1);
    await saveProduct({
      ...currentProduct,
      action: 'update',
      steps
    });
  };

  const handleDeleteProduct = async () => {
    if (confirm(`Are you sure you want to delete "${currentProduct.name}"?`)) {
      await deleteProduct(currentProduct.id);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-paper p-6 lg:p-10 print:bg-white print:p-0 print:overflow-visible">
      <div className="max-w-5xl mx-auto space-y-8 print:max-w-none">
        
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-between print:flex-row">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-3">
              <span className={clsx("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide print:border print:border-gray-300 print:text-black print:bg-transparent", status.color)}>
                {status.label}
              </span>
              {currentProduct.deadline && (
                <span className={clsx(
                  "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md",
                  isOverdue ? "text-red-600 bg-red-50" : daysLeft < 3 ? "text-orange-600 bg-orange-50" : "text-primary bg-green-50"
                )}>
                  <Clock className="w-3 h-3" />
                  {isOverdue ? `${Math.abs(daysLeft)} Days Overdue` : `${daysLeft} Days Left`}
                </span>
              )}
              <span className="text-sm text-gray-500 font-medium">{currentProduct.company || 'Direct Client'}</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              {currentProduct.name}
            </h1>
            
            <div className="flex flex-wrap gap-3 pt-2 print:hidden">
              <button onClick={handleDeleteProduct} className="btn-danger flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-red-50 text-red-600 hover:bg-red-100">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
              <button onClick={onEdit} className="btn-secondary flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-primary text-primary hover:bg-primary/5">
                <Edit className="w-4 h-4" /> Edit Details
              </button>
              <button onClick={() => window.print()} className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20">
                <Download className="w-4 h-4" /> Export PDF
              </button>
            </div>
          </div>

          {/* Image */}
          {currentProduct.imageURL && (
            <div className="w-full lg:w-64 h-48 rounded-2xl overflow-hidden shadow-xl bg-white border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-300 print:rotate-0 print:shadow-none print:border-0 print:w-48 print:h-auto">
              <img src={currentProduct.imageURL} alt={currentProduct.name} className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:grid-cols-2 print:gap-8">
          
          {/* Left Col: Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 print:shadow-none print:border print:border-gray-200">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-primary rounded-full print:bg-black"></span>
                Product Info
              </h3>
              <div className="space-y-4">
                <InfoRow icon={User} label="Customer" value={currentProduct.customer} />
                <InfoRow icon={Briefcase} label="Salesperson" value={currentProduct.salesperson} />
                <InfoRow icon={Edit} label="Designer" value={currentProduct.designer} />
                <InfoRow icon={Calendar} label="Order Date" value={currentProduct.orderDate && new Date(currentProduct.orderDate).toLocaleDateString()} />
                <InfoRow 
                  icon={Clock} 
                  label="Deadline" 
                  value={currentProduct.deadline && new Date(currentProduct.deadline).toLocaleDateString()} 
                  isUrgent={status.label === 'Urgent' || isOverdue}
                />
              </div>
            </div>

            {/* Daily Target Card (New Feature) */}
            {remaining > 0 && daysLeft > 0 && (
              <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-6 shadow-lg text-white print:hidden">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xs font-bold text-white/80 uppercase tracking-wider mb-1">Daily Target</h3>
                    <p className="text-xs text-white/60">To meet deadline</p>
                  </div>
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{dailyTarget}</span>
                  <span className="text-sm font-medium text-white/80">units / day</span>
                </div>
              </div>
            )}
            
            {isOverdue && remaining > 0 && (
              <div className="bg-red-50 rounded-2xl p-6 border border-red-100 print:hidden">
                <div className="flex items-center gap-3 mb-2 text-red-700">
                  <AlertTriangle className="w-5 h-5" />
                  <h3 className="font-bold text-sm">Production Delayed</h3>
                </div>
                <p className="text-xs text-red-600 leading-relaxed">
                  This order is overdue by {Math.abs(daysLeft)} days. Immediate action required to complete remaining {remaining} units.
                </p>
              </div>
            )}
          </div>

          {/* Right Col: Progress & SOP */}
          <div className="lg:col-span-2 space-y-6 print:col-span-1">
            
            {/* Production Progress */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 print:shadow-none print:border print:border-gray-200">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                <span className="w-1 h-4 bg-primary rounded-full print:bg-black"></span>
                Production Progress
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <MetricBox label="Total Qty" value={total} />
                <MetricBox label="Completed" value={done} color="text-primary" />
                <MetricBox label="Remaining" value={remaining} />
                <MetricBox label="Efficiency" value={`${efficiency}%`} />
              </div>

              <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden mb-6 print:border print:border-gray-200">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary-dark transition-all duration-1000 ease-out print:bg-black"
                  style={{ width: `${efficiency}%` }}
                />
              </div>

              <div className="flex gap-3 print:hidden">
                <input 
                  type="number" 
                  placeholder="Units produced today..." 
                  value={todayQty}
                  onChange={(e) => setTodayQty(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                />
                <button 
                  onClick={handleUpdateProduction}
                  className="px-6 py-2 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary-dark transition-colors"
                >
                  Update
                </button>
              </div>
            </div>

            {/* SOP Steps */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 print:shadow-none print:border print:border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1 h-4 bg-completed rounded-full print:bg-black"></span>
                  Workflow / SOP
                </h3>
                <span className="text-xs font-medium text-gray-500">
                  {currentProduct.stepsJSON?.filter(s => s.done).length || 0} / {currentProduct.stepsJSON?.length || 0} Done
                </span>
              </div>

              <div className="space-y-3 mb-6">
                {currentProduct.stepsJSON?.map((step, idx) => (
                  <div 
                    key={idx} 
                    className={clsx(
                      "flex items-center justify-between p-3 rounded-lg border transition-all print:border-gray-200 print:bg-transparent",
                      step.done ? "bg-green-50 border-green-100" : "bg-gray-50 border-transparent hover:bg-white hover:border-gray-200"
                    )}
                  >
                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                      <div className={clsx(
                        "w-5 h-5 rounded border flex items-center justify-center transition-colors print:border-black",
                        step.done ? "bg-primary border-primary print:bg-black" : "bg-white border-gray-300"
                      )}>
                        {step.done && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                        <input 
                          type="checkbox" 
                          checked={step.done} 
                          onChange={() => handleToggleStep(idx)}
                          className="hidden"
                        />
                      </div>
                      <span className={clsx("text-sm font-medium", step.done ? "text-primary line-through opacity-70 print:text-black" : "text-gray-700")}>
                        {step.name}
                      </span>
                    </label>
                    <button onClick={() => handleDeleteStep(idx)} className="text-gray-400 hover:text-red-500 transition-colors p-1 print:hidden">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                {(!currentProduct.stepsJSON || currentProduct.stepsJSON.length === 0) && (
                  <div className="text-center py-6 text-gray-400 text-sm italic">
                    No steps added yet.
                  </div>
                )}
              </div>

              <div className="flex gap-3 print:hidden">
                <input 
                  type="text" 
                  placeholder="Add custom step..." 
                  value={newStep}
                  onChange={(e) => setNewStep(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddStep()}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                />
                <button 
                  onClick={handleAddStep}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg font-medium text-sm hover:bg-black transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon: Icon, label, value, isUrgent }: any) => (
  <div className="flex justify-between items-center py-1 border-b border-gray-50 last:border-0 print:border-gray-200">
    <div className="flex items-center gap-2 text-gray-500">
      <Icon className="w-4 h-4" />
      <span className="text-xs font-medium">{label}</span>
    </div>
    <span className={clsx("text-sm font-semibold", isUrgent ? "text-urgent print:text-black print:font-bold" : "text-gray-900")}>
      {value || '-'}
    </span>
  </div>
);

const MetricBox = ({ label, value, color = "text-gray-900" }: any) => (
  <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100 print:bg-transparent print:border-gray-200">
    <span className="block text-[10px] font-bold text-gray-400 uppercase mb-1">{label}</span>
    <span className={clsx("text-xl font-bold", color === "text-primary" ? "text-primary print:text-black" : color)}>{value}</span>
  </div>
);
