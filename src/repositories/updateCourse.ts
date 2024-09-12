import database from "../database"
import { Row } from "../domain/models/DatabaseRow"
import { Course } from "../domain/models/Course"
import { UpdateCourseRepository } from "../data/protocols/UpdateCourseRepository"

export default class DBUpdateCourseRepo implements UpdateCourseRepository {
  async execute(id: number, data: Partial<Course>): Promise<Row<Course>> {
    // console.log(`🚀 ~ DBUpdateCourseRepo ~ execute ~ data:`, data)
    const updatedCourse = database.courses.update(id, data)
    if (!updatedCourse) throw new Error("Course not found")

    return updatedCourse
  }
}
