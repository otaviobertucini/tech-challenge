import { Row } from "../../models/DatabaseRow"
import { User } from "../../models/User"

export interface GetUser {
  execute(username: string): Promise<Row<User> | null>
}
