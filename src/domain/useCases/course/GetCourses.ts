import { Row } from "../../models/DatabaseRow"
import { Course } from "../../models/Course"

export interface GetCourses {
  execute(filters: Partial<Row<Course>>): Promise<Row<Course>[]>
}
