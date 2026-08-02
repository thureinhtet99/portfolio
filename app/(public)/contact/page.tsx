import { ContactView } from "@/features/contact/components/contact-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Thu Rein Htet — send a message about projects, collaborations, or have a conversation.",
};

export default function ContactPage() {
  return <ContactView />;
}
