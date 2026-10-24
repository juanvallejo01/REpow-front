import axios from 'axios'

// instancia de axios con la url base de nuestro back (Express + PostgreSQL)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 15000,
})

// el back siempre responde { success, data }: cada funcion devuelve solo "data"

export async function getEspacios(){
  const { data } = await api.get('/espacios')
  return data.data
}

export async function getEspacio(id){
  const { data } = await api.get(`/espacios/${id}`)
  return data.data
}

// reservas activas de un espacio en un dia (fecha: YYYY-MM-DD)
export async function getOcupacion(id, fecha){
  const { data } = await api.get(`/espacios/${id}/reservas`, { params: { fecha } })
  return data.data.reservas
}

export async function getReservas(){
  const { data } = await api.get('/reservas')
  return data.data
}

export async function crearReserva(datos){
  const { data } = await api.post('/reservas', datos)
  return data.data
}

// la version de la reserva va en el header If-Match
// si otra persona la cambio antes, el back responde 412
export async function editarReserva(reserva, datos){
  const { data } = await api.put(`/reservas/${reserva.id}`, datos, {
    headers: { 'If-Match': `"${reserva.version}"` },
  })
  return data.data
}

export async function cancelarReserva(reserva){
  const { data } = await api.delete(`/reservas/${reserva.id}`, {
    headers: { 'If-Match': `"${reserva.version}"` },
  })
  return data.data
}

// mensaje del back para mostrarlo en pantalla
export function mensajeDeError(e){
  return e.response?.data?.message || 'No se pudo conectar con el servidor'
}
