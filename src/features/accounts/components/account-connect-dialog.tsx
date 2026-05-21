'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { Platform } from '@/types/social-account'
import { cn } from '@/lib/utils'
import { Plus, Camera, Briefcase, Music, AtSign, ExternalLink, type LucideIcon } from 'lucide-react'

const PLATFORMS: {
  value: Platform
  label: string
  icon: LucideIcon
  bgColor: string
  textColor: string
}[] = [
  {
    value: 'INSTAGRAM',
    label: 'Instagram',
    icon: Camera,
    bgColor: 'bg-pink-100 dark:bg-pink-950',
    textColor: 'text-pink-500',
  },
  {
    value: 'LINKEDIN',
    label: 'LinkedIn',
    icon: Briefcase,
    bgColor: 'bg-blue-100 dark:bg-blue-950',
    textColor: 'text-blue-600',
  },
  {
    value: 'TIKTOK',
    label: 'TikTok',
    icon: Music,
    bgColor: 'bg-zinc-100 dark:bg-zinc-800',
    textColor: 'text-zinc-900 dark:text-zinc-100',
  },
  {
    value: 'TWITTER',
    label: 'Twitter',
    icon: AtSign,
    bgColor: 'bg-sky-100 dark:bg-sky-950',
    textColor: 'text-sky-500',
  },
]

export function AccountConnectDialog() {
  const [selected, setSelected] = useState<Platform | null>(null)
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="mr-1 h-4 w-4" />
        Conectar conta
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Conectar nova conta</DialogTitle>
          <DialogDescription>
            Selecione a plataforma para conectar via OAuth.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 py-2">
          {PLATFORMS.map((platform) => {
            const Icon = platform.icon
            const isSelected = selected === platform.value

            return (
              <button
                key={platform.value}
                type="button"
                onClick={() => setSelected(platform.value)}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-xl border p-4 transition-all',
                  isSelected
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-border hover:bg-muted',
                )}
              >
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-lg',
                    platform.bgColor,
                  )}
                >
                  <Icon className={cn('h-5 w-5', platform.textColor)} />
                </div>
                <span className="text-sm font-medium">{platform.label}</span>
              </button>
            )
          })}
        </div>

        {selected && (
          <div className="rounded-lg border border-dashed bg-muted/50 p-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ExternalLink className="h-4 w-4 shrink-0" />
              <span>
                Voce sera redirecionado para autorizar o acesso via OAuth.
              </span>
            </div>
          </div>
        )}

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancelar
          </DialogClose>
          <Button disabled={!selected} onClick={() => setOpen(false)}>
            Conectar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
