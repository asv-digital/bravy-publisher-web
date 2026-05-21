import { PageHeader } from '@/components/layout/page-header'
import { WizardContainer } from '@/features/content/components/wizard/wizard-container'

export default function ContentNewPage() {
  return (
    <div>
      <PageHeader title="Novo conteudo" />
      <WizardContainer />
    </div>
  )
}
