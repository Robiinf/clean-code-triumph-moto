import { DriverEntity } from "../../../domain/entities/DriverEntity";
import type { DriverRepository } from "../../repositories/DriverRepository";

export class ListAllDriverByCompany {
  public constructor(private readonly driverRepository: DriverRepository) {}

  public execute(companyId: string): Promise<DriverEntity[]> {
    return this.driverRepository.findByCompany(companyId);
  }
}
