export const BASE_URL = 	"https://api.oluwasetemi.dev"

// export const BASE_URL = {
//   development: "http://localhost:8000/api",
//   production: "https://koola-mcf3.onrender.com/api"
// }

export const TASK_STATE = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "DONE",
  CANCELLED: "CANCELLED"
} as const

export const FILTERS = {
  ALL: "all",
  ACTIVE: "active",
  COMPLETED: "completed"
} as const

export type TaskState = (typeof TASK_STATE)[keyof typeof TASK_STATE]
export type Filter = (typeof FILTERS)[keyof typeof FILTERS]