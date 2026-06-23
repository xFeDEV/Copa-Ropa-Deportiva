"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, ArrowDownToLine, ArrowUpFromLine } from "lucide-react"
import { movimientos, formatFecha } from "@/lib/data"

export function InventarioView() {
  const [busqueda, setBusqueda] = useState("")

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return movimientos
    return movimientos.filter((m) => m.codigoPrenda.toLowerCase().includes(q))
  }, [busqueda])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Inventario · Kardex</h1>
        <p className="text-sm text-muted-foreground">
          Registro de entradas y salidas de prendas en bodega.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">Movimientos de Stock</CardTitle>
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Filtrar por código de prenda..."
              className="pl-9"
              aria-label="Filtrar por código de prenda"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Fecha</TableHead>
                  <TableHead>Código Prenda</TableHead>
                  <TableHead>Talla</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Tipo Movimiento</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                      No se encontraron movimientos para ese código.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtrados.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {formatFecha(m.fecha)}
                      </TableCell>
                      <TableCell className="font-mono text-sm font-medium text-foreground">
                        {m.codigoPrenda}
                      </TableCell>
                      <TableCell>{m.talla}</TableCell>
                      <TableCell>{m.color}</TableCell>
                      <TableCell>
                        {m.tipo === "Entrada" ? (
                          <Badge className="gap-1 border-transparent bg-accent/15 text-accent-foreground hover:bg-accent/15">
                            <ArrowDownToLine className="size-3" />
                            Entrada
                          </Badge>
                        ) : (
                          <Badge className="gap-1 border-transparent bg-destructive/10 text-destructive hover:bg-destructive/10">
                            <ArrowUpFromLine className="size-3" />
                            Salida
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-semibold tabular-nums">
                        {m.tipo === "Entrada" ? "+" : "−"}
                        {m.cantidad}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
