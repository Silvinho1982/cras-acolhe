import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// O portal funciona em demonstração sem conectar ao Supabase.
// Não inclua a chave service_role no frontend em hipótese alguma.
export const supabase = url && key ? createClient(url, key) : null
export const isDemoMode = import.meta.env.VITE_DEMO_MODE !== 'false' || !supabase
