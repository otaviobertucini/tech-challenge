import { GenerateToken } from "../../domain/useCases/course/GenerateToken"
import { GetUser } from "../../domain/useCases/course/GetUser"
import { AuthError, ValidationError } from "../protocols/errors"
import { Request, Response } from "../protocols/http"
import { Validator } from "../protocols/validator"

export default class AuthController {
  constructor(
    private readonly getUser: GetUser,
    private readonly generateToken: GenerateToken,
    private readonly validator: Validator<any>
  ) {}

  async execute(
    request: Request<{ username: string; password: string }>
  ): Promise<Response> {
    const { body } = request

    const validation = this.validator.validate(body)
    if (!validation.ok) {
      throw new ValidationError(validation.errors)
    }

    const { password, username } = body

    const user = await this.getUser.execute(username)

    if (!user) {
      throw new AuthError("User not found")
    }

    if (user.password !== password) {
      throw new AuthError("Invalid credentials")
    }

    const token = this.generateToken.execute({
      id: user.id,
      username: user.name,
    })

    return {
      body: { token },
      status: 200,
    }
  }
}
