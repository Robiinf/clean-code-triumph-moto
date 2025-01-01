import { SparePartEntity } from "../entities/SparePartEntity";

export type ReplacedPart = SparePartEntity & { quantity: number };
