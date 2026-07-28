import LeaveANoteView from "@/features/leave-a-note/components/leave-a-note-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leave a Note",
  description:
    "Leave a note — thoughts, feedback, or just say hi. Powered by GitHub Discussions.",
};

export default function LeaveANotePage() {
  return <LeaveANoteView />;
}
