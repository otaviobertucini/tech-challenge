import { Row } from "../../domain/models/DatabaseRow"
import { Course } from "../../domain/models/Course"
import { GetCourses } from "../../domain/useCases/course/GetCourses"
import { GetCoursesRepository } from "../protocols/GetCoursesRepository"

export default class DBGetCourses implements GetCourses {
  constructor(private readonly getCoursesRepo: GetCoursesRepository) {}

  async execute(filters: Partial<Row<Course>>): Promise<Row<Course>[]> {
    return this.getCoursesRepo.execute(filters)
  }
}
