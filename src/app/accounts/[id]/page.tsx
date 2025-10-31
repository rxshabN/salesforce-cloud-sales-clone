import AccountDetail from "@/components/account-detail";

export default function AccountPage({
  params,
}: {
  params: { id: string };
}) {
  return <AccountDetail accountId={parseInt(params.id)} />;
}
