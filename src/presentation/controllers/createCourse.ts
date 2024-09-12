import { SaveCourse } from "../../domain/useCases/course/SaveCourse"
import { ValidationError } from "../protocols/errors"
import { Request, Response } from "../protocols/http"
import { Validator } from "../protocols/validator"

export default class CreateCourseController {
  constructor(
    private readonly saveCourse: SaveCourse,
    private readonly validator: Validator<any>
  ) {}

  async execute(
    request: Request<{
      title: string
      description: string
      duration: number
      instructor: string
    }>
  ): Promise<Response> {
    const { title, description, duration, instructor } = request.body

    const validation = this.validator.validate(request.body)
    if (!validation.ok) {
      throw new ValidationError(validation.errors)
    }

    const course = await this.saveCourse.execute({
      title,
      description,
      duration,
      instructor,
    })

    return {
      body: course,
      status: 200,
    }
  }
}
