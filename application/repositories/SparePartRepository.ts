import { SparePartEntity } from "../../domain/entities/SparePartEntity";

export interface SparePartRepository {
  createSparePart(sparePart: SparePartEntity): Promise<SparePartEntity>;
  editSparePart(sparePart: SparePartEntity): Promise<SparePartEntity>;
}
