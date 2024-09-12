interface Course {
  title: string
  description?: string
  duration: number
  instructor: string
}

interface User {
  name: string
  password: string
}

class Table<T> {
  rows: (T & { id: number })[]
  private _id: number

  constructor(rows: T[] = []) {
    this._id = 0
    this.rows = []
    rows.forEach((row) => this.insert(row))
  }

  public all() {
    return this.rows
  }

  public insert(data: T) {
    const newData = { id: ++this._id, ...data }
    this.rows.push(newData)

    return newData
  }

  public update(id: number, data: Partial<T>) {
    const toUpdateRowIndex = this.rows.findIndex((row) => row.id === id)

    if (toUpdateRowIndex === -1) return null

    this.rows[toUpdateRowIndex] = {
      ...this.rows[toUpdateRowIndex],
      ...data,
    }

    return this.rows[toUpdateRowIndex]
  }

  public findById(id: number) {
    return this.rows.find((row) => row.id === id) || null
  }

  public find(filters: Partial<T & { id?: number }>) {
    return this.rows.filter((row) => {
      return Object.entries(filters).every(
        ([key, value]) => String(row[key as keyof typeof row]) === value
      )
    })
  }

  public delete(id: number): T | null {
    const toDeleteRowIndex = this.rows.findIndex((row) => row.id === id)

    if (toDeleteRowIndex === -1) {
      return null
    }

    const deletedRow = this.rows[toDeleteRowIndex]

    this.rows.splice(toDeleteRowIndex, 1)

    return deletedRow
  }
}

class Database {
  private static _instance: Database
  public courses: Table<Course>
  public users: Table<User>

  private constructor() {
    this.courses = new Table<Course>()
    this.users = new Table<User>([
      { name: "otavio", password: "12345" },
      { name: "wiley", password: "12345" },
    ])
  }

  public static get Instance() {
    return this._instance || (this._instance = new this())
  }
}

export default Database.Instance
