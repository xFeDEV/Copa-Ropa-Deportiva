/**
 * catalogos-store.ts
 *
 * Store de catálogos para el formulario de cotizaciones.
 * Persiste en localStorage — preparado para reemplazar con fetch() al tener backend.
 *
 * Migración futura: reemplazar las funciones internas por llamadas REST:
 *   GET    /api/catalogos/:tipo
 *   POST   /api/catalogos/:tipo
 *   PUT    /api/catalogos/:tipo/:id
 *   DELETE /api/catalogos/:tipo/:id
 */

"use client"

import { useState, useEffect, useCallback } from "react"

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface ItemCatalogo {
  id: string
  nombre: string
}

export interface ClienteCatalogo {
  id: string
  nombre: string
  nit: string
  telefono: string
}

export type TipoCatalogo = "tiposProducto" | "telas" | "tiposDecoracion" | "composiciones"

export interface Catalogos {
  tiposProducto: ItemCatalogo[]
  telas: ItemCatalogo[]
  tiposDecoracion: ItemCatalogo[]
  composiciones: ItemCatalogo[]
}

export interface CatalogosExtendidos extends Catalogos {
  clientes: ClienteCatalogo[]
  ultimoNumeroCotizacion: number
}

// ─── Datos iniciales (seed) ───────────────────────────────────────────────────

const SEED_CATALOGOS: Catalogos = {
  tiposProducto: [
    { id: "tp-1", nombre: "CAMISETA TIPO POLO" },
    { id: "tp-2", nombre: "CAMISETA DE FÚTBOL" },
    { id: "tp-3", nombre: "SUDADERA CON CAPOTA" },
    { id: "tp-4", nombre: "PANTALONETA DEPORTIVA" },
    { id: "tp-5", nombre: "CHAQUETA LIVIANA" },
    { id: "tp-6", nombre: "UNIFORME COMPLETO" },
  ],
  telas: [
    { id: "te-1", nombre: "SUDAFRICA" },
    { id: "te-2", nombre: "DRY FIT" },
    { id: "te-3", nombre: "ALGODÓN PERCHADO" },
    { id: "te-4", nombre: "LICRA POLIÉSTER" },
    { id: "te-5", nombre: "MICROFIBRA" },
  ],
  tiposDecoracion: [
    { id: "td-1", nombre: "IMPRESIÓN DIGITAL" },
    { id: "td-2", nombre: "BORDADO" },
    { id: "td-3", nombre: "SUBLIMACIÓN" },
    { id: "td-4", nombre: "SERIGRAFÍA" },
    { id: "td-5", nombre: "TRANSFER" },
  ],
  composiciones: [
    { id: "co-1", nombre: "100% POLIÉSTER" },
    { id: "co-2", nombre: "80% POLIÉSTER / 20% ELASTANO" },
    { id: "co-3", nombre: "100% ALGODÓN" },
    { id: "co-4", nombre: "65% POLIÉSTER / 35% ALGODÓN" },
    { id: "co-5", nombre: "90% POLIÉSTER / 10% LICRA" },
  ],
}

const SEED_CLIENTES: ClienteCatalogo[] = [
  { id: "cl-1", nombre: "Club Deportivo Los Andes", nit: "900.123.456-7", telefono: "+57 310 555 1234" },
  { id: "cl-2", nombre: "Colegio San Mateo", nit: "830.987.654-3", telefono: "+57 320 555 8899" },
  { id: "cl-3", nombre: "Gimnasio FitZone S.A.S", nit: "901.456.789-1", telefono: "+57 315 555 4567" },
  { id: "cl-4", nombre: "Liga Municipal de Fútbol", nit: "800.321.654-9", telefono: "+57 301 555 7788" },
  { id: "cl-5", nombre: "Academia Tenis Pro", nit: "901.111.222-4", telefono: "+57 312 555 3322" },
  { id: "cl-6", nombre: "Empresa Constructora Vial", nit: "860.555.111-2", telefono: "+57 318 555 9090" },
  { id: "cl-7", nombre: "Equipo Atlético Bolívar", nit: "901.777.888-5", telefono: "+57 311 555 1212" },
]

const SEED: CatalogosExtendidos = {
  ...SEED_CATALOGOS,
  clientes: SEED_CLIENTES,
  ultimoNumeroCotizacion: 466,
}

const STORAGE_KEY = "copa_catalogos_v2"

// ─── Helpers localStorage ─────────────────────────────────────────────────────

function leerStorage(): CatalogosExtendidos {
  if (typeof window === "undefined") return SEED
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return SEED
    const parsed = JSON.parse(raw) as CatalogosExtendidos
    // Migrar si no tiene los nuevos campos
    if (!parsed.clientes) parsed.clientes = SEED_CLIENTES
    if (!parsed.ultimoNumeroCotizacion) parsed.ultimoNumeroCotizacion = 466
    return parsed
  } catch {
    return SEED
  }
}

function escribirStorage(data: CatalogosExtendidos): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// ─── Hook principal ───────────────────────────────────────────────────────────

export function useCatalogos() {
  const [catalogos, setCatalogos] = useState<CatalogosExtendidos>(SEED)

  // Carga inicial desde localStorage
  useEffect(() => {
    setCatalogos(leerStorage())
  }, [])

  // Persiste cada cambio
  const actualizar = useCallback((nuevo: CatalogosExtendidos) => {
    setCatalogos(nuevo)
    escribirStorage(nuevo)
  }, [])

  // ── CRUD catálogos simples (ItemCatalogo) ─────────────────────────────────

  const agregar = useCallback(
    (tipo: TipoCatalogo, nombre: string) => {
      const trimmed = nombre.trim().toUpperCase()
      if (!trimmed) return
      const nuevo: ItemCatalogo = { id: crypto.randomUUID(), nombre: trimmed }
      actualizar({ ...catalogos, [tipo]: [...catalogos[tipo], nuevo] })
    },
    [catalogos, actualizar],
  )

  const editar = useCallback(
    (tipo: TipoCatalogo, id: string, nombre: string) => {
      const trimmed = nombre.trim().toUpperCase()
      if (!trimmed) return
      actualizar({
        ...catalogos,
        [tipo]: catalogos[tipo].map((item) =>
          item.id === id ? { ...item, nombre: trimmed } : item,
        ),
      })
    },
    [catalogos, actualizar],
  )

  const eliminar = useCallback(
    (tipo: TipoCatalogo, id: string) => {
      actualizar({
        ...catalogos,
        [tipo]: catalogos[tipo].filter((item) => item.id !== id),
      })
    },
    [catalogos, actualizar],
  )

  const resetear = useCallback(() => {
    actualizar(SEED)
  }, [actualizar])

  // ── CRUD clientes ─────────────────────────────────────────────────────────

  const agregarCliente = useCallback(
    (cliente: Omit<ClienteCatalogo, "id">) => {
      const nuevo: ClienteCatalogo = { id: crypto.randomUUID(), ...cliente }
      actualizar({ ...catalogos, clientes: [...catalogos.clientes, nuevo] })
    },
    [catalogos, actualizar],
  )

  const editarCliente = useCallback(
    (id: string, data: Omit<ClienteCatalogo, "id">) => {
      actualizar({
        ...catalogos,
        clientes: catalogos.clientes.map((c) =>
          c.id === id ? { ...c, ...data } : c,
        ),
      })
    },
    [catalogos, actualizar],
  )

  const eliminarCliente = useCallback(
    (id: string) => {
      actualizar({
        ...catalogos,
        clientes: catalogos.clientes.filter((c) => c.id !== id),
      })
    },
    [catalogos, actualizar],
  )

  // ── Número de cotización ──────────────────────────────────────────────────

  const siguienteNumeroCotizacion = useCallback(() => {
    const next = catalogos.ultimoNumeroCotizacion + 1
    actualizar({ ...catalogos, ultimoNumeroCotizacion: next })
    return next
  }, [catalogos, actualizar])

  return {
    catalogos,
    agregar,
    editar,
    eliminar,
    resetear,
    agregarCliente,
    editarCliente,
    eliminarCliente,
    siguienteNumeroCotizacion,
  }
}
