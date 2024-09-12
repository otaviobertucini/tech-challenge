import { ZodSchema } from "zod"

export type FieldError = {
  field: string
  message: string
}

export type ValidationRespose =
  | {
      ok: true
    }
  | {
      ok: false
      errors: FieldError[]
    }

export class Validator<T extends ZodSchema<any>> {
  constructor(private readonly schema: T) {}

  validate(data: unknown): ValidationRespose {
    const result = this.schema.safeParse(data)

    if (result.success) {
      return { ok: true }
    } else {
      const errors = result.error.errors.map((err) => {
        return {
          field: err.path.join("."),
          message: err.message,
        }
      })

      return { ok: false, errors }
    }
  }
}
