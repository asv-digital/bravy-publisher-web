'use client'

import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getAccounts } from '@/features/accounts/api/accounts-api'
import { publishContent, getPublishTarget } from '../../api/publishing-api'

type PublishMode = 'now' | 'schedule'

interface PublishDialogProps {
  contentId: string
  /** Modo inicial do diálogo; o usuário pode alternar pelo seletor interno. */
  initialMode?: PublishMode
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PublishDialog({
  contentId,
  initialMode = 'schedule',
  open,
  onOpenChange,
}: PublishDialogProps) {
  const queryClient = useQueryClient()
  const [mode, setMode] = useState<PublishMode>(initialMode)
  const [accountId, setAccountId] = useState<string>('')
  const [scheduledAt, setScheduledAt] = useState<string>('')
  // quando definido, o diálogo entra no modo "acompanhar publicação" e faz polling
  const [targetId, setTargetId] = useState<string | null>(null)

  // ao reabrir, parte sempre do modo solicitado pelo chamador e limpa o
  // acompanhamento anterior — ajuste de estado durante o render (padrão React)
  const [wasOpen, setWasOpen] = useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) {
      setMode(initialMode)
      setTargetId(null)
    }
  }

  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ['social-accounts'],
    queryFn: getAccounts,
    enabled: open,
  })

  // pré-seleciona a primeira conta assim que a lista carrega (ajuste em render,
  // mesmo padrão acima — evita efeito que dispara re-render extra)
  if (!accountId && accounts.length > 0) {
    setAccountId(accounts[0].id)
  }

  const publishMutation = useMutation({
    mutationFn: () =>
      publishContent(contentId, {
        socialAccountId: accountId,
        scheduledAt: mode === 'schedule' ? new Date(scheduledAt).toISOString() : undefined,
      }),
    onSuccess: (target) => {
      queryClient.invalidateQueries({ queryKey: ['content', contentId] })
      if (mode === 'schedule') {
        toast.success('Publicação agendada')
        onOpenChange(false)
        return
      }
      // publicar agora: começa a acompanhar o progresso dentro do próprio diálogo
      setTargetId(target.id)
    },
    onError: (err: Error) => {
      toast.error(`Falha ao publicar: ${err.message}`)
    },
  })

  // polling do progresso enquanto a publicação não termina
  const { data: target } = useQuery({
    queryKey: ['publish-target', targetId],
    queryFn: () => getPublishTarget(targetId!),
    enabled: !!targetId,
    refetchInterval: (query) => {
      const status = query.state.data?.status
      return status === 'COMPLETED' || status === 'FAILED' ? false : 1500
    },
  })

  // ao concluir, atualiza as listagens/detalhe para refletir o status publicado
  const status = target?.status
  useEffect(() => {
    if (status === 'COMPLETED') {
      queryClient.invalidateQueries({ queryKey: ['content', contentId] })
      queryClient.invalidateQueries({ queryKey: ['contents'] })
    }
  }, [status, contentId, queryClient])

  const tracking = targetId !== null
  const isDone = status === 'COMPLETED'
  const isFailed = status === 'FAILED'
  const pct = isDone ? 100 : Math.max(target?.progress ?? 0, status ? 4 : 0)
  const phaseLabel = isFailed
    ? 'Falha na publicação'
    : isDone
      ? 'Publicado com sucesso'
      : target?.progressPhase ?? (status === 'PENDING' ? 'Na fila…' : 'Preparando…')

  const disabled =
    !accountId || (mode === 'schedule' && !scheduledAt) || publishMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {tracking ? (
          <>
            <DialogHeader>
              <DialogTitle>
                {isDone ? 'Publicado' : isFailed ? 'Não foi possível publicar' : 'Publicando…'}
              </DialogTitle>
              <DialogDescription>
                {isDone
                  ? 'Seu conteúdo foi publicado na conta selecionada.'
                  : isFailed
                    ? 'A publicação foi interrompida. Você pode tentar de novo.'
                    : 'Acompanhe o envio dos slides em tempo real.'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3">
              <div className="flex items-center gap-2 text-sm">
                {isDone ? (
                  <CheckCircle2 className="size-4 text-emerald-500" />
                ) : isFailed ? (
                  <AlertTriangle className="size-4 text-destructive" />
                ) : (
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                )}
                <span className={cn('font-medium', isFailed && 'text-destructive')}>
                  {phaseLabel}
                </span>
                {!isFailed && (
                  <span className="ml-auto tabular-nums text-muted-foreground">{pct}%</span>
                )}
              </div>

              {!isFailed && (
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      'h-full rounded-full transition-[width] duration-700 ease-out',
                      isDone ? 'bg-emerald-500' : 'bg-primary',
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              )}

              {isFailed && target?.lastError && (
                <p className="rounded-md bg-destructive/10 p-2 text-xs text-destructive">
                  {target.lastError}
                </p>
              )}
            </div>

            <DialogFooter>
              {isFailed ? (
                <>
                  <DialogClose render={<Button variant="outline" />}>Fechar</DialogClose>
                  <Button
                    onClick={() => {
                      setTargetId(null)
                      publishMutation.reset()
                    }}
                  >
                    Tentar de novo
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => onOpenChange(false)}
                  variant={isDone ? 'default' : 'outline'}
                >
                  {isDone ? 'Concluir' : 'Fechar'}
                </Button>
              )}
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>
                {mode === 'schedule' ? 'Agendar publicação' : 'Publicar agora'}
              </DialogTitle>
              <DialogDescription>
                Selecione a conta de destino{mode === 'schedule' ? ' e quando publicar' : ''}.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="inline-flex w-full rounded-lg border p-0.5">
                {([
                  { value: 'now', label: 'Publicar agora' },
                  { value: 'schedule', label: 'Agendar' },
                ] as const).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setMode(opt.value)}
                    className={cn(
                      'flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                      mode === opt.value
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="account">Conta</Label>
                <Select
                  value={accountId}
                  onValueChange={(v) => setAccountId(v ?? '')}
                  disabled={isLoading}
                >
                  <SelectTrigger id="account">
                    <SelectValue placeholder={isLoading ? 'Carregando...' : 'Selecione'} />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((acc) => (
                      <SelectItem key={acc.id} value={acc.id}>
                        {acc.accountName}  ({acc.platform})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!isLoading && accounts.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Nenhuma conta conectada. Conecte uma conta em Settings  Contas.
                  </p>
                )}
              </div>

              {mode === 'schedule' && (
                <div className="space-y-1.5">
                  <Label htmlFor="scheduledAt">Data e hora</Label>
                  <Input
                    id="scheduledAt"
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
              )}
            </div>

            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>Cancelar</DialogClose>
              <Button disabled={disabled} onClick={() => publishMutation.mutate()}>
                {publishMutation.isPending
                  ? 'Enviando...'
                  : mode === 'schedule'
                    ? 'Agendar'
                    : 'Publicar'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
