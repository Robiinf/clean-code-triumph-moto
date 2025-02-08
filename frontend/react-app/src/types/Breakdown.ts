export interface Breakdown {
  id: string;
  breakdownDate: Date;
  breakdownType: { value: string };
  breakdownDescription: string;
  motorcycleId: string;
}
