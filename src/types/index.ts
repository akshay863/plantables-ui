export interface Step {
  name: string;
  done: boolean;
}

export interface Product {
  id: string;
  name: string;
  company: string;
  customer: string;
  salesperson: string;
  designer: string;
  totalQty: number;
  completedQty: number;
  orderDate: string;
  deadline: string;
  imageURL: string;
  stepsJSON: Step[];
}

export type ProductStatus = 'active' | 'urgent' | 'completed';

export interface ProductPayload {
  action: 'add' | 'edit' | 'delete' | 'update';
  id?: string;
  name?: string;
  company?: string;
  customer?: string;
  salesperson?: string;
  designer?: string;
  qty?: number;
  orderDate?: string;
  deadline?: string;
  image?: string;
  steps?: Step[];
  completedQty?: number;
}

