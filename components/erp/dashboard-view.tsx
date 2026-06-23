"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DollarSign,
  ClipboardList,
  AlertTriangle,
  UserX,
  TrendingUp,
} from "lucide-react"
import {
  clientes,
  ordenes,
  movimientos,
  ventasMensuales,
  formatCOP,
  diasDesde,
  UMBRAL_INACTIVIDAD_DIAS,
} from "@/lib/data"

function Metrica({
  titulo,
  valor,
  detalle,
  icon: Icon,
  tono,
}: {
  titulo: string
  valor: string
  detalle: string
  icon: React.ElementType
  tono: "primary" | "accent" | "warning" | "destructive"
}) {
  const tonos = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/15 text-accent-foreground",
    warning: "bg-warning/15 text-warning",
    destructive: "bg-destructive/10 text-destructive",
  }
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {titulo}
        </CardTitle>
        <span className={`flex size-9 items-center justify-center rounded-lg ${tonos[tono]}`}>
          <Icon className="size-5" />
        </span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight text-foreground">{valor}</div>
        <p className="mt-1 text-xs text-muted-foreground">{detalle}</p>
      </CardContent>
    </Card>
  )
}

export function DashboardView() {
  const ventasMes = ventasMensuales[ventasMensuales.length - 1].ventas
  const ordenesActivas = ordenes.filter((o) => o.estado !== "Entregado").length
  const alertasInventario = movimientos.filter((m) => m.tipo === "Salida" && m.cantidad > 100).length + 2
  const clientesInactivos = clientes.filter(
    (c) => diasDesde(c.ultimaCompra) > UMBRAL_INACTIVIDAD_DIAS,
  ).length

  const maxVenta = Math.max(...ventasMensuales.map((v) => v.ventas))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Resumen General</h1>
        <p className="text-sm text-muted-foreground">
          Indicadores clave de la operación de Copa Ropa Deportiva.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metrica
          titulo="Ventas del Mes"
          valor={formatCOP(ventasMes)}
          detalle="Junio 2026 · +14% vs. mayo"
          icon={DollarSign}
          tono="primary"
        />
        <Metrica
          titulo="Órdenes Activas"
          valor={String(ordenesActivas)}
          detalle="Pedidos en proceso de producción"
          icon={ClipboardList}
          tono="accent"
        />
        <Metrica
          titulo="Alertas de Inventario"
          valor={String(alertasInventario)}
          detalle="Prendas con stock por debajo del mínimo"
          icon={AlertTriangle}
          tono="warning"
        />
        <Metrica
          titulo="Clientes Inactivos"
          valor={String(clientesInactivos)}
          detalle={`Sin compras hace +${UMBRAL_INACTIVIDAD_DIAS} días`}
          icon={UserX}
          tono="destructive"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="size-5 text-accent" />
              Ventas de los Últimos 6 Meses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-56 items-end justify-between gap-3 sm:gap-6">
              {ventasMensuales.map((v) => (
                <div key={v.mes} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    {formatCOP(v.ventas).replace("COP", "").replace(/\u00A0/g, "").slice(0, 4)}M
                  </span>
                  <div
                    className="w-full rounded-t-md bg-primary transition-all hover:bg-accent"
                    style={{ height: `${(v.ventas / maxVenta) * 100}%` }}
                  />
                  <span className="text-xs font-semibold text-foreground">{v.mes}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Órdenes Recientes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ordenes.slice(0, 5).map((o) => (
              <div key={o.id} className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">#{o.id} · {o.cliente}</p>
                  <p className="truncate text-xs text-muted-foreground">{o.producto}</p>
                </div>
                <Badge
                  variant="outline"
                  className={
                    o.estado === "Entregado"
                      ? "border-accent/40 bg-accent/10 text-accent-foreground"
                      : o.estado === "En producción"
                        ? "border-primary/30 bg-primary/10 text-primary"
                        : "border-warning/40 bg-warning/10 text-warning"
                  }
                >
                  {o.estado}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
