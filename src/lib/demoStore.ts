import type { CitizenRequest } from '../types'
const STORAGE_KEY = 'cras-acolhe-demo-requests-v1'
export function saveDemoRequest(request: CitizenRequest): void {
  const current = getDemoRequests()
  localStorage.setItem(STORAGE_KEY, JSON.stringify([request, ...current]))
}
export function getDemoRequests(): CitizenRequest[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as CitizenRequest[] }
  catch { return [] }
}
