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
import { Phone, AlertTriangle } from "lucide-react"
import {
  clientes,
  diasDesde,
  formatFecha,
  UMBRAL_INACTIVIDAD_DIAS,
} from "@/lib/data"

export function ClientesView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Clientes · CRM</h1>
        <p className="text-sm text-muted-foreground">
          {`Los clientes sin compras hace más de ${UMBRAL_INACTIVIDAD_DIAS} días se marcan para seguimiento.`}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Directorio de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Nombre / Razón Social</TableHead>
                  <TableHead>NIT</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Última Compra</TableHead>
                  <TableHead className="text-right">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientes.map((c) => {
                  const dias = diasDesde(c.ultimaCompra)
                  const inactivo = dias > UMBRAL_INACTIVIDAD_DIAS
                  return (
                    <TableRow
                      key={c.id}
                      className={cn(inactivo && "bg-destructive/5 hover:bg-destructive/10")}
                    >
                      <TableCell className="font-medium text-foreground">{c.nombre}</TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">{c.nit}</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Phone className="size-3.5" />
                          {c.telefono}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <span className={cn(inactivo ? "font-medium text-destructive" : "text-foreground")}>
                          {formatFecha(c.ultimaCompra)}
                        </span>
                        <span className="block text-xs text-muted-foreground">hace {dias} días</span>
                      </TableCell>
                      <TableCell className="text-right">
                        {inactivo ? (
                          <Badge className="gap-1 border-transparent bg-destructive text-primary-foreground hover:bg-destructive">
                            <AlertTriangle className="size-3" />
                            ¡Alerta: Seguimiento Necesario!
                          </Badge>
                        ) : (
                          <Badge className="border-transparent bg-accent/15 text-accent-foreground hover:bg-accent/15">
                            Activo
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
