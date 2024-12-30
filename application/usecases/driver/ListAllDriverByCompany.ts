import type { DriverRepository } from "../../repositories/DriverRepository";

export class ListAllDriverByCompany {
  public constructor(private readonly driverRepository: DriverRepository) {}

  public execute(companyId: string) {
    return this.driverRepository.findByCompany(companyId);
  }
}
