import OpportunityDetail from "@/components/opportunity-detail";

export default function OpportunityPage({
  params,
}: {
  params: { id: string };
}) {
  return <OpportunityDetail opportunityId={parseInt(params.id)} />;
}
