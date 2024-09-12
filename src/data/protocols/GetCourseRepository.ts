import { Row } from "../../domain/models/DatabaseRow"
import { Course } from "../../domain/models/Course"

export interface GetCourseRepository {
  execute(id: number): Promise<Row<Course> | null>
}
