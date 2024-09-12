export interface DeleteCourse {
  execute(id: number): Promise<void>
}
