"use client"

import { useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { formatCOP } from "@/lib/data"
import { useCatalogos } from "@/lib/catalogos-store"
import { CatalogoCRUDDialog } from "@/components/erp/catalogo-crud-dialog"
import { ClienteCRUDDialog } from "@/components/erp/cliente-crud-dialog"
import {
  Download,
  Loader2,
  UploadCloud,
  ImageIcon,
  Plus,
  Trash2,
  CheckCircle2,
  Pencil,
} from "lucide-react"

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Articulo {
  id: string
  cantidad: number
  tipo: string
  tela: string
  composicion: string
  tipoDecoracion: string
  precioUnitario: number
  renderUrl: string | null
  renderNombre: string | null
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const TERMINOS = [
  "ESTOS PRECIOS SON IVA INCLUIDO",
  "TIEMPO DE ENTREGA 12 DIAS APARTIR DE MONTADO EL PEDIDO Y APROBADO EL DISEÑO",
  "FORMA DE PAGO 50% A LA TOMA DEL PEDIDO Y 50% CON LA ENTREGA",
  "ESTA COTIZACIÓN ES VALIDA POR 8 DÍAS A PARTIR DE LA FECHA",
]

// ─── ZonaUpload ───────────────────────────────────────────────────────────────

function ZonaUpload({
  id,
  titulo,
  descripcion,
  archivo,
  previewUrl,
  onArchivo,
}: {
  id: string
  titulo: string
  descripcion: string
  archivo: string | null
  previewUrl?: string | null
  onArchivo: (nombre: string, url: string | null) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-5 text-center transition-colors",
          archivo
            ? "border-green-400/50 bg-green-50/30 dark:bg-green-900/10"
            : "border-border bg-muted/30 hover:border-primary/40 hover:bg-muted/50",
        )}
      >
        <span className={cn("flex size-10 items-center justify-center rounded-full", archivo ? "bg-green-100 text-green-600" : "bg-primary/10 text-primary")}>
          {archivo ? <CheckCircle2 className="size-5" /> : <ImageIcon className="size-5" />}
        </span>
        <span className="text-sm font-medium text-foreground">{titulo}</span>
        <span className="text-xs text-muted-foreground">{archivo ?? descripcion}</span>
        <span className="mt-1 flex items-center gap-1 text-xs font-medium text-primary">
          <UploadCloud className="size-3.5" />
          {archivo ? "Cambiar imagen" : "Subir imagen"}
        </span>
      </button>
      {/* Preview de la imagen subida */}
      {previewUrl && (
        <div className="flex justify-center rounded-lg border bg-muted/20 p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="Preview" className="max-h-40 max-w-full rounded object-contain" />
        </div>
      )}
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (!file) return
          const url = file.type.startsWith("image/") ? URL.createObjectURL(file) : null
          onArchivo(file.name, url)
          // Reset input para permitir subir el mismo archivo de nuevo
          e.target.value = ""
        }}
      />
    </div>
  )
}

// ─── Documento oculto PDF ─────────────────────────────────────────────────────

function DocumentoCotizacion({
  elRef, numeroCotizacion, cliente, nit, telefono, direccion, detalles, fecha, itemsPreview, total, formatearFechaLarga,
}: {
  elRef: React.RefObject<HTMLDivElement | null>
  numeroCotizacion: string
  cliente: string
  nit: string
  telefono: string
  direccion: string
  detalles: string
  fecha: string
  itemsPreview: Articulo[]
  total: number
  formatearFechaLarga: (iso: string) => string
}) {
  return (
    <div ref={elRef} style={{ position: "absolute", left: "-9999px", top: 0, width: "794px", background: "#fff", color: "#000", fontFamily: "Arial, Helvetica, sans-serif", overflow: "hidden" }}>
      <div style={{ position: "relative", zIndex: 1, padding: "40px 48px 0 48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <p style={{ fontSize: "24px", fontWeight: 900, letterSpacing: "0.5px", color: "#111", margin: 0 }}>
            COTIZACION No:&nbsp;&nbsp;{numeroCotizacion}
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-copa.png" alt="Copa Ropa Deportiva" style={{ width: "90px", objectFit: "contain" }} crossOrigin="anonymous" />
        </div>
        <div style={{ borderTop: "1px solid #ccc", marginTop: "14px" }} />
        <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {[{ label: "FECHA:", valor: formatearFechaLarga(fecha) }, { label: "CLIENTE:", valor: cliente }, { label: "NIT:", valor: nit }, { label: "TELÉFONO:", valor: telefono }, { label: "DIRECCIÓN:", valor: direccion }].map(({ label, valor }) => (
            <div key={label} style={{ display: "flex", alignItems: "flex-end", gap: "12px" }}>
              <span style={{ fontWeight: 700, fontSize: "13px", minWidth: "90px", whiteSpace: "nowrap" }}>{label}</span>
              <span style={{ fontSize: "14px", borderBottom: "1.5px solid #333", flex: 1, paddingBottom: "6px", minHeight: "26px" }}>{valor || "\u00a0"}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "24px", fontSize: "13px", lineHeight: "1.6" }}>
          <p style={{ margin: 0 }}>Cordial saludo,</p>
          <p style={{ margin: 0 }}>Por medio de la presente hacemos cotización de los siguientes artículos:</p>
          {detalles && <p style={{ margin: "8px 0 0", fontStyle: "italic", color: "#333" }}>{detalles}</p>}
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "16px", fontSize: "12px" }}>
          <thead>
            <tr style={{ backgroundColor: "#111", color: "#fff" }}>
              {["CANT.", "ARTÍCULO", "VALOR UNITARIO", "VALOR TOTAL"].map((h, i) => (
                <th key={h} style={{ border: "1px solid #111", padding: "7px 10px", fontWeight: 700, textAlign: i === 0 ? "center" : i === 1 ? "left" : "center", whiteSpace: "nowrap", width: i === 0 ? "60px" : i === 2 || i === 3 ? "120px" : undefined }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {itemsPreview.map((a) => (
              <tr key={a.id} style={{ verticalAlign: "top" }}>
                <td style={{ border: "1px solid #bbb", padding: "10px 8px", textAlign: "center", fontWeight: 700, fontSize: "14px" }}>{a.cantidad}</td>
                <td style={{ border: "1px solid #bbb", padding: "10px 10px" }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: "12px" }}>{a.tipo}</p>
                  <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#222" }}>TELA {a.tela}</p>
                  <p style={{ margin: "1px 0 0", fontSize: "11px", color: "#222" }}>COMPOSICIÓN {a.composicion}</p>
                  <p style={{ margin: "1px 0 0", fontSize: "11px", color: "#222" }}>DISEÑO {a.tipoDecoracion}</p>
                  {a.renderUrl && (
                    <div style={{ marginTop: "10px", display: "flex", justifyContent: "center" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={a.renderUrl} alt={`Render ${a.tipo}`} style={{ maxHeight: "180px", maxWidth: "100%", objectFit: "contain" }} crossOrigin="anonymous" />
                    </div>
                  )}
                </td>
                <td style={{ border: "1px solid #bbb", padding: "10px 8px", textAlign: "center", whiteSpace: "nowrap" }}>{a.precioUnitario > 0 ? formatCOP(a.precioUnitario) : "$ —"}</td>
                <td style={{ border: "1px solid #bbb", padding: "10px 8px", textAlign: "center", fontWeight: 700, whiteSpace: "nowrap" }}>{a.precioUnitario > 0 ? formatCOP(a.cantidad * a.precioUnitario) : "$ —"}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={3} style={{ border: "1px solid #bbb", padding: "8px 10px", textAlign: "right", fontWeight: 700, fontSize: "13px", letterSpacing: "1px" }}>TOTAL</td>
              <td style={{ border: "1px solid #bbb", padding: "8px 10px", textAlign: "center", fontWeight: 700, fontSize: "14px", whiteSpace: "nowrap" }}>{total > 0 ? formatCOP(total) : "$ —"}</td>
            </tr>
          </tbody>
        </table>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "14px", fontSize: "11px" }}>
          <tbody>
            <tr>
              <td style={{ border: "1.5px solid #333", padding: "12px 16px", textAlign: "center", fontWeight: 700, lineHeight: 1.8, color: "#111" }}>
                {TERMINOS.map((linea, i) => <p key={i} style={{ margin: 0 }}>{linea}</p>)}
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ marginTop: "36px", paddingBottom: "16px", fontSize: "13px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "12px" }}>
            <span style={{ fontWeight: 700, whiteSpace: "nowrap" }}>FIRMA:</span>
            <span style={{ flex: 1, borderBottom: "1.5px solid #333", minWidth: "200px" }}>&nbsp;</span>
          </div>
        </div>
      </div>
      <div style={{ marginTop: "28px", backgroundColor: "#111", color: "#fff", textAlign: "center", padding: "8px 20px", fontSize: "10.5px", letterSpacing: "0.3px" }}>
        Calle 28 No. 16 - 17 B. SAN NICOLAS&nbsp;&nbsp;TEL 344 29 74&nbsp; · &nbsp;CEL. 316 6291418&nbsp; · &nbsp;EMAIL: coparopadeportiva@hotmail.com
      </div>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function CotizacionesView() {
  const docRef = useRef<HTMLDivElement>(null)
  const [generando, setGenerando] = useState(false)
  const { catalogos, agregar, editar, eliminar, resetear, agregarCliente, editarCliente, eliminarCliente } = useCatalogos()

  // Datos de cabecera
  const [numeroCotizacion, setNumeroCotizacion] = useState(String(catalogos.ultimoNumeroCotizacion + 1).padStart(4, "0"))
  const [clienteId, setClienteId] = useState("")
  const [clienteNombre, setClienteNombre] = useState("")
  const [nit, setNit] = useState("")
  const [telefono, setTelefono] = useState("")
  const [direccion, setDireccion] = useState("")
  const [detalles, setDetalles] = useState("")
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10))

  // Al seleccionar cliente, auto-llenar NIT
  const handleSeleccionarCliente = (id: string) => {
    setClienteId(id)
    const found = catalogos.clientes.find((c) => c.id === id)
    if (found) {
      setClienteNombre(found.nombre)
      setNit(found.nit)
      setTelefono(found.telefono)
      setDireccion(found.direccion || "")
    }
  }

  // Artículo en edición
  const [cantidad, setCantidad] = useState<number | "">(1)
  const [tipo, setTipo] = useState(catalogos.tiposProducto[0]?.nombre ?? "")
  const [tela, setTela] = useState(catalogos.telas[0]?.nombre ?? "")
  const [composicion, setComposicion] = useState(catalogos.composiciones[0]?.nombre ?? "")
  const [tipoDecoracion, setTipoDecoracion] = useState(catalogos.tiposDecoracion[0]?.nombre ?? "")
  const [precio, setPrecio] = useState<number | "">("")
  const [renderUrl, setRenderUrl] = useState<string | null>(null)
  const [renderNombre, setRenderNombre] = useState<string | null>(null)

  // Artículo editando (índice en lista)
  const [editandoIdx, setEditandoIdx] = useState<number | null>(null)

  // Key para forzar reset del input file al agregar artículo
  const [uploadKey, setUploadKey] = useState(0)

  // Lista de artículos confirmados
  const [articulos, setArticulos] = useState<Articulo[]>([])

  // ── Agregar / actualizar artículo ──────────────────────────────────────────
  const agregarArticulo = () => {
    if (!cantidad || cantidad < 1) return
    const nuevo: Articulo = {
      id: editandoIdx !== null ? articulos[editandoIdx].id : crypto.randomUUID(),
      cantidad: cantidad === "" ? 0 : cantidad,
      tipo,
      tela,
      composicion,
      tipoDecoracion,
      precioUnitario: precio === "" ? 0 : precio,
      renderUrl,
      renderNombre,
    }
    if (editandoIdx !== null) {
      setArticulos((prev) => prev.map((a, i) => (i === editandoIdx ? nuevo : a)))
      setEditandoIdx(null)
    } else {
      setArticulos((prev) => [...prev, nuevo])
    }
    // Reset form — incluyendo la imagen
    setCantidad(1)
    setPrecio("")
    setRenderUrl(null)
    setRenderNombre(null)
    setUploadKey((k) => k + 1)
  }

  const eliminarArticulo = (id: string) => setArticulos((prev) => prev.filter((a) => a.id !== id))

  const cargarParaEditar = (idx: number) => {
    const a = articulos[idx]
    setCantidad(a.cantidad)
    setTipo(a.tipo)
    setTela(a.tela)
    setComposicion(a.composicion)
    setTipoDecoracion(a.tipoDecoracion)
    setPrecio(a.precioUnitario)
    setRenderUrl(a.renderUrl)
    setRenderNombre(a.renderNombre)
    setEditandoIdx(idx)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const cancelarEdicion = () => {
    setEditandoIdx(null)
    setCantidad(1)
    setPrecio("")
    setRenderUrl(null)
    setRenderNombre(null)
  }

  const itemsPreview: Articulo[] = articulos.length > 0 ? articulos : [{
    id: "preview",
    cantidad: cantidad === "" ? 0 : cantidad,
    tipo, tela, composicion, tipoDecoracion,
    precioUnitario: precio === "" ? 0 : precio,
    renderUrl, renderNombre,
  }]

  const total = itemsPreview.reduce((s, a) => s + a.cantidad * a.precioUnitario, 0)
  const formatearFechaLarga = (iso: string) => new Date(iso + "T00:00:00").toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })

  // ── PDF ────────────────────────────────────────────────────────────────────
  const descargarPDF = async () => {
    if (!docRef.current) return
    setGenerando(true)
    try {
      const html2canvas = (await import("html2canvas")).default
      const { jsPDF } = await import("jspdf")
      const canvas = await html2canvas(docRef.current, {
        scale: 2, useCORS: true, allowTaint: false, backgroundColor: "#ffffff", logging: false,
        onclone: (_clonedDoc, element) => {
          const style = element.ownerDocument.createElement("style")
          style.textContent = `*, *::before, *::after { --background:#f5f5f8!important;--foreground:#111827!important;--card:#ffffff!important;--primary:#1e3a5f!important;--border:#d1d5db!important; }`
          element.ownerDocument.head.appendChild(style)
        },
      })
      const imgData = canvas.toDataURL("image/png")
      const pdfWidth = 595.28
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      const pdf = new jsPDF({ orientation: pdfHeight > pdfWidth ? "portrait" : "landscape", unit: "pt", format: [pdfWidth, pdfHeight] })
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
      pdf.save(`Cotizacion-${numeroCotizacion}-${clienteNombre || "cliente"}.pdf`)
    } catch (err) {
      console.error("Error generando PDF:", err)
    } finally {
      setGenerando(false)
    }
  }

  // ── SelectRow helper ───────────────────────────────────────────────────────
  function SelectConCRUD({
    id, label, tipo: tipoCat, value, onValue, span2 = false,
  }: {
    id: string
    label: string
    tipo: "tiposProducto" | "telas" | "tiposDecoracion" | "composiciones"
    value: string
    onValue: (v: string) => void
    span2?: boolean
  }) {
    const items = catalogos[tipoCat]
    const titulosMap: Record<string, string> = {
      tiposProducto: "Tipos de Producto",
      telas: "Telas",
      tiposDecoracion: "Tipos de Decoración",
      composiciones: "Composiciones",
    }
    return (
      <div className={cn("space-y-2", span2 && "col-span-2")}>
        <Label htmlFor={id}>{label}</Label>
        <div className="flex gap-1">
          <Select value={value} onValueChange={onValue}>
            <SelectTrigger id={id} className="flex-1 min-w-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {items.map((it) => (
                <SelectItem key={it.id} value={it.nombre}>{it.nombre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <CatalogoCRUDDialog
            titulo={titulosMap[tipoCat]}
            tipo={tipoCat}
            items={items}
            onAgregar={(t, n) => { agregar(t, n) }}
            onEditar={(t, i, n) => { editar(t, i, n) }}
            onEliminar={(t, i) => { eliminar(t, i) }}
            onResetear={tipoCat === "tiposProducto" ? resetear : undefined}
          />
        </div>
      </div>
    )
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Cotizaciones y Pedidos</h1>
        <p className="text-sm text-muted-foreground">Completa los datos y descarga la cotización en PDF.</p>
      </div>

      <div className="mx-auto max-w-3xl space-y-6">
        {/* ── ENCABEZADO ─────────────────────────────────────────── */}
        <Card>
          <CardHeader><CardTitle className="text-base">Datos del Documento</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numero-cot">No. Cotización</Label>
                <Input id="numero-cot" value={numeroCotizacion} onChange={(e) => setNumeroCotizacion(e.target.value)} maxLength={6} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha</Label>
                <Input id="fecha" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="cliente">Cliente</Label>
                <div className="flex gap-1">
                  <Select value={clienteId} onValueChange={handleSeleccionarCliente}>
                    <SelectTrigger id="cliente" className="flex-1 min-w-0">
                      <SelectValue placeholder="Seleccionar cliente…" />
                    </SelectTrigger>
                    <SelectContent>
                      {catalogos.clientes.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <ClienteCRUDDialog
                    clientes={catalogos.clientes}
                    onAgregar={agregarCliente}
                    onEditar={editarCliente}
                    onEliminar={eliminarCliente}
                  />
                </div>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="nit">NIT</Label>
                <Input id="nit" value={nit} onChange={(e) => setNit(e.target.value)} placeholder="Se llena automáticamente al seleccionar cliente" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input id="telefono" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Teléfono de contacto" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input id="direccion" value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Dirección de entrega" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── ARTÍCULO ───────────────────────────────────────────── */}
        <Card className={cn(editandoIdx !== null && "ring-2 ring-primary")}>
          <CardHeader>
            <CardTitle className="text-base">
              {editandoIdx !== null ? `Editando artículo #${editandoIdx + 1}` : "Agregar Artículo"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cantidad">Cantidad</Label>
                <Input id="cantidad" type="number" min={1} value={cantidad} onChange={(e) => { const v = e.target.value; setCantidad(v === "" ? "" : Number(v)) }} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="precio">Precio Unitario ($)</Label>
                <Input id="precio" type="number" min={0} value={precio} onChange={(e) => { const v = e.target.value; setPrecio(v === "" ? "" : Number(v)) }} placeholder="65000" />
              </div>

              <SelectConCRUD id="tipo" label="Tipo de Producto" tipo="tiposProducto" value={tipo} onValue={setTipo} span2 />
              <SelectConCRUD id="tela" label="Tela" tipo="telas" value={tela} onValue={setTela} />
              <SelectConCRUD id="decoracion" label="Tipo de Decoración" tipo="tiposDecoracion" value={tipoDecoracion} onValue={setTipoDecoracion} />
              <SelectConCRUD id="composicion" label="Composición" tipo="composiciones" value={composicion} onValue={setComposicion} span2 />

              <div className="col-span-2 space-y-2">
                <Label htmlFor="detalles">Detalles / Observaciones (de la Cotización)</Label>
                <Textarea id="detalles" value={detalles} onChange={(e) => setDetalles(e.target.value)} placeholder="Notas adicionales, especificaciones, observaciones…" className="min-h-[60px]" />
              </div>
            </div>

            <Separator />

            <ZonaUpload
              key={uploadKey}
              id="render-diseno"
              titulo="Render del Diseño (opcional)"
              descripcion="Imagen 3D del producto para el cliente · PNG / JPG"
              archivo={renderNombre}
              previewUrl={renderUrl}
              onArchivo={(nombre, url) => { setRenderNombre(nombre); setRenderUrl(url) }}
            />

            <div className="flex gap-2">
              <Button type="button" variant="outline" className="flex-1" onClick={agregarArticulo}>
                <Plus className="size-4" />
                {editandoIdx !== null ? "Guardar cambios" : "Agregar artículo"}
              </Button>
              {editandoIdx !== null && (
                <Button type="button" variant="ghost" onClick={cancelarEdicion}>Cancelar</Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ── LISTA ARTÍCULOS ─────────────────────────────────────── */}
        {articulos.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Artículos en la cotización ({articulos.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-border">
                {articulos.map((a, i) => (
                  <li key={a.id} className="py-3">
                    <div className="space-y-2">
                      <div className="flex items-start gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{a.cantidad} × {a.tipo}</p>
                          <p className="text-xs text-muted-foreground">Tela {a.tela} · {a.tipoDecoracion}</p>
                          <p className="text-xs text-muted-foreground">{a.composicion}</p>
                        </div>

                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className="tabular-nums text-sm font-semibold">{formatCOP(a.cantidad * a.precioUnitario)}</span>
                          <div className="flex gap-1">
                            <button type="button" onClick={() => cargarParaEditar(i)} className="text-muted-foreground hover:text-foreground" aria-label="Editar">
                              <Pencil className="size-3.5" />
                            </button>
                            <button type="button" onClick={() => eliminarArticulo(a.id)} className="text-destructive/70 hover:text-destructive" aria-label="Eliminar">
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                      {/* Preview de imagen del artículo */}
                      {a.renderUrl ? (
                        <div className="flex justify-center rounded-lg border bg-muted/20 p-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={a.renderUrl} alt={a.tipo} className="max-h-36 max-w-full rounded object-contain" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1.5 rounded-lg border border-dashed bg-muted/10 py-2 text-xs text-muted-foreground">
                          <ImageIcon className="size-3.5" />
                          Sin imagen
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex justify-end border-t pt-3">
                <p className="text-sm font-bold">Total: <span className="tabular-nums">{formatCOP(total)}</span></p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── DESCARGAR PDF ─────────────────────────────────────────── */}
        <Button size="lg" className="w-full gap-2 text-base" onClick={descargarPDF} disabled={generando}>
          {generando ? (<><Loader2 className="size-5 animate-spin" />Generando PDF…</>) : (<><Download className="size-5" />Descargar Cotización PDF</>)}
        </Button>
      </div>

      <DocumentoCotizacion
        elRef={docRef}
        numeroCotizacion={numeroCotizacion}
        cliente={clienteNombre}
        nit={nit}
        telefono={telefono}
        direccion={direccion}
        detalles={detalles}
        fecha={fecha}
        itemsPreview={itemsPreview}
        total={total}
        formatearFechaLarga={formatearFechaLarga}
      />
    </div>
  )
}
