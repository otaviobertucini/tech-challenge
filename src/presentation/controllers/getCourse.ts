import { GetCourse } from "../../domain/useCases/course/GetCourse"
import { NotFoundError } from "../protocols/errors"
import { Request, Response } from "../protocols/http"

export default class GetCourseController {
  constructor(private readonly getCourse: GetCourse) {}

  async execute(request: Request<any, { id: string }>): Promise<Response> {
    const { params } = request

    const course = await this.getCourse.execute(Number(params.id))

    if (!course) {
      throw new NotFoundError()
    }

    return {
      body: course,
      status: 200,
    }
  }
}
