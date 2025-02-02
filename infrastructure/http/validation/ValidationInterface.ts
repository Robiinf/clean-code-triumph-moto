// src/infrastructure/http/validation/ValidationInterface.ts
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: string[];
}

export interface ValidatorInterface<T> {
  validate(data: unknown): Promise<ValidationResult<T>>;
}
