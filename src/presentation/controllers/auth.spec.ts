import { Row } from "../../domain/models/DatabaseRow"
import { User } from "../../domain/models/User"
import { GenerateToken } from "../../domain/useCases/course/GenerateToken"
import { GetUser } from "../../domain/useCases/course/GetUser"
import { AuthError, ValidationError } from "../protocols/errors"
import { Request } from "../protocols/http"
import { ValidationRespose, Validator } from "../protocols/validator"
import AuthController from "./auth"

describe("AuthController", () => {
  const mockUser = {
    id: 1,
    name: "John Doe",
    username: "johndoe",
    password: "1234",
  }
  const mockToken = "valid-token"

  class GetUserStub implements GetUser {
    async execute(_username: string): Promise<Row<User> | null> {
      return mockUser
    }
  }

  class GenerateTokenStub implements GenerateToken {
    execute(_payload: { id: number; username: string }) {
      return mockToken
    }
  }

  class ValidatorStub extends Validator<any> {
    constructor() {
      super({})
    }

    validate(_data: unknown): ValidationRespose {
      return {
        ok: true,
      }
    }
  }

  const makeSut = () => {
    const getUser = new GetUserStub()
    const generateToken = new GenerateTokenStub()
    const validator = new ValidatorStub()
    const sut = new AuthController(getUser, generateToken, validator)
    return { sut, getUser, generateToken, validator }
  }

  const makeRequest = (): Request<{ username: string; password: string }> => ({
    body: { username: "johndoe", password: "1234" },
    params: {},
  })

  test("should call validator once", async () => {
    const { sut, validator } = makeSut()
    const spy = jest.spyOn(validator, "validate")

    await sut.execute(makeRequest())

    expect(spy).toHaveBeenCalledTimes(1)
  })

  test("should throw ValidationError if validation fails", async () => {
    const { sut, validator } = makeSut()

    jest.spyOn(validator, "validate").mockReturnValueOnce({
      ok: false,
      errors: [{ field: "username", message: "Username is required" }],
    })

    await expect(sut.execute(makeRequest())).rejects.toThrow(ValidationError)
  })

  test("should call getUser with correct username", async () => {
    const { sut, getUser } = makeSut()
    const spy = jest.spyOn(getUser, "execute")

    await sut.execute(makeRequest())

    expect(spy).toHaveBeenCalledWith("johndoe")
  })

  test("should throw AuthError if user is not found", async () => {
    const { sut, getUser } = makeSut()

    jest.spyOn(getUser, "execute").mockResolvedValueOnce(null)

    await expect(sut.execute(makeRequest())).rejects.toThrow(AuthError)
  })

  test("should throw AuthError if password does not match", async () => {
    const { sut, getUser } = makeSut()

    jest.spyOn(getUser, "execute").mockResolvedValueOnce({
      ...mockUser,
      password: "wrongpassword",
    })

    await expect(sut.execute(makeRequest())).rejects.toThrow(AuthError)
  })

  test("should call generateToken with correct payload", async () => {
    const { sut, generateToken } = makeSut()
    const spy = jest.spyOn(generateToken, "execute")

    await sut.execute(makeRequest())

    expect(spy).toHaveBeenCalledWith({ id: 1, username: "John Doe" })
  })

  test("should return 200 and token on success", async () => {
    const { sut } = makeSut()

    const response = await sut.execute(makeRequest())

    expect(response.status).toBe(200)
    expect(response.body.token).toBe(mockToken)
  })
})
