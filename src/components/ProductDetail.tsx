import React, { useState } from "react";
import { useProductStore } from "../store/useProductStore";
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
  Leaf,
} from "lucide-react";
import clsx from "clsx";

interface ProductDetailProps {
  onEdit: () => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ onEdit }) => {
  const { currentProduct, deleteProduct, saveProduct } = useProductStore();
  const [todayQty, setTodayQty] = useState("");
  const [newStep, setNewStep] = useState("");

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
  const efficiency =
    total > 0 ? Math.min(Math.round((done / total) * 100), 100) : 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let daysLeft = 0;
  let isOverdue = false;
  let dailyTarget = 0;

  if (currentProduct.deadline) {
    const deadlineDate = new Date(currentProduct.deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    daysLeft = Math.ceil(
      (deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    isOverdue = daysLeft < 0;
    if (remaining > 0 && daysLeft > 0) {
      dailyTarget = Math.ceil(remaining / daysLeft);
    }
  }

  const status = (() => {
    if (done >= total && total > 0)
      return { label: "Completed", color: "bg-green-600 text-white" };
    if (isOverdue)
      return { label: "Overdue", color: "bg-red-600 text-white" };
    if (daysLeft < 3)
      return { label: "Urgent", color: "bg-orange-500 text-white" };
    return { label: "Active", color: "bg-primary text-white" };
  })();

  return (
    <div className="flex-1 overflow-y-auto bg-paper px-4 py-6 sm:px-6 lg:px-10">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={clsx(
                  "px-3 py-1 rounded-full text-xs font-bold",
                  status.color
                )}
              >
                {status.label}
              </span>

              {currentProduct.deadline && (
                <span
                  className={clsx(
                    "flex items-center gap-1 text-xs px-2 py-1 rounded-md",
                    isOverdue
                      ? "bg-red-50 text-red-600"
                      : "bg-green-50 text-primary"
                  )}
                >
                  <Clock className="w-3 h-3" />
                  {isOverdue
                    ? `${Math.abs(daysLeft)} days overdue`
                    : `${daysLeft} days left`}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight break-words">
              {currentProduct.name}
            </h1>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <button
                onClick={handleDeleteProduct}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>

              <button
                onClick={onEdit}
                className="w-full sm:w-auto px-4 py-2 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary/5 flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" /> Edit
              </button>

              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Export PDF
              </button>
            </div>
          </div>

          {/* IMAGE */}
          {currentProduct.imageURL && (
            <div className="w-full sm:w-64 h-44 sm:h-48 rounded-xl overflow-hidden shadow-md bg-white">
              <img
                src={currentProduct.imageURL}
                alt={currentProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <InfoCard title="Product Info">
              <InfoRow icon={User} label="Customer" value={currentProduct.customer} />
              <InfoRow icon={Briefcase} label="Salesperson" value={currentProduct.salesperson} />
              <InfoRow icon={Calendar} label="Order Date" value={currentProduct.orderDate} />
              <InfoRow icon={Clock} label="Deadline" value={currentProduct.deadline} />
            </InfoCard>

            {dailyTarget > 0 && (
              <div className="bg-primary text-white rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase opacity-80">Daily Target</p>
                    <p className="text-3xl font-bold">{dailyTarget}</p>
                  </div>
                  <Target />
                </div>
              </div>
            )}

            {isOverdue && remaining > 0 && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-red-700 text-sm">
                <AlertTriangle className="inline w-4 h-4 mr-1" />
                Production delayed by {Math.abs(daysLeft)} days.
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            {/* Progress */}
            <Card title="Production Progress">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                <Metric label="Total" value={total} />
                <Metric label="Done" value={done} highlight />
                <Metric label="Remaining" value={remaining} />
                <Metric label="Efficiency" value={`${efficiency}%`} />
              </div>

              <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${efficiency}%` }}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="number"
                  placeholder="Units produced today"
                  value={todayQty}
                  onChange={(e) => setTodayQty(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg text-sm"
                />
                <button className="px-6 py-2 bg-primary text-white rounded-lg text-sm">
                  Update
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- Helper Components ---------- */

const Card = ({ title, children }: any) => (
  <div className="bg-white rounded-xl p-6 border border-gray-100">
    <h3 className="text-xs font-bold text-gray-400 uppercase mb-4">{title}</h3>
    {children}
  </div>
);

const InfoCard = ({ title, children }: any) => (
  <Card title={title}>
    <div className="space-y-3">{children}</div>
  </Card>
);

const InfoRow = ({ icon: Icon, label, value }: any) => (
  <div className="flex justify-between items-center text-sm">
    <div className="flex items-center gap-2 text-gray-500">
      <Icon className="w-4 h-4" />
      {label}
    </div>
    <span className="font-semibold text-gray-900">{value || "-"}</span>
  </div>
);

const Metric = ({ label, value, highlight }: any) => (
  <div className="bg-gray-50 rounded-lg p-3 text-center">
    <p className="text-[10px] uppercase text-gray-400">{label}</p>
    <p
      className={clsx(
        "text-lg font-bold",
        highlight ? "text-primary" : "text-gray-900"
      )}
    >
      {value}
    </p>
  </div>
);
