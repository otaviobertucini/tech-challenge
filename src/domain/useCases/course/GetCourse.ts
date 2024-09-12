import { Row } from "../../models/DatabaseRow"
import { Course } from "../../models/Course"

export interface GetCourse {
  execute(id: number): Promise<Row<Course> | null>
}
