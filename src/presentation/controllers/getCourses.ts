import { GetCourses } from "../../domain/useCases/course/GetCourses"
import { Request, Response } from "../protocols/http"

export default class GetCoursesController {
  constructor(private readonly getCourses: GetCourses) {}

  async execute(request: Request): Promise<Response> {
    const { params } = request

    const courses = await this.getCourses.execute(params)

    return {
      body: courses,
      status: 200,
    }
  }
}
