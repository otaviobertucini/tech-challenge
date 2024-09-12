import {
  GenerateToken,
  JwtPayload,
} from "../../domain/useCases/course/GenerateToken"
import jwt from "../../utils/jwt"

export class JWTTokenGenerator implements GenerateToken {
  execute(payload: JwtPayload): string {
    return jwt.staticgenerateToken(payload)
  }
}
