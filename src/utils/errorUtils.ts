type ApiError = {
  response?: {
    data?: {
      message?: string,
      error?: {
        issues?: { message: string }[]
      }
    }
  }
}

export const isApiError = (error: unknown): error is ApiError => {
  return typeof error === "object" && error !== null && "response" in error
}