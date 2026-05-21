'use client'

import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { STATUS_OPTIONS } from '@/lib/constants'
import { Trash2, X } from 'lucide-react'
import { useBulkDeleteContents, useBulkUpdateStatus } from '../hooks/use-content-mutations'

interface ContentBulkActionsProps {
  selectedIds: string[]
  onClearSelection: () => void
}

export function ContentBulkActions({ selectedIds, onClearSelection }: ContentBulkActionsProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const bulkDeleteMutation = useBulkDeleteContents()
  const bulkStatusMutation = useBulkUpdateStatus()

  if (selectedIds.length === 0) return null

  function handleBulkDelete() {
    bulkDeleteMutation.mutate(selectedIds, {
      onSuccess: () => {
        setDeleteDialogOpen(false)
        onClearSelection()
      },
    })
  }

  function handleStatusChange(status: string) {
    bulkStatusMutation.mutate(
      { ids: selectedIds, status },
      { onSuccess: onClearSelection },
    )
  }

  return (
    <>
      <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <span className="flex h-6 min-w-6 items-center justify-center rounded-md bg-gray-900 px-1.5 text-xs font-semibold text-white tabular-nums dark:bg-gray-100 dark:text-gray-900">
              {selectedIds.length}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              selecionado{selectedIds.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="h-5 w-px bg-gray-200 dark:bg-gray-700" />

          <Select
            value={null}
            onValueChange={(value) => {
              if (value) handleStatusChange(value as string)
            }}
          >
            <SelectTrigger className="w-[150px] rounded-lg border-gray-200 bg-white text-sm dark:border-gray-700 dark:bg-gray-800" size="sm">
              <SelectValue placeholder="Alterar status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-1 h-3.5 w-3.5" />
            Excluir
          </Button>

          <button
            type="button"
            onClick={onClearSelection}
            className="ml-1 rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir conteudos</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir {selectedIds.length} conteudo
              {selectedIds.length > 1 ? 's' : ''}? Esta acao nao pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={bulkDeleteMutation.isPending}
            >
              {bulkDeleteMutation.isPending ? 'Excluindo...' : 'Excluir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
