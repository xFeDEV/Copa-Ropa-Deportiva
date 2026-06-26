"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { formatCOP, ULTIMO_NUMERO_COTIZACION } from "@/lib/data"
import {
  Download,
  Loader2,
  UploadCloud,
  ImageIcon,
  Plus,
  Trash2,
  CheckCircle2,
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
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const TERMINOS = [
  "ESTOS PRECIOS SON IVA INCLUIDO",
  "TIEMPO DE ENTREGA 12 DIAS APARTIR DE MONTADO EL PEDIDO Y APROBADO EL DISEÑO",
  "FORMA DE PAGO 50% A LA TOMA DEL PEDIDO Y 50% CON LA ENTREGA",
  "ESTA COTIZACIÓN ES VALIDA POR 8 DÍAS A PARTIR DE LA FECHA",
]

const tiposProducto = [
  "CAMISETA TIPO POLO",
  "CAMISETA DE FÚTBOL",
  "SUDADERA CON CAPOTA",
  "PANTALONETA DEPORTIVA",
  "CHAQUETA LIVIANA",
  "UNIFORME COMPLETO",
]

const telas = ["SUDAFRICA", "DRY FIT", "ALGODÓN PERCHADO", "LICRA POLIÉSTER", "MICROFIBRA"]

const tiposDecoracion = [
  "IMPRESIÓN DIGITAL",
  "BORDADO",
  "SUBLIMACIÓN",
  "SERIGRAFÍA",
  "TRANSFER",
]

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function ZonaUpload({
  id,
  titulo,
  descripcion,
  archivo,
  onArchivo,
}: {
  id: string
  titulo: string
  descripcion: string
  archivo: string | null
  onArchivo: (nombre: string, url: string | null) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <div>
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
        <span
          className={cn(
            "flex size-10 items-center justify-center rounded-full",
            archivo ? "bg-green-100 text-green-600" : "bg-primary/10 text-primary",
          )}
        >
          {archivo ? <CheckCircle2 className="size-5" /> : <ImageIcon className="size-5" />}
        </span>
        <span className="text-sm font-medium text-foreground">{titulo}</span>
        <span className="text-xs text-muted-foreground">{archivo ?? descripcion}</span>
        <span className="mt-1 flex items-center gap-1 text-xs font-medium text-primary">
          <UploadCloud className="size-3.5" />
          {archivo ? "Cambiar imagen" : "Subir imagen"}
        </span>
      </button>
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
        }}
      />
    </div>
  )
}

// ─── Documento oculto para captura PDF ────────────────────────────────────────

function DocumentoCotizacion({
  elRef,
  numeroCotizacion,
  cliente,
  nit,
  fecha,
  itemsPreview,
  total,
  formatearFechaLarga,
}: {
  elRef: React.RefObject<HTMLDivElement | null>
  numeroCotizacion: string
  cliente: string
  nit: string
  fecha: string
  itemsPreview: Articulo[]
  total: number
  formatearFechaLarga: (iso: string) => string
}) {
  return (
    <div
      ref={elRef}
      style={{
        position: "absolute",
        left: "-9999px",
        top: 0,
        width: "794px",           // A4 a 96 dpi
        background: "#fff",
        color: "#000",
        fontFamily: "Arial, Helvetica, sans-serif",
        overflow: "hidden",
      }}
    >


      {/* Contenido sobre el watermark */}
      <div style={{ position: "relative", zIndex: 1, padding: "40px 48px 0 48px" }}>

        {/* ── ENCABEZADO ──────────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ fontSize: "24px", fontWeight: 900, letterSpacing: "0.5px", color: "#111", margin: 0 }}>
              COTIZACION No:&nbsp;&nbsp;{numeroCotizacion}
            </p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-copa.png"
            alt="Copa Ropa Deportiva"
            style={{ width: "90px", objectFit: "contain" }}
            crossOrigin="anonymous"
          />
        </div>

        <div style={{ borderTop: "1px solid #ccc", marginTop: "14px" }} />

        {/* ── DATOS DEL CLIENTE ───────────────────────────── */}
        <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            { label: "FECHA:", valor: formatearFechaLarga(fecha) },
            { label: "CLIENTE:", valor: cliente },
            { label: "NIT:", valor: nit },
          ].map(({ label, valor }) => (
            <div key={label} style={{ display: "flex", alignItems: "flex-end", gap: "12px" }}>
              <span style={{ fontWeight: 700, fontSize: "13px", minWidth: "70px", whiteSpace: "nowrap" }}>
                {label}
              </span>
              <span style={{ fontSize: "14px", borderBottom: "1.5px solid #333", flex: 1, paddingBottom: "6px", minHeight: "26px" }}>
                {valor || "\u00a0"}
              </span>
            </div>
          ))}
        </div>

        {/* ── SALUDO ─────────────────────────────────────── */}
        <div style={{ marginTop: "24px", fontSize: "13px", lineHeight: "1.6" }}>
          <p style={{ margin: 0 }}>Cordial saludo,</p>
          <p style={{ margin: 0 }}>Por medio de la presente hacemos cotización de los siguientes artículos:</p>
        </div>

        {/* ── TABLA ──────────────────────────────────────── */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "16px", fontSize: "12px" }}>
          <thead>
            <tr style={{ backgroundColor: "#111", color: "#fff" }}>
              {["CANT.", "ARTÍCULO", "VALOR UNITARIO", "VALOR TOTAL"].map((h, i) => (
                <th
                  key={h}
                  style={{
                    border: "1px solid #111",
                    padding: "7px 10px",
                    fontWeight: 700,
                    textAlign: i === 0 ? "center" : i === 1 ? "left" : "center",
                    whiteSpace: "nowrap",
                    width: i === 0 ? "60px" : i === 2 || i === 3 ? "120px" : undefined,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {itemsPreview.map((a) => (
              <tr key={a.id} style={{ verticalAlign: "top" }}>
                {/* Cantidad */}
                <td style={{ border: "1px solid #bbb", padding: "10px 8px", textAlign: "center", fontWeight: 700, fontSize: "14px" }}>
                  {a.cantidad}
                </td>

                {/* Artículo */}
                <td style={{ border: "1px solid #bbb", padding: "10px 10px" }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: "12px" }}>{a.tipo}</p>
                  <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#222" }}>TELA {a.tela}</p>
                  <p style={{ margin: "1px 0 0", fontSize: "11px", color: "#222" }}>COMPOSICIÓN {a.composicion}</p>
                  <p style={{ margin: "1px 0 0", fontSize: "11px", color: "#222" }}>DISEÑO {a.tipoDecoracion}</p>
                  {a.renderUrl && (
                    <div style={{ marginTop: "10px", display: "flex", justifyContent: "center" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={a.renderUrl}
                        alt={`Render ${a.tipo}`}
                        style={{ maxHeight: "180px", maxWidth: "100%", objectFit: "contain" }}
                        crossOrigin="anonymous"
                      />
                    </div>
                  )}
                </td>

                {/* Valor unitario */}
                <td style={{ border: "1px solid #bbb", padding: "10px 8px", textAlign: "center", whiteSpace: "nowrap" }}>
                  {a.precioUnitario > 0 ? formatCOP(a.precioUnitario) : "$ —"}
                </td>

                {/* Valor total */}
                <td style={{ border: "1px solid #bbb", padding: "10px 8px", textAlign: "center", fontWeight: 700, whiteSpace: "nowrap" }}>
                  {a.precioUnitario > 0 ? formatCOP(a.cantidad * a.precioUnitario) : "$ —"}
                </td>
              </tr>
            ))}

            {/* Fila TOTAL */}
            <tr>
              <td colSpan={3} style={{ border: "1px solid #bbb", padding: "8px 10px", textAlign: "right", fontWeight: 700, fontSize: "13px", letterSpacing: "1px" }}>
                TOTAL
              </td>
              <td style={{ border: "1px solid #bbb", padding: "8px 10px", textAlign: "center", fontWeight: 700, fontSize: "14px", whiteSpace: "nowrap" }}>
                {total > 0 ? formatCOP(total) : "$ —"}
              </td>
            </tr>
          </tbody>
        </table>

        {/* ── TÉRMINOS ────────────────────────────────────── */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "14px", fontSize: "11px" }}>
          <tbody>
            <tr>
              <td style={{ border: "1.5px solid #333", padding: "12px 16px", textAlign: "center", fontWeight: 700, lineHeight: 1.8, color: "#111" }}>
                {TERMINOS.map((linea, i) => (
                  <p key={i} style={{ margin: 0 }}>{linea}</p>
                ))}
              </td>
            </tr>
          </tbody>
        </table>

        {/* ── FIRMA ───────────────────────────────────────── */}
        <div style={{ marginTop: "36px", paddingBottom: "16px", fontSize: "13px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "12px" }}>
            <span style={{ fontWeight: 700, whiteSpace: "nowrap" }}>FIRMA:</span>
            <span style={{ flex: 1, borderBottom: "1.5px solid #333", minWidth: "200px" }}>&nbsp;</span>
          </div>
        </div>
      </div>

      {/* ── FOOTER ──────────────────────────────────────── */}
      <div
        style={{
          marginTop: "28px",
          backgroundColor: "#111",
          color: "#fff",
          textAlign: "center",
          padding: "8px 20px",
          fontSize: "10.5px",
          letterSpacing: "0.3px",
        }}
      >
        Calle 28 No. 16 - 17 B. SAN NICOLAS&nbsp;&nbsp;TEL 344 29 74&nbsp; · &nbsp;CEL. 316 6291418&nbsp; · &nbsp;EMAIL: coparopadeportiva@hotmail.com
      </div>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function CotizacionesView() {
  const docRef = useRef<HTMLDivElement>(null)
  const [generando, setGenerando] = useState(false)

  // Datos de cabecera
  const [numeroCotizacion, setNumeroCotizacion] = useState(
    String(ULTIMO_NUMERO_COTIZACION + 1).padStart(4, "0"),
  )
  const [cliente, setCliente] = useState("")
  const [nit, setNit] = useState("")
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10))

  // Artículo en edición
  const [cantidad, setCantidad] = useState<number | "">(1)
  const [tipo, setTipo] = useState(tiposProducto[0])
  const [tela, setTela] = useState(telas[0])
  const [composicion, setComposicion] = useState("100% POLIESTER")
  const [tipoDecoracion, setTipoDecoracion] = useState(tiposDecoracion[0])
  const [precio, setPrecio] = useState<number | "">("")
  const [renderUrl, setRenderUrl] = useState<string | null>(null)
  const [renderNombre, setRenderNombre] = useState<string | null>(null)

  // Lista de artículos confirmados
  const [articulos, setArticulos] = useState<Articulo[]>([])

  const articuloActual: Articulo = {
    id: "preview",
    cantidad: cantidad === "" ? 0 : cantidad,
    tipo,
    tela,
    composicion,
    tipoDecoracion,
    precioUnitario: precio === "" ? 0 : precio,
    renderUrl,
  }

  const agregarArticulo = () => {
    if (!cantidad || cantidad < 1) return
    setArticulos((prev) => [
      ...prev,
      { ...articuloActual, id: crypto.randomUUID() },
    ])
  }

  const eliminarArticulo = (id: string) =>
    setArticulos((prev) => prev.filter((a) => a.id !== id))

  // Los artículos a mostrar en el PDF (si no hay confirmados, usa el artículo actual como preview)
  const itemsPreview: Articulo[] =
    articulos.length > 0 ? articulos : [articuloActual]

  const total = itemsPreview.reduce((s, a) => s + a.cantidad * a.precioUnitario, 0)

  const formatearFechaLarga = (iso: string) =>
    new Date(iso + "T00:00:00").toLocaleDateString("es-CO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })

  // ── Generar y descargar PDF ────────────────────────────────────────────────
  const descargarPDF = async () => {
    if (!docRef.current) return
    setGenerando(true)
    try {
      const html2canvas = (await import("html2canvas")).default
      const { jsPDF } = await import("jspdf")

      const canvas = await html2canvas(docRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        logging: false,
        // html2canvas no soporta oklch/lab/oklab usados por Tailwind v4 + shadcn.
        // Inyectamos un override con hex equivalentes antes de la captura.
        onclone: (_clonedDoc, element) => {
          const style = element.ownerDocument.createElement("style")
          style.textContent = `
            *, *::before, *::after {
              --background:          #f5f5f8 !important;
              --foreground:          #111827 !important;
              --card:                #ffffff !important;
              --card-foreground:     #111827 !important;
              --popover:             #ffffff !important;
              --popover-foreground:  #111827 !important;
              --primary:             #1e3a5f !important;
              --primary-foreground:  #f9fafb !important;
              --secondary:           #e5e7eb !important;
              --secondary-foreground:#111827 !important;
              --muted:               #f3f4f6 !important;
              --muted-foreground:    #6b7280 !important;
              --accent:              #34d399 !important;
              --accent-foreground:   #064e3b !important;
              --destructive:         #ef4444 !important;
              --border:              #d1d5db !important;
              --input:               #d1d5db !important;
              --ring:                #1e3a5f !important;
            }
          `
          element.ownerDocument.head.appendChild(style)
        },
      })

      const imgData = canvas.toDataURL("image/png")
      const imgWidth = canvas.width
      const imgHeight = canvas.height

      // A4 en puntos: 595.28 × 841.89
      const pdfWidth = 595.28
      const pdfHeight = (imgHeight * pdfWidth) / imgWidth

      const pdf = new jsPDF({
        orientation: pdfHeight > pdfWidth ? "portrait" : "landscape",
        unit: "pt",
        format: [pdfWidth, pdfHeight],
      })

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
      pdf.save(`Cotizacion-${numeroCotizacion}-${cliente || "cliente"}.pdf`)
    } catch (err) {
      console.error("Error generando PDF:", err)
    } finally {
      setGenerando(false)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Título */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Cotizaciones y Pedidos
        </h1>
        <p className="text-sm text-muted-foreground">
          Completa los datos y descarga la cotización en PDF.
        </p>
      </div>

      {/* Formulario a pantalla completa */}
      <div className="mx-auto max-w-3xl space-y-6">
        {/* ── SECCIÓN: ENCABEZADO ─────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Datos del Documento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numero-cot">No. Cotización</Label>
                <Input
                  id="numero-cot"
                  value={numeroCotizacion}
                  onChange={(e) => setNumeroCotizacion(e.target.value)}
                  maxLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="cliente">Cliente</Label>
                <Input
                  id="cliente"
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                  placeholder="Nombre del cliente o empresa"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="nit">NIT</Label>
                <Input
                  id="nit"
                  value={nit}
                  onChange={(e) => setNit(e.target.value)}
                  placeholder="901418617"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── SECCIÓN: ARTÍCULO ───────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Agregar Artículo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cantidad">Cantidad</Label>
                <Input
                  id="cantidad"
                  type="number"
                  min={1}
                  value={cantidad}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCantidad(val === "" ? "" : Number(val));
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="precio">Precio Unitario ($)</Label>
                <Input
                  id="precio"
                  type="number"
                  min={0}
                  value={precio}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPrecio(val === "" ? "" : Number(val));
                  }}
                  placeholder="65000"
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="tipo">Tipo de Producto</Label>
                <Select value={tipo} onValueChange={setTipo}>
                  <SelectTrigger id="tipo">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposProducto.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tela">Tela</Label>
                <Select value={tela} onValueChange={setTela}>
                  <SelectTrigger id="tela">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {telas.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="decoracion">Tipo de Decoración</Label>
                <Select value={tipoDecoracion} onValueChange={setTipoDecoracion}>
                  <SelectTrigger id="decoracion">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposDecoracion.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="composicion">Composición</Label>
                <Input
                  id="composicion"
                  value={composicion}
                  onChange={(e) => setComposicion(e.target.value)}
                  placeholder="Ej: 100% POLIESTER"
                />
              </div>
            </div>

            <Separator />

            <ZonaUpload
              id="render-diseno"
              titulo="Render del Diseño (opcional)"
              descripcion="Imagen 3D del producto para el cliente · PNG / JPG"
              archivo={renderNombre}
              onArchivo={(nombre, url) => {
                setRenderNombre(nombre)
                setRenderUrl(url)
              }}
            />

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={agregarArticulo}
            >
              <Plus className="size-4" />
              Agregar artículo a la cotización
            </Button>
          </CardContent>
        </Card>

        {/* ── LISTA DE ARTÍCULOS CONFIRMADOS ─────────────────────── */}
        {articulos.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Artículos en la cotización ({articulos.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-border">
                {articulos.map((a, i) => (
                  <li key={a.id} className="flex items-center gap-3 py-3">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {a.cantidad} × {a.tipo}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Tela {a.tela} · {a.tipoDecoracion}
                      </p>
                    </div>
                    <span className="shrink-0 tabular-nums text-sm font-semibold">
                      {formatCOP(a.cantidad * a.precioUnitario)}
                    </span>
                    <button
                      type="button"
                      onClick={() => eliminarArticulo(a.id)}
                      className="shrink-0 text-destructive/70 hover:text-destructive"
                      aria-label="Eliminar"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex justify-end border-t pt-3">
                <p className="text-sm font-bold">
                  Total: <span className="tabular-nums">{formatCOP(total)}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── BOTÓN DESCARGAR PDF ─────────────────────────────────── */}
        <Button
          size="lg"
          className="w-full gap-2 text-base"
          onClick={descargarPDF}
          disabled={generando}
        >
          {generando ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Generando PDF…
            </>
          ) : (
            <>
              <Download className="size-5" />
              Descargar Cotización PDF
            </>
          )}
        </Button>
      </div>

      {/* ── DOCUMENTO OCULTO PARA CAPTURA ─────────────────────────── */}
      <DocumentoCotizacion
        elRef={docRef}
        numeroCotizacion={numeroCotizacion}
        cliente={cliente}
        nit={nit}
        fecha={fecha}
        itemsPreview={itemsPreview}
        total={total}
        formatearFechaLarga={formatearFechaLarga}
      />
    </div>
  )
}
