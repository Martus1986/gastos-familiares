js
import { createClient } from '@supabase/supabase-js'
const URL = 'https://qxlbarrnraukiixsuxfx.supabase.co'
const KEY = 'sb_publishable_SI6PHWAhs8LxD_k4DtA9Wg_0smfN8xi'
export const supabase = createClient(URL, KEY)

export async function leerDato(id) {
  const { data } = await supabase.from('datos_app').select('valor').eq('id', id).single()
  return data?.valor ?? null
}

export async function guardarDato(id, valor) {
  // Guardar backup con fecha antes de pisar el valor actual
  try {
    const hoy = new Date().toISOString().slice(0, 10);
    const backupId = `${id}_backup_${hoy}`;
    const { data: existing } = await supabase.from('datos_app').select('id').eq('id', backupId).single();
    if (!existing) {
      const { data: actual } = await supabase.from('datos_app').select('valor').eq('id', id).single();
      if (actual?.valor) {
        await supabase.from('datos_app').upsert({ id: backupId, valor: actual.valor, actualizado_en: new Date().toISOString() });
      }
    }
  } catch(e) { /* backup falla silenciosamente */ }
  await supabase.from('datos_app').upsert({ id, valor, actualizado_en: new Date().toISOString() })
}
