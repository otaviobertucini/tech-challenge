import { Course } from "../../domain/models/Course"
import { SaveCourse } from "../../domain/useCases/course/SaveCourse"
import { ValidationError } from "../protocols/errors"
import { Request } from "../protocols/http"
import { ValidationRespose, Validator } from "../protocols/validator"
import CreateCourseController from "./createCourse"

describe("CreateCourseController", () => {
  const mockedBody: Course = {
    title: "Sample Course",
    description: "A sample course description",
    duration: 120,
    instructor: "John Doe",
  }

  class SaveCourseStub implements SaveCourse {
    async execute(data: any) {
      return { id: 1, ...data }
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
    const saveCourse = new SaveCourseStub()
    const validator = new ValidatorStub()
    const sut = new CreateCourseController(saveCourse, validator)
    return { sut, saveCourse, validator }
  }

  const makeRequest = (): Request => ({
    body: mockedBody,
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
      errors: [{ field: "title", message: "Title is required" }],
    })

    await expect(sut.execute(makeRequest())).rejects.toThrow(ValidationError)
  })

  test("should call saveCourse once", async () => {
    const { sut, saveCourse } = makeSut()
    const spy = jest.spyOn(saveCourse, "execute")

    await sut.execute(makeRequest())

    expect(spy).toHaveBeenCalledTimes(1)
  })

  test("should return 200 and the saved course on success", async () => {
    const { sut } = makeSut()

    const response = await sut.execute(makeRequest())

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      id: 1,
      ...mockedBody,
    })
  })

  test("should handle saveCourse failure gracefully", async () => {
    const { sut, saveCourse } = makeSut()

    jest
      .spyOn(saveCourse, "execute")
      .mockRejectedValueOnce(new Error("Save error"))

    await expect(sut.execute(makeRequest())).rejects.toThrow("Save error")
  })
})
