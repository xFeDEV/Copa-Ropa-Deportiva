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
import { Settings2, Plus, Pencil, Trash2, Check, X, RotateCcw } from "lucide-react"
import type { ItemCatalogo, TipoCatalogo } from "@/lib/catalogos-store"

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  titulo: string
  tipo: TipoCatalogo
  items: ItemCatalogo[]
  onAgregar: (tipo: TipoCatalogo, nombre: string) => void
  onEditar: (tipo: TipoCatalogo, id: string, nombre: string) => void
  onEliminar: (tipo: TipoCatalogo, id: string) => void
  onResetear?: () => void
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function CatalogoCRUDDialog({
  titulo,
  tipo,
  items,
  onAgregar,
  onEditar,
  onEliminar,
  onResetear,
}: Props) {
  const [nuevoNombre, setNuevoNombre] = useState("")
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [editandoValor, setEditandoValor] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  // ── Agregar ────────────────────────────────────────────────────────────────
  const handleAgregar = () => {
    if (!nuevoNombre.trim()) return
    onAgregar(tipo, nuevoNombre)
    setNuevoNombre("")
    inputRef.current?.focus()
  }

  // ── Iniciar edición ────────────────────────────────────────────────────────
  const iniciarEdicion = (item: ItemCatalogo) => {
    setEditandoId(item.id)
    setEditandoValor(item.nombre)
  }

  // ── Confirmar edición ──────────────────────────────────────────────────────
  const confirmarEdicion = () => {
    if (editandoId && editandoValor.trim()) {
      onEditar(tipo, editandoId, editandoValor)
    }
    setEditandoId(null)
    setEditandoValor("")
  }

  // ── Cancelar edición ───────────────────────────────────────────────────────
  const cancelarEdicion = () => {
    setEditandoId(null)
    setEditandoValor("")
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
          title={`Gestionar ${titulo}`}
        >
          <Settings2 className="size-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Settings2 className="size-4 text-primary" />
            Gestionar: {titulo}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* ── Input agregar nuevo ──────────────────────────────── */}
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              placeholder={`Nuevo ${titulo.toLowerCase()}…`}
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAgregar()}
              className="uppercase placeholder:normal-case"
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

          {/* ── Lista de ítems ───────────────────────────────────── */}
          <div className="max-h-[320px] overflow-y-auto rounded-md border divide-y divide-border">
            {items.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No hay ítems. Agrega el primero arriba.
              </p>
            )}

            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-2 px-3 py-2.5">
                {editandoId === item.id ? (
                  /* ── Modo edición ─────────────────────────────── */
                  <>
                    <Input
                      value={editandoValor}
                      onChange={(e) => setEditandoValor(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") confirmarEdicion()
                        if (e.key === "Escape") cancelarEdicion()
                      }}
                      className="h-8 flex-1 text-sm uppercase"
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
                  </>
                ) : (
                  /* ── Modo lectura ─────────────────────────────── */
                  <>
                    <span className="flex-1 text-sm truncate font-medium">{item.nombre}</span>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => iniciarEdicion(item)}
                      className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => onEliminar(tipo, item.id)}
                      className="h-8 w-8 shrink-0 text-destructive/60 hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* ── Footer con contador y reset ──────────────────────── */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
            <span>{items.length} ítem{items.length !== 1 ? "s" : ""}</span>
            {onResetear && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground"
                onClick={onResetear}
              >
                <RotateCcw className="size-3" />
                Restaurar defaults
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
