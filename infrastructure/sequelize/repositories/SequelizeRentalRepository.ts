import { Sequelize, Op } from "sequelize";
import { RentalRepository } from "../../../application/repositories/RentalRepository";
import { RentalEntity } from "../../../domain/entities/RentalEntity";
import { IdValidator } from "../../utils/IdValidator";
import { RentalModel } from "../models/RentalModel";

export class SequelizeRentalRepository implements RentalRepository {
  constructor(private sequelize: Sequelize) {
    RentalModel.initModel(sequelize);
  }

  private toEntity(rental: RentalModel): RentalEntity {
    return new RentalEntity(
      rental.id,
      rental.motorcycleId,
      rental.renterId,
      rental.rentalStartDate,
      rental.rentalEndDate,
      rental.dailyRate,
      rental.rentalStatus,
      rental.returnDate
    );
  }

  async save(rental: RentalEntity): Promise<void> {
    const data = {
      id: rental.id,
      motorcycleId: rental.motorcycleId,
      renterId: rental.renterId,
      rentalStartDate: rental.rentalStartDate,
      rentalEndDate: rental.rentalEndDate,
      dailyRate: rental.dailyRate,
      rentalStatus: rental.rentalStatus,
      returnDate: rental.returnDate,
    };

    await RentalModel.upsert(data);
  }

  async findAll(): Promise<RentalEntity[]> {
    const rentals = await RentalModel.findAll();
    return rentals.map((rental) => this.toEntity(rental));
  }

  async findById(id: string): Promise<RentalEntity | null> {
    if (!IdValidator.isValid(id)) {
      return null;
    }

    const rental = await RentalModel.findByPk(id);
    return rental ? this.toEntity(rental) : null;
  }

  async findByMotorcycle(id: string): Promise<RentalEntity[]> {
    if (!IdValidator.isValid(id)) {
      return [];
    }

    const rentals = await RentalModel.findAll({
      where: {
        motorcycleId: id,
      },
    });

    return rentals.map((rental) => this.toEntity(rental));
  }

  async findByDriver(id: string): Promise<RentalEntity[]> {
    if (!IdValidator.isValid(id)) {
      return [];
    }

    const rentals = await RentalModel.findAll({
      where: {
        renterId: id,
      },
    });

    return rentals.map((rental) => this.toEntity(rental));
  }

  async findOverlappingRentals(
    motorcycleId: string,
    startDate: Date,
    endDate: Date
  ): Promise<RentalEntity[]> {
    if (!IdValidator.isValid(motorcycleId)) {
      return [];
    }

    const rentals = await RentalModel.findAll({
      where: {
        motorcycleId,
        [Op.or]: [
          {
            rentalStartDate: {
              [Op.between]: [startDate, endDate],
            },
          },
          {
            rentalEndDate: {
              [Op.between]: [startDate, endDate],
            },
          },
          {
            [Op.and]: [
              {
                rentalStartDate: {
                  [Op.lte]: startDate,
                },
              },
              {
                rentalEndDate: {
                  [Op.gte]: endDate,
                },
              },
            ],
          },
        ],
      },
    });

    return rentals.map((rental) => this.toEntity(rental));
  }
}
