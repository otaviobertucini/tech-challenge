export interface JwtPayload {
  id: number
  username: string
}

export interface GenerateToken {
  execute(payload: JwtPayload): string
}
