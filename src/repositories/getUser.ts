import database from "../database"
import { Row } from "../domain/models/DatabaseRow"
import { GetUserRepository } from "../data/protocols/GetUserRepository"
import { User } from "../domain/models/User"

export default class DBGetUserRepo implements GetUserRepository {
  async execute(username: string): Promise<Row<User> | null> {
    return database.users.find({ name: username })[0]
  }
}
