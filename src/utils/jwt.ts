import jwt from "jsonwebtoken"
import { JwtPayload } from "../domain/useCases/course/GenerateToken"

const JWT_SECRET = process.env.JWT_SECRET as string

class JwtFacade {
  private secret: string

  constructor() {
    this.secret = JWT_SECRET
  }

  staticgenerateToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: "1m" })
  }

  verifyToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, this.secret) as JwtPayload
    } catch (error) {
      return null
    }
  }
}

export default new JwtFacade()
