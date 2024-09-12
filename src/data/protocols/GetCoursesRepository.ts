import { Row } from "../../domain/models/DatabaseRow"
import { Course } from "../../domain/models/Course"

export interface GetCoursesRepository {
  execute(filters: Partial<Row<Course>>): Promise<Row<Course>[]>
}
