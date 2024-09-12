import { Row } from "../../models/DatabaseRow"
import { Course } from "../../models/Course"

export interface SaveCourse {
  execute(data: Course): Promise<Row<Course>>
}
