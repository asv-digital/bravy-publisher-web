'use client'

import { useState, useEffect, useCallback } from 'react'
import { Clock, Send, Save } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Separator } from '@/components/ui/separator'
import { api } from '@/lib/api-client'
import { PLATFORMS } from '@/lib/constants'
import type { SocialAccount } from '@/types/social-account'
import { useWizardStore } from './wizard-store'

const MOCK_ACCOUNTS: SocialAccount[] = [
  {
    id: '1',
    platform: 'INSTAGRAM',
    accountName: '@bravy.school',
    accountId: 'bravy_school',
    connected: true,
    tokenExpiresAt: '2026-12-31T23:59:59Z',
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '2',
    platform: 'LINKEDIN',
    accountName: 'Bravy School',
    accountId: 'bravy-school',
    connected: true,
    tokenExpiresAt: '2026-12-31T23:59:59Z',
    createdAt: '2025-01-01T00:00:00Z',
  },
]

export function StepSchedule() {
  const generatedContent = useWizardStore((s) => s.generatedContent)
  const selectedAccountIds = useWizardStore((s) => s.selectedAccountIds)
  const scheduledAt = useWizardStore((s) => s.scheduledAt)
  const setAccounts = useWizardStore((s) => s.setAccounts)
  const setSchedule = useWizardStore((s) => s.setSchedule)

  const [accounts, setAccountsList] = useState<SocialAccount[]>([])
  const [publishNow, setPublishNow] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [timeValue, setTimeValue] = useState('09:00')
  const [submitting, setSubmitting] = useState(false)

  const fetchAccounts = useCallback(async () => {
    try {
      const { data } = await api.get<SocialAccount[]>('/social-accounts')
      setAccountsList(data)
    } catch {
      setAccountsList(MOCK_ACCOUNTS)
    }
  }, [])

  useEffect(() => {
    fetchAccounts()
  }, [fetchAccounts])

  useEffect(() => {
    if (scheduledAt) {
      const date = new Date(scheduledAt)
      setSelectedDate(date)
      setTimeValue(
        `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
      )
    }
  }, [scheduledAt])

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    if (date) {
      const [hours, minutes] = timeValue.split(':').map(Number)
      const scheduled = new Date(date)
      scheduled.setHours(hours, minutes, 0, 0)
      setSchedule(scheduled.toISOString())
      setPublishNow(false)
    } else {
      setSchedule(null)
    }
  }

  const handleTimeChange = (value: string) => {
    setTimeValue(value)
    if (selectedDate) {
      const [hours, minutes] = value.split(':').map(Number)
      const scheduled = new Date(selectedDate)
      scheduled.setHours(hours, minutes, 0, 0)
      setSchedule(scheduled.toISOString())
    }
  }

  const handlePublishNow = () => {
    setPublishNow(true)
    setSelectedDate(undefined)
    setSchedule(null)
  }

  const toggleAccount = (accountId: string) => {
    const next = selectedAccountIds.includes(accountId)
      ? selectedAccountIds.filter((id) => id !== accountId)
      : [...selectedAccountIds, accountId]
    setAccounts(next)
  }

  const getPlatformInfo = (platform: string) => {
    return PLATFORMS.find((p) => p.value === platform)
  }

  const handleSubmit = async (asDraft: boolean) => {
    if (!generatedContent) return

    setSubmitting(true)
    try {
      if (asDraft) {
        await api.patch(`/content/${generatedContent.id}`, {
          status: 'DRAFT',
          caption: generatedContent.caption,
        })
        toast.success('Conteudo salvo como rascunho!')
      } else {
        await api.patch(`/content/${generatedContent.id}`, {
          status: publishNow ? 'PUBLISHING' : 'SCHEDULED',
          caption: generatedContent.caption,
          scheduledAt: publishNow ? new Date().toISOString() : scheduledAt,
          socialAccountIds: selectedAccountIds,
        })
        toast.success(
          publishNow ? 'Publicando conteudo!' : 'Conteudo agendado com sucesso!'
        )
      }
    } catch {
      toast.error('Erro ao salvar. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Agendar publicacao</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Escolha onde e quando publicar
        </p>
      </div>

      {/* Social Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>Contas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {accounts.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nenhuma conta conectada.
            </p>
          )}
          {accounts.map((account) => {
            const platformInfo = getPlatformInfo(account.platform)
            const isChecked = selectedAccountIds.includes(account.id)

            return (
              <label
                key={account.id}
                className="flex items-center gap-3 cursor-pointer rounded-lg p-2 transition-colors hover:bg-muted"
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={() => toggleAccount(account.id)}
                />
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-medium ${platformInfo?.color ?? ''}`}
                  >
                    {platformInfo?.label ?? account.platform}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {account.accountName}
                  </span>
                </div>
              </label>
            )
          })}
        </CardContent>
      </Card>

      {/* Date/Time */}
      <Card>
        <CardHeader>
          <CardTitle>Quando publicar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant={publishNow ? 'default' : 'outline'}
            onClick={handlePublishNow}
            className="w-full sm:w-auto"
          >
            <Send className="size-4" data-icon="inline-start" />
            Publicar agora
          </Button>

          <Separator />

          <div className="flex flex-col items-start gap-4 sm:flex-row">
            <div>
              <Label className="mb-2">Data</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={{ before: new Date() }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time-input">
                <Clock className="size-3.5" />
                Horario
              </Label>
              <Input
                id="time-input"
                type="time"
                value={timeValue}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="w-32"
              />
              {selectedDate && (
                <p className="text-xs text-muted-foreground">
                  Agendado para{' '}
                  {selectedDate.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}{' '}
                  as {timeValue}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button
          variant="outline"
          disabled={submitting}
          onClick={() => handleSubmit(true)}
        >
          <Save className="size-4" data-icon="inline-start" />
          Salvar como rascunho
        </Button>
        <Button
          disabled={
            submitting ||
            selectedAccountIds.length === 0 ||
            (!publishNow && !scheduledAt)
          }
          onClick={() => handleSubmit(false)}
        >
          {publishNow ? (
            <Send className="size-4" data-icon="inline-start" />
          ) : (
            <Clock className="size-4" data-icon="inline-start" />
          )}
          {publishNow ? 'Publicar agora' : 'Agendar'}
        </Button>
      </div>
    </div>
  )
}
