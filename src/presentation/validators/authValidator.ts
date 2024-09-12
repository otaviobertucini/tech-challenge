import { Validator } from "../protocols/validator"
import { loginSchema } from "./schemas/loginSchema"
import { ZodObject, ZodRawShape } from "zod"

export default class AuthValidator extends Validator<ZodObject<ZodRawShape>> {
  constructor() {
    super(loginSchema)
  }
}
