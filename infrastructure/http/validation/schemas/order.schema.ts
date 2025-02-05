export interface CreateOrderSchema {
  orderLines: {
    sparePartId: string;
    quantity: number;
  }[];
}
