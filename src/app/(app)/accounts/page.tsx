import { PageHeader } from '@/components/layout/page-header'
import { AccountConnectDialog } from '@/features/accounts/components/account-connect-dialog'
import { AccountsList } from '@/features/accounts/components/accounts-list'

export default function AccountsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Contas conectadas"
        description="Gerencie suas contas de redes sociais conectadas."
        action={<AccountConnectDialog />}
      />
      <AccountsList />
    </div>
  )
}
