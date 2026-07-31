import {
  Award,
  BriefcaseBusiness,
  FileText,
  FolderGit2,
  User,
} from "lucide-react";
import { MdOutlineTimeline } from "react-icons/md";

export const adminMenuItems = [
  { id: "settings", label: "Settings", icon: <User className="h-4 w-4" /> },
  {
    id: "timelines",
    label: "Timelines",
    icon: <MdOutlineTimeline className="h-4 w-4" />,
  },
  {
    id: "work-experiences",
    label: "Work exps",
    icon: <BriefcaseBusiness className="h-4 w-4" />,
  },
  {
    id: "projects",
    label: "Projects",
    icon: <FolderGit2 className="h-4 w-4" />,
  },
  {
    id: "certificates",
    label: "Certificates",
    icon: <Award className="h-4 w-4" />,
  },
  {
    id: "posts",
    label: "Posts",
    icon: <FileText className="h-4 w-4" />,
  },
];
