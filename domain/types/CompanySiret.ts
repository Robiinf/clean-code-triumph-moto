import { InvalidSiretError } from "../errors/InvalidSiretError";

export class CompanySiret {
  private constructor(public readonly value: string) {}

  public static from(siret: string) {
    if (!CompanySiret.isValid(siret)) {
      throw new InvalidSiretError();
    }
    return new CompanySiret(siret);
  }

  private static isValid(siret: string): boolean {
    if (!/^\d{14}$/.test(siret)) {
      return false;
    }

    let sum = 0;
    for (let i = 0; i < 14; i++) {
      let digit = parseInt(siret.charAt(i), 10);
      if (i % 2 === 0) {
        // Position paire (index 0, 2, ...)
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
    }

    return sum % 10 === 0;
  }
}
