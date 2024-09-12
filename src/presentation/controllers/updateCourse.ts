import { Course } from "../../domain/models/Course"
import { GetCourse } from "../../domain/useCases/course/GetCourse"
import { UpdateCourse } from "../../domain/useCases/course/UpdateCourse"
import { NotFoundError, ValidationError } from "../protocols/errors"
import { Request, Response } from "../protocols/http"
import { Validator } from "../protocols/validator"

export default class UpdateCourseController {
  constructor(
    private readonly getCourse: GetCourse,
    private readonly updateCourse: UpdateCourse,
    private readonly validator: Validator<any>
  ) {}

  async execute(
    request: Request<Partial<Course>, { id: string }>
  ): Promise<Response> {
    const { params, body } = request
    const courseId = Number(params.id)

    const course = await this.getCourse.execute(courseId)

    if (!course) {
      throw new NotFoundError()
    }

    const validation = this.validator.validate(request.body)
    if (!validation.ok) {
      throw new ValidationError(validation.errors)
    }

    const updatedCourse = await this.updateCourse.execute(courseId, body)

    return {
      body: updatedCourse,
      status: 200,
    }
  }
}
