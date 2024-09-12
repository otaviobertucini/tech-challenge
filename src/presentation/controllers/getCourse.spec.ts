import { Course } from "../../domain/models/Course"
import { Row } from "../../domain/models/DatabaseRow"
import { GetCourse } from "../../domain/useCases/course/GetCourse"
import { NotFoundError } from "../protocols/errors"
import { Request } from "../protocols/http"
import GetCourseController from "./getCourse"

describe("GetCourseController", () => {
  const mockCouse: Course = {
    title: "Sample Course",
    description: "Course description",
    duration: 30,
    instructor: "Mock",
  }

  class GetCourseStub implements GetCourse {
    async execute(id: number): Promise<Row<Course> | null> {
      return {
        id,
        ...mockCouse,
      }
    }
  }

  const makeSut = () => {
    const getCourse = new GetCourseStub()
    const sut = new GetCourseController(getCourse)
    return { sut, getCourse }
  }

  const makeRequest = (id: string): Request => ({
    body: {},
    params: { id },
  })

  test("should call getCourse with correct id", async () => {
    const { sut, getCourse } = makeSut()
    const spy = jest.spyOn(getCourse, "execute")

    await sut.execute(makeRequest("1"))

    expect(spy).toHaveBeenCalledWith(1)
  })

  test("should return 200 and the course on success", async () => {
    const { sut } = makeSut()

    const response = await sut.execute(makeRequest("1"))

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      id: 1,
      ...mockCouse,
    })
  })

  test("should throw NotFoundError if course is not found", async () => {
    const { sut, getCourse } = makeSut()

    jest.spyOn(getCourse, "execute").mockResolvedValueOnce(null)

    await expect(sut.execute(makeRequest("999"))).rejects.toThrow(NotFoundError)
  })

  test("should call getCourse once", async () => {
    const { sut, getCourse } = makeSut()
    const spy = jest.spyOn(getCourse, "execute")

    await sut.execute(makeRequest("1"))

    expect(spy).toHaveBeenCalledTimes(1)
  })
})
