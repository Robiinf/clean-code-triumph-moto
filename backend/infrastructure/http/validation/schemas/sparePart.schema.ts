export interface CreateSparePartSchema {
  name: string;
  unitPrice: number;
  description: string;
  stockQuantity: number;
  alertLowStock: number;
}
