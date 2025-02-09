export type OrderStatus = "pending" | "confirmed" | "delivered" | "cancelled";

export interface Order {
  id: string;
  orderDate: Date;
  status: OrderStatus;
  totalAmount: number;
  orderLines: OrderLine[];
}

export interface OrderLine {
  id: string;
  orderId: string;
  sparePartId: string;
  quantity: number;
  unitPrice: number;
}
