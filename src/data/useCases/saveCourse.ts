import { Row } from "../../domain/models/DatabaseRow"
import { Course } from "../../domain/models/Course"
import { SaveCourse } from "../../domain/useCases/course/SaveCourse"
import { SaveCourseRepository } from "../protocols/SaveCourseRepository"

export default class DBSaveCourse implements SaveCourse {
  constructor(private readonly saveCourseRepo: SaveCourseRepository) {}

  execute(data: Course): Promise<Row<Course>> {
    return this.saveCourseRepo.execute(data)
  }
}
