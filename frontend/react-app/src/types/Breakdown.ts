type BreakdownType =
  | "Frame"
  | "Engine"
  | "Fuel"
  | "Brakes"
  | "Wheels and Tire"
  | "Battery"
  | "Electrical"
  | "Suspension"
  | "Transmission"
  | "Handlebars";

export interface Breakdown {
  id: string;
  breakdownDate: Date;
  breakdownType: { value: BreakdownType };
  breakdownDescription: string;
  motorcycleId: string;
}
