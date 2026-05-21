'use client'

import { useQuery } from '@tanstack/react-query'
import { getContent } from '../../api/content-api'
import { EditorSplitLayout } from './editor-split-layout'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface EditorContainerProps {
  contentId: string
}

export function EditorContainer({ contentId }: EditorContainerProps) {
  const { data: content, isLoading, isError, error } = useQuery({
    queryKey: ['content', contentId],
    queryFn: () => getContent(contentId),
  })

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="flex gap-4">
          <div className="w-[55%] space-y-4">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
          <div className="w-[45%] space-y-4">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !content) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="size-6 text-destructive" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold">Conteudo nao encontrado</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {error instanceof Error ? error.message : 'O conteudo solicitado nao existe ou foi removido.'}
          </p>
        </div>
        <Link href="/content">
          <Button variant="outline" size="sm">
            <ArrowLeft className="size-3.5" data-icon="inline-start" />
            Voltar para conteudos
          </Button>
        </Link>
      </div>
    )
  }

  return <EditorSplitLayout content={content} />
}
