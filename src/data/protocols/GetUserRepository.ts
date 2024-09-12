import { Row } from "../../domain/models/DatabaseRow"
import { User } from "../../domain/models/User"

export interface GetUserRepository {
  execute(username: string): Promise<Row<User> | null>
}
