import { Row } from "../../domain/models/DatabaseRow"
import { Course } from "../../domain/models/Course"
import { UpdateCourse } from "../../domain/useCases/course/UpdateCourse"
import { UpdateCourseRepository } from "../protocols/UpdateCourseRepository"

export class DBUpdateCourse implements UpdateCourse {
  constructor(private readonly updateCourseRepo: UpdateCourseRepository) {}

  execute(id: number, data: Course): Promise<Row<Course>> {
    return this.updateCourseRepo.execute(id, data)
  }
}
