import { Row } from "../../models/DatabaseRow"
import { Course } from "../../models/Course"

export interface UpdateCourse {
  execute(id: number, data: Partial<Course>): Promise<Row<Course>>
}
