import { Row } from "../../domain/models/DatabaseRow"
import { GetUser } from "../../domain/useCases/course/GetUser"
import { GetUserRepository } from "../protocols/GetUserRepository"
import { User } from "../../domain/models/User"

export default class DBGetUser implements GetUser {
  constructor(private readonly getUserRepo: GetUserRepository) {}

  async execute(username: string): Promise<Row<User> | null> {
    return this.getUserRepo.execute(username)
  }
}
