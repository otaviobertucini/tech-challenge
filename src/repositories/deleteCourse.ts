import database from "../database"
import { DeleteCourseRepository } from "../data/protocols/DeleteCourseRepository"

export default class DBDeleteCourseRepo implements DeleteCourseRepository {
  async execute(id: number): Promise<void> {
    await database.courses.delete(id)
  }
}
