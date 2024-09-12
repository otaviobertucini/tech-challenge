import { Row } from "../../domain/models/DatabaseRow"
import { Course } from "../../domain/models/Course"
import { GetCourse } from "../../domain/useCases/course/GetCourse"
import { GetCourseRepository } from "../protocols/GetCourseRepository"

export default class DBGetCourse implements GetCourse {
  constructor(private readonly getCourseRepo: GetCourseRepository) {}

  async execute(id: number): Promise<Row<Course> | null> {
    return this.getCourseRepo.execute(id)
  }
}
