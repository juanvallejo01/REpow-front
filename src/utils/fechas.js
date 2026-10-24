// el proyecto trabaja en hora de Colombia (UTC-5)
const ZONA = 'America/Bogota'

// fecha de hoy como YYYY-MM-DD (el formato del <input type="date">)
export function hoy(){
  return new Date().toLocaleDateString('en-CA', { timeZone: ZONA })
}

// '2026-10-20' + '08:00' -> '2026-10-20T08:00:00-05:00' (lo que espera el back)
export function aFechaHora(fecha, hora){
  return `${fecha}T${hora}:00-05:00`
}

// fecha que manda el back -> '2026-10-20'
export function soloFecha(iso){
  return new Date(iso).toLocaleDateString('en-CA', { timeZone: ZONA })
}

// fecha que manda el back -> '08:00'
export function soloHora(iso){
  return new Date(iso).toLocaleTimeString('en-GB', { timeZone: ZONA, hour: '2-digit', minute: '2-digit' })
}

// fecha que manda el back -> 'martes, 20 de octubre'
export function textoFecha(iso){
  return new Date(iso).toLocaleDateString('es-CO', { timeZone: ZONA, weekday: 'long', day: 'numeric', month: 'long' })
}
