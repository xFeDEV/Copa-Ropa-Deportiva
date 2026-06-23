"use client"

import { useState } from "react"
import { Sidebar, type Vista } from "@/components/erp/sidebar"
import { DashboardView } from "@/components/erp/dashboard-view"
import { CotizacionesView } from "@/components/erp/cotizaciones-view"
import { InventarioView } from "@/components/erp/inventario-view"
import { ClientesView } from "@/components/erp/clientes-view"
import Image from "next/image"

const titulos: Record<Vista, string> = {
  dashboard: "Panel Principal",
  cotizaciones: "Cotizaciones y Pedidos",
  inventario: "Inventario (Kardex)",
  clientes: "Clientes (CRM)",
}

export default function Page() {
  const [vista, setVista] = useState<Vista>("dashboard")

  return (
    <div className="min-h-screen bg-background">
      <Sidebar vistaActiva={vista} onCambiarVista={setVista} />

      <div className="pl-16 md:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-card/80 px-4 backdrop-blur sm:px-6 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Copa Ropa Deportiva
            </span>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-sm font-semibold text-foreground">{titulos[vista]}</span>
          </div>
          <div className="relative size-9 shrink-0 overflow-hidden rounded-full border border-border bg-black">
            <Image
              src="/copa-fondo.negro.png"
              alt="Logo Copa Ropa Deportiva"
              fill
              sizes="36px"
              className="object-cover"
            />
          </div>
        </header>

        <main className="p-4 sm:p-6">
          {vista === "dashboard" && <DashboardView />}
          {vista === "cotizaciones" && <CotizacionesView />}
          {vista === "inventario" && <InventarioView />}
          {vista === "clientes" && <ClientesView />}
        </main>
      </div>
    </div>
  )
}
