import { DeleteCourse } from "../../domain/useCases/course/DeleteCourse"
import { DeleteCourseRepository } from "../protocols/DeleteCourseRepository"

export default class DBDeleteCourse implements DeleteCourse {
  constructor(private readonly deleteCourseRepo: DeleteCourseRepository) {}

  async execute(id: number): Promise<void> {
    await this.deleteCourseRepo.execute(id)
  }
}
