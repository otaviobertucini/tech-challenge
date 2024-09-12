import { FieldError } from "./validator"

export class ApplicationError extends Error {
  constructor(message: string) {
    super(message)
  }
}

export class ValidationError extends Error {
  constructor(private readonly errorsArray: FieldError[]) {
    super("Validation Error")
  }

  public get errors(): FieldError[] {
    return this.errorsArray
  }
}
export class NotFoundError extends Error {
  constructor() {
    super("Resource Not Found!")
  }
}

export class AuthError extends Error {
  constructor(message: string) {
    super(`Authentication error: ${message}`)
  }
}
