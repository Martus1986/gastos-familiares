import { createClient } from '@supabase/supabase-js'
const URL = 'https://qxlbarrnraukiixsuxfx.supabase.co'
const KEY = 'sb_publishable_SI6PHWAhs8LxD_k4DtA9Wg_0smfN8xi'
export const supabase = createClient(URL, KEY)

export async function leerDato(id) {
  const { data } = await supabase.from('datos_app').select('valor').eq('id', id).single()
  return data?.valor ?? null
}

export async function guardarDato(id, valor) {
  await supabase.from('datos_app').upsert({ id, valor, actualizado_en: new Date().toISOString() })
}
