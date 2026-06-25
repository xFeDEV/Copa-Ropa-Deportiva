// Tipos de datos del ERP/CRM de Copa Ropa Deportiva

export type MovimientoTipo = "Entrada" | "Salida"

export interface MovimientoKardex {
  id: string
  fecha: string
  codigoPrenda: string
  talla: string
  color: string
  tipo: MovimientoTipo
  cantidad: number
}

export interface Cliente {
  id: string
  nombre: string
  nit: string
  telefono: string
  ultimaCompra: string // ISO date
}

export interface Orden {
  id: string
  cliente: string
  producto: string
  estado: "En producción" | "Diseño" | "Entregado" | "Pendiente"
  total: number
}

// Formatea moneda en pesos colombianos
export function formatCOP(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

// Calcula días transcurridos desde una fecha
export function diasDesde(fechaISO: string): number {
  const fecha = new Date(fechaISO)
  const hoy = new Date()
  const diff = hoy.getTime() - fecha.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export function formatFecha(fechaISO: string): string {
  return new Date(fechaISO).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

// --- Datos de ejemplo ---

export const movimientos: MovimientoKardex[] = [
  { id: "1", fecha: "2026-06-20", codigoPrenda: "CAM-POLO-001", talla: "M", color: "Azul", tipo: "Entrada", cantidad: 120 },
  { id: "2", fecha: "2026-06-19", codigoPrenda: "CAM-POLO-001", talla: "L", color: "Azul", tipo: "Salida", cantidad: 45 },
  { id: "3", fecha: "2026-06-18", codigoPrenda: "SUD-CAP-014", talla: "XL", color: "Negro", tipo: "Entrada", cantidad: 80 },
  { id: "4", fecha: "2026-06-17", codigoPrenda: "PAN-DEP-009", talla: "S", color: "Gris", tipo: "Salida", cantidad: 30 },
  { id: "5", fecha: "2026-06-16", codigoPrenda: "CAM-FUT-022", talla: "M", color: "Verde", tipo: "Entrada", cantidad: 200 },
  { id: "6", fecha: "2026-06-15", codigoPrenda: "CAM-FUT-022", talla: "M", color: "Verde", tipo: "Salida", cantidad: 150 },
  { id: "7", fecha: "2026-06-14", codigoPrenda: "CHA-LIV-031", talla: "L", color: "Rojo", tipo: "Entrada", cantidad: 60 },
  { id: "8", fecha: "2026-06-12", codigoPrenda: "SUD-CAP-014", talla: "M", color: "Negro", tipo: "Salida", cantidad: 25 },
  { id: "9", fecha: "2026-06-10", codigoPrenda: "PAN-DEP-009", talla: "L", color: "Gris", tipo: "Entrada", cantidad: 90 },
  { id: "10", fecha: "2026-06-08", codigoPrenda: "CAM-POLO-001", talla: "S", color: "Blanco", tipo: "Salida", cantidad: 18 },
]

export const clientes: Cliente[] = [
  { id: "1", nombre: "Club Deportivo Los Andes", nit: "900.123.456-7", telefono: "+57 310 555 1234", ultimaCompra: "2026-06-10" },
  { id: "2", nombre: "Colegio San Mateo", nit: "830.987.654-3", telefono: "+57 320 555 8899", ultimaCompra: "2026-05-28" },
  { id: "3", nombre: "Gimnasio FitZone S.A.S", nit: "901.456.789-1", telefono: "+57 315 555 4567", ultimaCompra: "2026-02-15" },
  { id: "4", nombre: "Liga Municipal de Fútbol", nit: "800.321.654-9", telefono: "+57 301 555 7788", ultimaCompra: "2026-06-18" },
  { id: "5", nombre: "Academia Tenis Pro", nit: "901.111.222-4", telefono: "+57 312 555 3322", ultimaCompra: "2026-01-20" },
  { id: "6", nombre: "Empresa Constructora Vial", nit: "860.555.111-2", telefono: "+57 318 555 9090", ultimaCompra: "2026-03-05" },
  { id: "7", nombre: "Equipo Atlético Bolívar", nit: "901.777.888-5", telefono: "+57 311 555 1212", ultimaCompra: "2026-06-01" },
]

export const ordenes: Orden[] = [
  { id: "0466", cliente: "Club Deportivo Los Andes", producto: "Camiseta tipo Polo x150", estado: "En producción", total: 4500000 },
  { id: "0465", cliente: "Liga Municipal de Fútbol", producto: "Uniforme completo x80", estado: "Diseño", total: 8200000 },
  { id: "0464", cliente: "Colegio San Mateo", producto: "Sudadera con capota x200", estado: "Pendiente", total: 6800000 },
  { id: "0463", cliente: "Equipo Atlético Bolívar", producto: "Camiseta fútbol x100", estado: "En producción", total: 3100000 },
  { id: "0462", cliente: "Gimnasio FitZone S.A.S", producto: "Pantaloneta deportiva x120", estado: "Entregado", total: 2400000 },
]

export const ventasMensuales = [
  { mes: "Ene", ventas: 32000000 },
  { mes: "Feb", ventas: 28500000 },
  { mes: "Mar", ventas: 41000000 },
  { mes: "Abr", ventas: 38200000 },
  { mes: "May", ventas: 45800000 },
  { mes: "Jun", ventas: 52300000 },
]

export const UMBRAL_INACTIVIDAD_DIAS = 90

// Último número de cotización emitido — incrementar al crear una nueva
export const ULTIMO_NUMERO_COTIZACION = 466
