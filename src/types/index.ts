export interface CalcItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

export interface CalculationType {
  id: string;
  name: string;
  icon: string;
  available: boolean;
  description: string;
}

export interface Calculation {
  id: string;
  type: string;
  items: CalcItem[];
  total: number;
  date: Date;
}