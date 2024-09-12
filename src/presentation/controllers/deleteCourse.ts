import { DeleteCourse } from "../../domain/useCases/course/DeleteCourse"
import { GetCourse } from "../../domain/useCases/course/GetCourse"
import { NotFoundError } from "../protocols/errors"
import { Request, Response } from "../protocols/http"

export default class DeleteCourseController {
  constructor(
    private readonly getCourse: GetCourse,
    private readonly deleteCourse: DeleteCourse
  ) {}

  async execute(request: Request<null, { id: string }>): Promise<Response> {
    const { params } = request
    const courseId = Number(params.id)

    const course = await this.getCourse.execute(courseId)

    if (!course) {
      throw new NotFoundError()
    }

    await this.deleteCourse.execute(courseId)

    return {
      body: null,
      status: 204,
    }
  }
}
