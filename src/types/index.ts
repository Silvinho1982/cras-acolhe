export type ServiceId = 'food' | 'funeral' | 'travel' | 'elder' | 'autism' | 'freepass' | 'cadunico' | 'other'
export type CadunicoStatus = 'yes' | 'no' | 'unknown'
export type RequestStatus = 'received' | 'review' | 'scheduled' | 'referred' | 'completed'
export interface ServiceOption { id: ServiceId; title: string; description: string; icon: string; guidance: string; cadunicoNote: string }
export interface CitizenRequest { protocol: string; name: string; phone: string; serviceId: ServiceId; cadunico: CadunicoStatus; unit: string; createdAt: string; status: RequestStatus }
