export type StockQuantity = number & { _brand: "stock" };

export const createStock = (stock: number): StockQuantity => {
  if (stock < 0) {
    throw new Error("Stock must be a positive number");
  }
  return stock as StockQuantity;
};

export const verifyStock = (stock: number): boolean => {
  return stock >= 0;
};
