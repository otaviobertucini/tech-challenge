import { SaveCourseRepository } from "../data/protocols/SaveCourseRepository"
import database from "../database"
import { Row } from "../domain/models/DatabaseRow"
import { Course } from "../domain/models/Course"

export default class DBSaveCourseRepo implements SaveCourseRepository {
  async execute(data: Course): Promise<Row<Course>> {
    return database.courses.insert(data)
  }
}
