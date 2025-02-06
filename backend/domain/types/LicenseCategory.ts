import { InvalidLicenseCategory } from "../errors/InvalidLicenseCategory";

export class LicenseCategory {
  private static readonly LICENCE_CATEGORIES: string[] = [
    "A",
    "A1",
    "B",
    "BE",
    "C",
    "C1",
    "CE",
    "C1E",
    "D",
    "D1",
    "DE",
    "D1E",
  ];

  private constructor(public readonly value: string) {}

  public static from(categories: string[]) {
    const invalidCategories = categories.filter(
      (category) => !LicenseCategory.LICENCE_CATEGORIES.includes(category)
    );

    if (invalidCategories.length > 0) {
      return new InvalidLicenseCategory();
    }

    return categories.map((category) => new LicenseCategory(category));
  }
}
