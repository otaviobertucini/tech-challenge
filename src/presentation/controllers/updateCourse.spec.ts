import { Course } from "../../domain/models/Course"
import { Row } from "../../domain/models/DatabaseRow"
import { GetCourse } from "../../domain/useCases/course/GetCourse"
import { UpdateCourse } from "../../domain/useCases/course/UpdateCourse"
import { NotFoundError, ValidationError } from "../protocols/errors"
import { Request } from "../protocols/http"
import { ValidationRespose, Validator } from "../protocols/validator"
import UpdateCourseController from "./updateCourse"

describe("UpdateCourseController", () => {
  const mockedCourse: Course = {
    title: "Sample Course",
    description: "A sample course description",
    duration: 120,
    instructor: "John Doe",
  }

  class GetCourseStub implements GetCourse {
    async execute(id: number): Promise<Row<Course> | null> {
      return { id, ...mockedCourse }
    }
  }

  class UpdateCourseStub implements UpdateCourse {
    async execute(id: number, data: Partial<Course>) {
      return { id, ...mockedCourse, ...data }
    }
  }

  class ValidatorStub extends Validator<any> {
    constructor() {
      super({})
    }

    validate(_data: unknown): ValidationRespose {
      return { ok: true }
    }
  }

  const makeSut = () => {
    const getCourse = new GetCourseStub()
    const updateCourse = new UpdateCourseStub()
    const validator = new ValidatorStub()
    const sut = new UpdateCourseController(getCourse, updateCourse, validator)
    return { sut, getCourse, updateCourse, validator }
  }

  const makeRequest = (): Request => ({
    body: { title: "Updated Course" },
    params: { id: "1" },
  })

  test("should call getCourse once with correct id", async () => {
    const { sut, getCourse } = makeSut()
    const spy = jest.spyOn(getCourse, "execute")

    await sut.execute(makeRequest())

    expect(spy).toHaveBeenCalledWith(1)
  })

  test("should throw NotFoundError if course is not found", async () => {
    const { sut, getCourse } = makeSut()

    jest.spyOn(getCourse, "execute").mockResolvedValueOnce(null)

    await expect(sut.execute(makeRequest())).rejects.toThrow(NotFoundError)
  })

  test("should call validator once with the request body", async () => {
    const { sut, validator } = makeSut()
    const spy = jest.spyOn(validator, "validate")

    const request = makeRequest()

    await sut.execute(request)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(request.body)
  })

  test("should throw ValidationError if validation fails", async () => {
    const { sut, validator } = makeSut()

    jest.spyOn(validator, "validate").mockReturnValueOnce({
      ok: false,
      errors: [{ field: "title", message: "Title is required" }],
    })

    await expect(sut.execute(makeRequest())).rejects.toThrow(ValidationError)
  })

  test("should call updateCourse with the correct id and data", async () => {
    const { sut, updateCourse } = makeSut()
    const spy = jest.spyOn(updateCourse, "execute")

    await sut.execute(makeRequest())

    expect(spy).toHaveBeenCalledWith(1, { title: "Updated Course" })
  })

  test("should return 200 and the updated course on success", async () => {
    const { sut } = makeSut()

    const response = await sut.execute(makeRequest())

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      id: 1,
      ...mockedCourse,
      title: "Updated Course",
    })
  })
})
