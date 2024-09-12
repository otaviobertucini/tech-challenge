import database from "../database"
import { Row } from "../domain/models/DatabaseRow"
import { Course } from "../domain/models/Course"
import { GetCourses } from "../domain/useCases/course/GetCourses"

export default class DBGetCoursesRepo implements GetCourses {
  async execute(filters: Partial<Row<Course>>): Promise<Row<Course>[]> {
    return database.courses.find(filters)
  }
}
