import ContactDetail from "@/components/contact-detail";

export default function ContactDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <ContactDetail contactId={parseInt(params.id)} />;
}
