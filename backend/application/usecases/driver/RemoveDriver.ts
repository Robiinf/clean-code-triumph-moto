import type { DriverRepository } from "../../repositories/DriverRepository";
import { DriverNotFound } from "../../../domain/errors/DriverNotFound";

export class RemoveDriver {
  public constructor(private readonly driverRepository: DriverRepository) {}

  public async execute(id: string): Promise<void | DriverNotFound> {
    const driver = await this.driverRepository.findById(id);
    if (!driver) {
      return new DriverNotFound();
    }

    await this.driverRepository.delete(id);
  }
}
