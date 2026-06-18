'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { AccountStatusIndicator } from './account-status-indicator'
import { useDisconnectAccount } from '../hooks/use-account-mutations'
import type { SocialAccount, Platform } from '@/types/social-account'
import { format, differenceInDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Camera, Briefcase, Music, AtSign, Unplug, RefreshCw, type LucideIcon } from 'lucide-react'

const PLATFORM_CONFIG: Record<
  Platform,
  { icon: LucideIcon; bgColor: string; textColor: string; label: string }
> = {
  INSTAGRAM: {
    icon: Camera,
    bgColor: 'bg-pink-100 dark:bg-pink-950',
    textColor: 'text-pink-500',
    label: 'Instagram',
  },
  LINKEDIN: {
    icon: Briefcase,
    bgColor: 'bg-blue-100 dark:bg-blue-950',
    textColor: 'text-blue-600',
    label: 'LinkedIn',
  },
  TIKTOK: {
    icon: Music,
    bgColor: 'bg-zinc-100 dark:bg-zinc-800',
    textColor: 'text-zinc-900 dark:text-zinc-100',
    label: 'TikTok',
  },
  TWITTER: {
    icon: AtSign,
    bgColor: 'bg-sky-100 dark:bg-sky-950',
    textColor: 'text-sky-500',
    label: 'Twitter',
  },
}

// Plataformas que identificam a conta por @handle (vs. nome de empresa/pessoa).
const HANDLE_PLATFORMS: Platform[] = ['INSTAGRAM', 'TWITTER', 'TIKTOK']

// Garante exatamente um "@" na frente do handle, sem duplicar caso o nome já
// venha prefixado (mock/legado).
function displayAccountName(platform: Platform, name: string): string {
  if (!HANDLE_PLATFORMS.includes(platform)) return name
  return name.startsWith('@') ? name : `@${name}`
}

interface AccountCardProps {
  account: SocialAccount
}

export function AccountCard({ account }: AccountCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const disconnectMutation = useDisconnectAccount()
  const config = PLATFORM_CONFIG[account.platform]
  const PlatformIcon = config.icon
  const displayName = displayAccountName(account.platform, account.accountName)

  const now = new Date()
  const expiresAt = new Date(account.tokenExpiresAt)
  const daysUntilExpiry = differenceInDays(expiresAt, now)
  const isExpired = !account.connected || daysUntilExpiry < 0

  function handleDisconnect() {
    disconnectMutation.mutate(account.id, {
      onSuccess: () => {
        toast.success('Conta desconectada com sucesso')
        setConfirmOpen(false)
      },
      onError: () => {
        toast.error('Erro ao desconectar conta')
      },
    })
  }

  return (
    <Card>
      <CardContent className="pt-0">
        <div className="flex items-start gap-4">
          <Avatar size="lg" className="h-12 w-12 shrink-0">
            {account.avatarUrl && (
              <AvatarImage src={account.avatarUrl} alt={displayName} />
            )}
            <AvatarFallback className={cn(config.bgColor)}>
              <PlatformIcon className={cn('h-6 w-6', config.textColor)} />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{displayName}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {config.label} &middot; {account.accountId}
            </p>
            <div className="mt-2">
              <AccountStatusIndicator
                tokenExpiresAt={account.tokenExpiresAt}
                connected={account.connected}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Token expira em{' '}
              {format(expiresAt, "dd/MM/yyyy", { locale: ptBR })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          {isExpired && (
            <Button variant="outline" size="sm" className="flex-1">
              <RefreshCw className="mr-1 h-3.5 w-3.5" />
              Reconectar
            </Button>
          )}
          <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <DialogTrigger
              render={
                <Button
                  variant="destructive"
                  size="sm"
                  className={cn(!isExpired && 'flex-1')}
                />
              }
            >
              <Unplug className="mr-1 h-3.5 w-3.5" />
              Desconectar
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Desconectar conta</DialogTitle>
                <DialogDescription>
                  Tem certeza que deseja desconectar{' '}
                  <strong>{displayName}</strong>? Conteudos agendados
                  para esta conta nao serao publicados.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>
                  Cancelar
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={handleDisconnect}
                  disabled={disconnectMutation.isPending}
                >
                  {disconnectMutation.isPending
                    ? 'Desconectando...'
                    : 'Confirmar'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}
