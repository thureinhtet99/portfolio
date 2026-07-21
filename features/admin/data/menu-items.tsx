import { User, Calendar, FolderGit2, Award, FileText } from "lucide-react";

export const adminMenuItems = [
  { id: "settings", label: "Settings", icon: <User className="h-4 w-4" /> },
  {
    id: "timelines",
    label: "Timelines",
    icon: <Calendar className="h-4 w-4" />,
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
