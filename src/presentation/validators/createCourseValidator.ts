import { Validator } from "../protocols/validator"
import { courseSchema } from "./schemas/courseSchema"
import { ZodObject, ZodRawShape } from "zod"

export default class CreateCourseValidator extends Validator<
  ZodObject<ZodRawShape>
> {
  constructor() {
    super(courseSchema)
  }
}
