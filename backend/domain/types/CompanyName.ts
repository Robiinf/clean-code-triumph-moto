import { CompanyNameTooShortError } from "../errors/CompanyNameTooShortError";

export class CompanyName {
  private constructor(public readonly value: string) {}

  public static from(name: string) {
    if (name.trim().length < 3) {
      return new CompanyNameTooShortError();
    }
    return new CompanyName(name);
  }
}
