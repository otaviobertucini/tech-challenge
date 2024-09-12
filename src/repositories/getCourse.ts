import database from "../database"
import { Row } from "../domain/models/DatabaseRow"
import { Course } from "../domain/models/Course"
import { GetCourseRepository } from "../data/protocols/GetCourseRepository"

export default class DBGetCourseRepo implements GetCourseRepository {
  async execute(id: number): Promise<Row<Course> | null> {
    return database.courses.findById(id)
  }
}
