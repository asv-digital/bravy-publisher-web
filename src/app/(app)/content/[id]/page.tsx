'use client'

import { use } from 'react'
import { EditorContainer } from '@/features/content/components/editor/editor-container'

export default function ContentEditorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  return <EditorContainer contentId={id} />
}
