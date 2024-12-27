import { SparePart } from "../../domain/entities/SparePart";

export interface SparePartRepository {
  createSparePart(sparePart: SparePart): Promise<SparePart>;
  editSparePart(sparePart: SparePart): Promise<SparePart>;
}
