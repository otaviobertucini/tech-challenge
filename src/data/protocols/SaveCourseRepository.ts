import { Row } from "../../domain/models/DatabaseRow"
import { Course } from "../../domain/models/Course"

export interface SaveCourseRepository {
  execute(data: Course): Promise<Row<Course>>
}
