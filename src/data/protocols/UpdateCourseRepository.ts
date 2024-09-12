import { Row } from "../../domain/models/DatabaseRow"
import { Course } from "../../domain/models/Course"

export interface UpdateCourseRepository {
  execute(id: number, data: Course): Promise<Row<Course>>
}
