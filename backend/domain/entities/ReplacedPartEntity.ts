import crypto from "crypto";

export class ReplacedPartEntity {
  private constructor(
    public id: string,
    public maintenanceId: string,
    public sparePartId: string,
    public quantity: number
  ) {}

  public static create(
    maintenanceId: string,
    sparePartId: string,
    quantity: number
  ): ReplacedPartEntity {
    const id = crypto.randomUUID();
    return new ReplacedPartEntity(id, maintenanceId, sparePartId, quantity);
  }

  public static restore(
    id: string,
    maintenanceId: string,
    sparePartId: string,
    quantity: number
  ): ReplacedPartEntity {
    return new ReplacedPartEntity(id, maintenanceId, sparePartId, quantity);
  }
}
