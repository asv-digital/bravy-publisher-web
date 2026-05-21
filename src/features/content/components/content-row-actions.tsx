'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Pencil, Copy, Trash2 } from 'lucide-react'
import { useDeleteContent, useDuplicateContent } from '../hooks/use-content-mutations'

interface ContentRowActionsProps {
  contentId: string
  contentSlug: string
}

export function ContentRowActions({ contentId, contentSlug }: ContentRowActionsProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const deleteMutation = useDeleteContent()
  const duplicateMutation = useDuplicateContent()

  function handleDuplicate(e: React.MouseEvent) {
    e.stopPropagation()
    duplicateMutation.mutate(contentId)
  }

  function handleDelete() {
    deleteMutation.mutate(contentId, {
      onSuccess: () => setDeleteDialogOpen(false),
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-7 w-7 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              onClick={(e) => e.stopPropagation()}
            />
          }
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Acoes</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 rounded-lg shadow-lg">
          <DropdownMenuItem
            render={<Link href={`/content/${contentId}`} onClick={(e) => e.stopPropagation()} />}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDuplicate}>
            <Copy className="mr-2 h-4 w-4" />
            Duplicar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation()
              setDeleteDialogOpen(true)
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir conteudo</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir &quot;{contentSlug}&quot;? Esta acao nao pode ser
              desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Excluindo...' : 'Excluir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
