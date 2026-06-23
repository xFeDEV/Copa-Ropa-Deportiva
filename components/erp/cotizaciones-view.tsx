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
import { formatCOP } from "@/lib/data"
import {
  Printer,
  UploadCloud,
  ImageIcon,
  FileCode2,
  Plus,
  Trash2,
  CheckCircle2,
} from "lucide-react"

interface Articulo {
  id: string
  cantidad: number
  tipo: string
  tela: string
  composicion: string
  precioUnitario: number
  renderUrl: string | null
}

const TERMINOS =
  "ESTOS PRECIOS SON IVA INCLUIDO. TIEMPO DE ENTREGA 12 DIAS APARTIR DE MONTADO EL PEDIDO Y APROBADO EL DISEÑO. FORMA DE PAGO 50% A LA TOMA DEL PEDIDO Y 50% CON LA ENTREGA. ESTA COTIZACIÓN ES VALIDA POR 8 DÍAS A PARTIR DE LA FECHA."

const tiposProducto = [
  "CAMISETA TIPO POLO",
  "CAMISETA DE FÚTBOL",
  "SUDADERA CON CAPOTA",
  "PANTALONETA DEPORTIVA",
  "CHAQUETA LIVIANA",
  "UNIFORME COMPLETO",
]

const telas = ["SUDAFRICA", "DRY FIT", "ALGODÓN PERCHADO", "LICRA POLIÉSTER", "MICROFIBRA"]

function ZonaUpload({
  id,
  titulo,
  descripcion,
  icon: Icon,
  archivo,
  onArchivo,
  acento,
}: {
  id: string
  titulo: string
  descripcion: string
  icon: React.ElementType
  archivo: string | null
  onArchivo: (nombre: string, url: string | null) => void
  acento: "accent" | "primary"
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
            ? "border-accent/50 bg-accent/5"
            : "border-border bg-muted/30 hover:border-primary/40 hover:bg-muted/50",
        )}
      >
        <span
          className={cn(
            "flex size-10 items-center justify-center rounded-full",
            acento === "accent" ? "bg-accent/15 text-accent-foreground" : "bg-primary/10 text-primary",
          )}
        >
          {archivo ? <CheckCircle2 className="size-5 text-accent" /> : <Icon className="size-5" />}
        </span>
        <span className="text-sm font-medium text-foreground">{titulo}</span>
        <span className="text-xs text-muted-foreground">
          {archivo ? archivo : descripcion}
        </span>
        <span className="mt-1 flex items-center gap-1 text-xs font-medium text-primary">
          <UploadCloud className="size-3.5" />
          {archivo ? "Cambiar archivo" : "Subir archivo"}
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

export function CotizacionesView() {
  const [cliente, setCliente] = useState("Club Deportivo Los Andes")
  const [nit, setNit] = useState("900.123.456-7")
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10))

  // Línea actual en edición
  const [cantidad, setCantidad] = useState(150)
  const [tipo, setTipo] = useState(tiposProducto[0])
  const [tela, setTela] = useState(telas[0])
  const [composicion, setComposicion] = useState("100% POLIESTER")
  const [precio, setPrecio] = useState(30000)
  const [renderUrl, setRenderUrl] = useState<string | null>(null)
  const [renderNombre, setRenderNombre] = useState<string | null>(null)
  const [tecnicoNombre, setTecnicoNombre] = useState<string | null>(null)

  const [articulos, setArticulos] = useState<Articulo[]>([])

  const agregarArticulo = () => {
    setArticulos((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        cantidad,
        tipo,
        tela,
        composicion,
        precioUnitario: precio,
        renderUrl,
      },
    ])
  }

  const eliminarArticulo = (id: string) =>
    setArticulos((prev) => prev.filter((a) => a.id !== id))

  // Si no hay artículos agregados, mostramos una vista previa en vivo del actual
  const itemsPreview: Articulo[] =
    articulos.length > 0
      ? articulos
      : [
          {
            id: "preview",
            cantidad,
            tipo,
            tela,
            composicion,
            precioUnitario: precio,
            renderUrl,
          },
        ]

  const total = itemsPreview.reduce((s, a) => s + a.cantidad * a.precioUnitario, 0)

  const formatearFechaLarga = (iso: string) =>
    new Date(iso + "T00:00:00").toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })

  return (
    <div className="space-y-6">
      <div className="print:hidden">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Cotizaciones y Pedidos</h1>
        <p className="text-sm text-muted-foreground">
          Completa los datos y visualiza la cotización en formato de impresión en tiempo real.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* COLUMNA IZQUIERDA: FORMULARIO */}
        <Card className="print:hidden">
          <CardHeader>
            <CardTitle className="text-base">Datos de la Cotización</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="cliente">Cliente</Label>
                <Input id="cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nit">NIT</Label>
                <Input id="nit" value={nit} onChange={(e) => setNit(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha</Label>
                <Input id="fecha" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-3 text-sm font-semibold text-foreground">Detalle del Producto</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cantidad">Cantidad</Label>
                  <Input
                    id="cantidad"
                    type="number"
                    min={1}
                    value={cantidad}
                    onChange={(e) => setCantidad(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="precio">Precio Unitario</Label>
                  <Input
                    id="precio"
                    type="number"
                    min={0}
                    value={precio}
                    onChange={(e) => setPrecio(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Producto</Label>
                  <Select value={tipo} onValueChange={setTipo}>
                    <SelectTrigger id="tipo">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposProducto.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
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
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="composicion">Composición</Label>
                  <Input
                    id="composicion"
                    value={composicion}
                    onChange={(e) => setComposicion(e.target.value)}
                    placeholder="Ej: 100% POLIESTER"
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ZonaUpload
                id="render-diseno"
                titulo="Render del Diseño"
                descripcion="Imagen 3D para el cliente (PNG/JPG)"
                icon={ImageIcon}
                archivo={renderNombre}
                acento="accent"
                onArchivo={(nombre, url) => {
                  setRenderNombre(nombre)
                  setRenderUrl(url)
                }}
              />
              <ZonaUpload
                id="archivos-tecnicos"
                titulo="Archivos Técnicos"
                descripcion="Vectores / producción interna"
                icon={FileCode2}
                archivo={tecnicoNombre}
                acento="primary"
                onArchivo={(nombre) => setTecnicoNombre(nombre)}
              />
            </div>

            <Button type="button" variant="outline" className="w-full" onClick={agregarArticulo}>
              <Plus className="size-4" />
              Agregar artículo a la cotización
            </Button>

            {articulos.length > 0 && (
              <ul className="space-y-2">
                {articulos.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center justify-between gap-2 rounded-md border bg-muted/30 px-3 py-2 text-sm"
                  >
                    <span className="truncate">
                      {a.cantidad} × {a.tipo} ({a.tela})
                    </span>
                    <button
                      type="button"
                      onClick={() => eliminarArticulo(a.id)}
                      className="text-destructive hover:text-destructive/80"
                      aria-label="Eliminar artículo"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* COLUMNA DERECHA: VISTA PREVIA PDF */}
        <div className="space-y-3">
          <div className="flex items-center justify-between print:hidden">
            <h2 className="text-sm font-semibold text-muted-foreground">Vista previa del documento</h2>
            <Button type="button" onClick={() => window.print()} className="bg-primary">
              <Printer className="size-4" />
              Generar y Descargar PDF
            </Button>
          </div>

          <div className="print-area mx-auto w-full max-w-[210mm] rounded-lg border bg-card p-6 text-card-foreground shadow-sm sm:p-10">
            {/* Encabezado */}
            <header className="flex items-start justify-between gap-4 border-b-2 border-primary pb-4">
              <div className="flex items-center gap-3">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-md border bg-white">
                  <Image
                    src="/logo-copa.png"
                    alt="Logo Copa Ropa Deportiva"
                    fill
                    sizes="64px"
                    className="object-contain p-1"
                  />
                </div>
                <div>
                  <p className="text-lg font-extrabold leading-tight tracking-tight text-primary">
                    COPA ROPA DEPORTIVA
                  </p>
                  <p className="text-xs text-muted-foreground">Fabricación de Ropa Deportiva · NIT 901.000.000-0</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-base font-bold text-foreground">COTIZACIÓN No: 0466</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  FECHA: <span className="font-medium text-foreground">{formatearFechaLarga(fecha)}</span>
                </p>
              </div>
            </header>

            {/* Datos del cliente */}
            <div className="grid grid-cols-1 gap-1 py-4 text-sm sm:grid-cols-2">
              <p>
                <span className="font-semibold text-foreground">CLIENTE: </span>
                <span className="text-muted-foreground">{cliente || "—"}</span>
              </p>
              <p className="sm:text-right">
                <span className="font-semibold text-foreground">NIT: </span>
                <span className="text-muted-foreground">{nit || "—"}</span>
              </p>
            </div>

            {/* Tabla de artículos */}
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="border border-primary px-2 py-2 text-center font-semibold">CANT.</th>
                  <th className="border border-primary px-2 py-2 text-left font-semibold">ARTÍCULO</th>
                  <th className="border border-primary px-2 py-2 text-right font-semibold">VALOR UNITARIO</th>
                  <th className="border border-primary px-2 py-2 text-right font-semibold">VALOR TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {itemsPreview.map((a) => (
                  <tr key={a.id} className="align-top">
                    <td className="border border-border px-2 py-3 text-center font-semibold tabular-nums">
                      {a.cantidad}
                    </td>
                    <td className="border border-border px-2 py-3">
                      <p className="font-medium uppercase text-foreground">
                        {a.tipo}, TELA {a.tela}, COMPOSICIÓN {a.composicion}
                      </p>
                      {a.renderUrl ? (
                        <div className="mt-2 overflow-hidden rounded-md border bg-white">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={a.renderUrl || "/placeholder.svg"}
                            alt={`Render del diseño de ${a.tipo}`}
                            className="mx-auto max-h-44 w-auto object-contain"
                            crossOrigin="anonymous"
                          />
                        </div>
                      ) : (
                        <div className="mt-2 flex h-24 items-center justify-center rounded-md border border-dashed bg-muted/40 text-xs text-muted-foreground">
                          Render del diseño pendiente
                        </div>
                      )}
                    </td>
                    <td className="border border-border px-2 py-3 text-right tabular-nums">
                      {formatCOP(a.precioUnitario)}
                    </td>
                    <td className="border border-border px-2 py-3 text-right font-semibold tabular-nums">
                      {formatCOP(a.cantidad * a.precioUnitario)}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={3} className="border border-border px-2 py-2 text-right font-bold uppercase">
                    Total
                  </td>
                  <td className="border border-border bg-accent/15 px-2 py-2 text-right text-base font-extrabold tabular-nums text-foreground">
                    {formatCOP(total)}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Términos */}
            <table className="mt-4 w-full border-collapse text-xs">
              <tbody>
                <tr>
                  <td className="border border-border bg-muted/40 px-3 py-3 font-medium leading-relaxed text-muted-foreground">
                    {TERMINOS}
                  </td>
                </tr>
              </tbody>
            </table>

            <p className="mt-6 text-center text-xs font-medium text-muted-foreground">
              Gracias por confiar en Copa Ropa Deportiva
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
