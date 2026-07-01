"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { Phone, AlertTriangle, Plus, Pencil, Trash2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCatalogos } from "@/lib/catalogos-store"
import { useState } from "react"

export function ClientesView() {
  const { catalogos, agregarCliente, editarCliente, eliminarCliente } = useCatalogos()
  const clientes = catalogos.clientes

  // Nuevo cliente form
  const [showAdd, setShowAdd] = useState(false)
  const [nuevoNombre, setNuevoNombre] = useState("")
  const [nuevoNit, setNuevoNit] = useState("")
  const [nuevoTelefono, setNuevoTelefono] = useState("")
  const [nuevoDireccion, setNuevoDireccion] = useState("")

  // Edición inline
  const [editId, setEditId] = useState<string | null>(null)
  const [editNombre, setEditNombre] = useState("")
  const [editNit, setEditNit] = useState("")
  const [editTelefono, setEditTelefono] = useState("")
  const [editDireccion, setEditDireccion] = useState("")

  const handleAgregar = () => {
    if (!nuevoNombre.trim()) return
    agregarCliente({ nombre: nuevoNombre.trim(), nit: nuevoNit.trim(), telefono: nuevoTelefono.trim(), direccion: nuevoDireccion.trim() })
    setNuevoNombre(""); setNuevoNit(""); setNuevoTelefono(""); setNuevoDireccion("")
    setShowAdd(false)
  }

  const iniciarEdicion = (c: typeof clientes[0]) => {
    setEditId(c.id); setEditNombre(c.nombre); setEditNit(c.nit); setEditTelefono(c.telefono); setEditDireccion(c.direccion || "")
  }

  const confirmarEdicion = () => {
    if (editId && editNombre.trim()) {
      editarCliente(editId, { nombre: editNombre.trim(), nit: editNit.trim(), telefono: editTelefono.trim(), direccion: editDireccion.trim() })
    }
    setEditId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Clientes · CRM</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona tu directorio de clientes. Los cambios se reflejan en las cotizaciones.
          </p>
        </div>
        <Button onClick={() => setShowAdd(!showAdd)} variant={showAdd ? "secondary" : "default"} className="gap-1.5">
          <Plus className="size-4" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Formulario agregar */}
      {showAdd && (
        <Card className="border-dashed">
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <Input placeholder="Nombre / Razón social" value={nuevoNombre} onChange={(e) => setNuevoNombre(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAgregar()} autoFocus />
              <Input placeholder="NIT" value={nuevoNit} onChange={(e) => setNuevoNit(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAgregar()} />
              <Input placeholder="Teléfono" value={nuevoTelefono} onChange={(e) => setNuevoTelefono(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAgregar()} />
              <div className="flex gap-2">
                <Input placeholder="Dirección" value={nuevoDireccion} onChange={(e) => setNuevoDireccion(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAgregar()} className="flex-1" />
                <Button onClick={handleAgregar} disabled={!nuevoNombre.trim()} size="icon" className="shrink-0"><Plus className="size-4" /></Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Directorio de Clientes ({clientes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Nombre / Razón Social</TableHead>
                  <TableHead>NIT</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead className="text-right w-[100px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No hay clientes registrados. Agrega el primero.
                    </TableCell>
                  </TableRow>
                )}
                {clientes.map((c) => (
                  <TableRow key={c.id}>
                    {editId === c.id ? (
                      <>
                        <TableCell>
                          <Input value={editNombre} onChange={(e) => setEditNombre(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") confirmarEdicion(); if (e.key === "Escape") setEditId(null) }} className="h-8 text-sm" autoFocus />
                        </TableCell>
                        <TableCell>
                          <Input value={editNit} onChange={(e) => setEditNit(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") confirmarEdicion(); if (e.key === "Escape") setEditId(null) }} className="h-8 text-sm font-mono" />
                        </TableCell>
                        <TableCell>
                          <Input value={editTelefono} onChange={(e) => setEditTelefono(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") confirmarEdicion(); if (e.key === "Escape") setEditId(null) }} className="h-8 text-sm" />
                        </TableCell>
                        <TableCell>
                          <Input value={editDireccion} onChange={(e) => setEditDireccion(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") confirmarEdicion(); if (e.key === "Escape") setEditId(null) }} className="h-8 text-sm" />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button type="button" size="icon" variant="ghost" onClick={confirmarEdicion} className="h-8 w-8 text-green-600 hover:text-green-700"><Check className="size-3.5" /></Button>
                            <Button type="button" size="icon" variant="ghost" onClick={() => setEditId(null)} className="h-8 w-8 text-muted-foreground"><X className="size-3.5" /></Button>
                          </div>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="font-medium text-foreground">{c.nombre}</TableCell>
                        <TableCell className="font-mono text-sm text-muted-foreground">{c.nit}</TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Phone className="size-3.5" />
                            {c.telefono}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{c.direccion || "Sin dirección"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button type="button" size="icon" variant="ghost" onClick={() => iniciarEdicion(c)} className="h-8 w-8 text-muted-foreground hover:text-foreground"><Pencil className="size-3.5" /></Button>
                            <Button type="button" size="icon" variant="ghost" onClick={() => eliminarCliente(c.id)} className="h-8 w-8 text-destructive/60 hover:text-destructive"><Trash2 className="size-3.5" /></Button>
                          </div>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
