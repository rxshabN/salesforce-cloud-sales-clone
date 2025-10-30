import LeadDetail from "@/components/lead-detail"

interface LeadDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params
  return <LeadDetail leadId={parseInt(id, 10)} />
}
