"use client"

import { useState, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings2, Plus, Pencil, Trash2, Check, X, RotateCcw, Phone, Building2 } from "lucide-react"
import type { ClienteCatalogo } from "@/lib/catalogos-store"

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  clientes: ClienteCatalogo[]
  onAgregar: (cliente: Omit<ClienteCatalogo, "id">) => void
  onEditar: (id: string, data: Omit<ClienteCatalogo, "id">) => void
  onEliminar: (id: string) => void
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function ClienteCRUDDialog({
  clientes,
  onAgregar,
  onEditar,
  onEliminar,
}: Props) {
  const [nuevoNombre, setNuevoNombre] = useState("")
  const [nuevoNit, setNuevoNit] = useState("")
  const [nuevoTelefono, setNuevoTelefono] = useState("")
  const [nuevoDireccion, setNuevoDireccion] = useState("")

  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [editNombre, setEditNombre] = useState("")
  const [editNit, setEditNit] = useState("")
  const [editTelefono, setEditTelefono] = useState("")
  const [editDireccion, setEditDireccion] = useState("")

  const nombreRef = useRef<HTMLInputElement>(null)

  // ── Agregar ────────────────────────────────────────────────────────────────
  const handleAgregar = () => {
    if (!nuevoNombre.trim()) return
    onAgregar({
      nombre: nuevoNombre.trim(),
      nit: nuevoNit.trim(),
      telefono: nuevoTelefono.trim(),
      direccion: nuevoDireccion.trim(),
    })
    setNuevoNombre("")
    setNuevoNit("")
    setNuevoTelefono("")
    setNuevoDireccion("")
    nombreRef.current?.focus()
  }

  // ── Iniciar edición ────────────────────────────────────────────────────────
  const iniciarEdicion = (c: ClienteCatalogo) => {
    setEditandoId(c.id)
    setEditNombre(c.nombre)
    setEditNit(c.nit)
    setEditTelefono(c.telefono)
    setEditDireccion(c.direccion || "")
  }

  // ── Confirmar edición ──────────────────────────────────────────────────────
  const confirmarEdicion = () => {
    if (editandoId && editNombre.trim()) {
      onEditar(editandoId, {
        nombre: editNombre.trim(),
        nit: editNit.trim(),
        telefono: editTelefono.trim(),
        direccion: editDireccion.trim(),
      })
    }
    cancelarEdicion()
  }

  // ── Cancelar edición ───────────────────────────────────────────────────────
  const cancelarEdicion = () => {
    setEditandoId(null)
    setEditNombre("")
    setEditNit("")
    setEditTelefono("")
    setEditDireccion("")
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
          title="Gestionar Clientes"
        >
          <Settings2 className="size-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Building2 className="size-4 text-primary" />
            Gestionar: Clientes
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* ── Formulario agregar nuevo ──────────────────────────── */}
          <div className="space-y-2 rounded-lg border border-dashed border-border p-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nuevo cliente</p>
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <Input
                ref={nombreRef}
                placeholder="Nombre / Razón social"
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAgregar()}
                className="text-sm"
              />
              <Button
                type="button"
                size="icon"
                onClick={handleAgregar}
                disabled={!nuevoNombre.trim()}
                className="shrink-0"
              >
                <Plus className="size-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="NIT"
                value={nuevoNit}
                onChange={(e) => setNuevoNit(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAgregar()}
                className="text-sm"
              />
              <Input
                placeholder="Teléfono"
                value={nuevoTelefono}
                onChange={(e) => setNuevoTelefono(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAgregar()}
                className="text-sm"
              />
            </div>
            <Input
              placeholder="Dirección"
              value={nuevoDireccion}
              onChange={(e) => setNuevoDireccion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAgregar()}
              className="text-sm"
            />
          </div>

          {/* ── Lista de clientes ─────────────────────────────────── */}
          <div className="max-h-[340px] overflow-y-auto rounded-md border divide-y divide-border">
            {clientes.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No hay clientes. Agrega el primero arriba.
              </p>
            )}

            {clientes.map((c) => (
              <div key={c.id} className="px-3 py-2.5">
                {editandoId === c.id ? (
                  /* ── Modo edición ────────────────────────────── */
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={editNombre}
                        onChange={(e) => setEditNombre(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") confirmarEdicion()
                          if (e.key === "Escape") cancelarEdicion()
                        }}
                        className="h-8 flex-1 text-sm"
                        placeholder="Nombre"
                        autoFocus
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={confirmarEdicion}
                        className="h-8 w-8 shrink-0 text-green-600 hover:text-green-700"
                      >
                        <Check className="size-3.5" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={cancelarEdicion}
                        className="h-8 w-8 shrink-0 text-muted-foreground"
                      >
                        <X className="size-3.5" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        value={editNit}
                        onChange={(e) => setEditNit(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") confirmarEdicion()
                          if (e.key === "Escape") cancelarEdicion()
                        }}
                        className="h-8 text-sm"
                        placeholder="NIT"
                      />
                      <Input
                        value={editTelefono}
                        onChange={(e) => setEditTelefono(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") confirmarEdicion()
                          if (e.key === "Escape") cancelarEdicion()
                        }}
                        className="h-8 text-sm"
                        placeholder="Teléfono"
                      />
                    </div>
                    <Input
                      value={editDireccion}
                      onChange={(e) => setEditDireccion(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") confirmarEdicion()
                        if (e.key === "Escape") cancelarEdicion()
                      }}
                      className="h-8 text-sm"
                      placeholder="Dirección"
                    />
                  </div>
                ) : (
                  /* ── Modo lectura ────────────────────────────── */
                  <div className="flex items-center gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{c.nombre}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {c.nit && <span className="font-mono">{c.nit}</span>}
                        {c.telefono && (
                          <span className="flex items-center gap-1">
                            <Phone className="size-3" />
                            {c.telefono}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => iniciarEdicion(c)}
                      className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => onEliminar(c.id)}
                      className="h-8 w-8 shrink-0 text-destructive/60 hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ── Footer con contador ───────────────────────────────── */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
            <span>{clientes.length} cliente{clientes.length !== 1 ? "s" : ""}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
