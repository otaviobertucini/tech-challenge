export interface DeleteCourseRepository {
  execute(id: number): Promise<void>
}
