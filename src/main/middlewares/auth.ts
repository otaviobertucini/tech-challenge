import { Request, Response, NextFunction } from "express"
import jwt from "../../utils/jwt"
import { AuthError } from "../../presentation/protocols/errors"

export function authenticateToken(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (token == null) {
    throw new AuthError("Token not found")
  }

  const user = jwt.verifyToken(token)

  if (!user) {
    throw new AuthError("Unauthorized")
  }

  req.user = user
  next()
}
