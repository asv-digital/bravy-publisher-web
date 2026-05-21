import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/layout/page-header'
import { ContentTable } from '@/features/content/components/content-table'
import { Plus } from 'lucide-react'

export default function ContentPage() {
  return (
    <div className="space-y-0">
      <PageHeader
        title="Conteudos"
        description="Gerencie e publique seus conteudos nas redes sociais."
        action={
          <Button nativeButton={false} render={<Link href="/content/new" />}>
            <Plus className="mr-1 h-4 w-4" />
            Novo conteudo
          </Button>
        }
      />
      <ContentTable />
    </div>
  )
}
