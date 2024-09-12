export interface Request<T = any, U = any> {
  body: T
  params: U
}

export interface Response {
  status: number
  body: any
}
