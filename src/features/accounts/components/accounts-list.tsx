'use client'

import { useAccounts } from '../hooks/use-accounts'
import { AccountCard } from './account-card'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/layout/empty-state'
import { Link2Off } from 'lucide-react'

function AccountCardSkeleton() {
  return (
    <div className="rounded-xl border p-4">
      <div className="flex items-start gap-4">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div className="flex-1">
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-3 w-48 mb-3" />
          <Skeleton className="h-3 w-20 mb-1" />
          <Skeleton className="h-3 w-36" />
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <Skeleton className="h-7 flex-1 rounded-lg" />
      </div>
    </div>
  )
}

export function AccountsList() {
  const { data, isLoading } = useAccounts()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <AccountCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={Link2Off}
        title="Nenhuma conta conectada"
        description="Conecte suas redes sociais para comecar a publicar conteudos."
      />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((account) => (
        <AccountCard key={account.id} account={account} />
      ))}
    </div>
  )
}
