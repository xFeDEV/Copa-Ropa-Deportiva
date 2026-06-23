"use client"

import { cn } from "@/lib/utils"
import { LayoutDashboard, FileText, Boxes, Users } from "lucide-react"
import Image from "next/image"

export type Vista = "dashboard" | "cotizaciones" | "inventario" | "clientes"

interface NavItem {
  id: Vista
  label: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "cotizaciones", label: "Cotizaciones y Pedidos", icon: FileText },
  { id: "inventario", label: "Inventario (Kardex)", icon: Boxes },
  { id: "clientes", label: "Clientes (CRM)", icon: Users },
]

interface SidebarProps {
  vistaActiva: Vista
  onCambiarVista: (vista: Vista) => void
}

export function Sidebar({ vistaActiva, onCambiarVista }: SidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-16 flex-col bg-sidebar text-sidebar-foreground md:w-64 print:hidden">
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-3 md:px-5">
        <div className="relative size-9 shrink-0 overflow-hidden rounded-lg bg-black">
          <Image
            src="/copa-fondo.negro.png"
            alt="Logo Copa Ropa Deportiva"
            fill
            sizes="36px"
            className="object-cover"
          />
        </div>
        <div className="hidden flex-col leading-tight md:flex">
          <span className="text-sm font-bold tracking-tight">COPA ROPA</span>
          <span className="text-xs text-sidebar-foreground/60">Deportiva ERP</span>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-2 md:p-3">
        {navItems.map((item) => {
          const Icon = item.icon
          const activo = vistaActiva === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onCambiarVista(item.id)}
              aria-current={activo ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                activo
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
              title={item.label}
            >
              <Icon className="size-5 shrink-0" />
              <span className="hidden md:inline">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="hidden border-t border-sidebar-border p-4 md:block">
        <p className="text-xs text-sidebar-foreground/50">
          {"Versión 1.0 · Fábrica Textil"}
        </p>
      </div>
    </aside>
  )
}
