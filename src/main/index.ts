import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import "express-async-errors"
import CreateCourseController from "../presentation/controllers/createCourse"
import DBSaveCourse from "../data/useCases/saveCourse"
import DBSaveCourseRepo from "../repositories/saveCourse"
import GetCoursesController from "../presentation/controllers/getCourses"
import DBGetCourses from "../data/useCases/getCourses"
import DBGetCoursesRepo from "../repositories/getCourses"
import {
  ApplicationError,
  AuthError,
  NotFoundError,
  ValidationError,
} from "../presentation/protocols/errors"
import CreateCourseValidator from "../presentation/validators/createCourseValidator"
import GetCourseController from "../presentation/controllers/getCourse"
import DBGetCourse from "../data/useCases/getCourse"
import DBGetCourseRepo from "../repositories/getCourse"
import UpdateCourseController from "../presentation/controllers/updateCourse"
import { DBUpdateCourse } from "../data/useCases/updateCourse"
import DBUpdateCourseRepo from "../repositories/updateCourse"
import UpdateCourseValidator from "../presentation/validators/updateCourseValidator"
import DeleteCourseController from "../presentation/controllers/deleteCourse"
import DBDeleteCourseRepo from "../repositories/deleteCourse"
import DBDeleteCourse from "../data/useCases/deleteCourse"
import DBGetUserRepo from "../repositories/getUser"
import DBGetUser from "../data/useCases/getUser"
import AuthController from "../presentation/controllers/auth"
import { authenticateToken } from "./middlewares/auth"
import AuthValidator from "../presentation/validators/authValidator"
import { JWTTokenGenerator } from "../data/useCases/generateToken"

declare global {
  namespace Express {
    interface Request {
      user: {
        id: number
        username: string
      }
    }
  }
}

const app = express()
const port = process.env.PORT || "3000"

app.use(express.json())
app.use(cors())

app.get("/", async (_req, res) => {
  return res.status(200).json({ ok: true })
})

app.post("/login", async (req, res) => {
  const getUserRepo = new DBGetUserRepo()
  const getUser = new DBGetUser(getUserRepo)

  const validator = new AuthValidator()

  const tokenGenerator = new JWTTokenGenerator()

  const authController = new AuthController(getUser, tokenGenerator, validator)

  const response = await authController.execute({
    body: req.body,
    params: req.params,
  })

  return res.status(response.status).json(response.body)
})

app.use(authenticateToken)

app.post("/courses", async (req, res) => {
  const saveCourseRepo = new DBSaveCourseRepo()
  const saveCourse = new DBSaveCourse(saveCourseRepo)

  const validator = new CreateCourseValidator()

  const createCourseController = new CreateCourseController(
    saveCourse,
    validator
  )

  const response = await createCourseController.execute({
    body: req.body,
    params: req.params,
  })

  return res.status(response.status).json(response.body)
})

app.get("/courses", async (req, res) => {
  const getCoursesRepo = new DBGetCoursesRepo()
  const getCourses = new DBGetCourses(getCoursesRepo)
  const getCoursesController = new GetCoursesController(getCourses)

  const response = await getCoursesController.execute({
    body: {},
    params: req.query,
  })

  return res.status(response.status).json(response.body)
})

app.get("/courses/:id", async (req, res) => {
  const getCourseRepo = new DBGetCourseRepo()
  const getCourse = new DBGetCourse(getCourseRepo)
  const getCourseController = new GetCourseController(getCourse)

  const response = await getCourseController.execute({
    body: {},
    params: req.params,
  })

  return res.status(response.status).json(response.body)
})

app.put("/courses/:id", async (req, res) => {
  const getCourseRepo = new DBGetCourseRepo()
  const getCourse = new DBGetCourse(getCourseRepo)

  const updateCourseRepo = new DBUpdateCourseRepo()
  const updateCourse = new DBUpdateCourse(updateCourseRepo)

  const validator = new UpdateCourseValidator()

  const updateCourseController = new UpdateCourseController(
    getCourse,
    updateCourse,
    validator
  )

  const response = await updateCourseController.execute({
    body: req.body,
    params: req.params,
  })

  return res.status(response.status).json(response.body)
})

app.delete("/courses/:id", async (req, res) => {
  const getCourseRepo = new DBGetCourseRepo()
  const getCourse = new DBGetCourse(getCourseRepo)

  const deleteCourseRepo = new DBDeleteCourseRepo()
  const deleteCourse = new DBDeleteCourse(deleteCourseRepo)

  const updateCourseController = new DeleteCourseController(
    getCourse,
    deleteCourse
  )

  const response = await updateCourseController.execute({
    body: req.body,
    params: req.params,
  })

  return res.sendStatus(response.status)
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // Any application error must be thrown as an exeption
  if (err instanceof ApplicationError) {
    return res.status(400).json({
      type: "ApplicationError",
      message: err.message,
    })
  }

  if (err instanceof ValidationError) {
    return res.status(400).json({
      type: "ValidationError",
      errors: err.errors,
    })
  }

  if (err instanceof NotFoundError) {
    return res.status(404).json({
      message: err.message,
    })
  }

  if (err instanceof AuthError) {
    return res.status(401).json({
      message: err.message,
    })
  }

  // Internal erros are handled here
  return res.status(500).json({
    message: err.message,
  })
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
