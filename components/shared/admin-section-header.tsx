import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

type AdminSectionHeaderProps = {
  title: string;
  count?: number;
  onAdd?: () => void;
  addLabel?: string;
};

export default function AdminSectionHeader({
  title,
  count,
  onAdd,
  addLabel,
}: AdminSectionHeaderProps) {
  return (
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle className="flex items-center gap-2">
          {title}
          {count !== undefined && (
            <span className="text-sm font-normal text-muted-foreground">
              ({count})
            </span>
          )}
        </CardTitle>
        {onAdd && (
          <Button size="lg" onClick={onAdd}>
            <Plus className="h-4 w-4" />
            {addLabel ?? `Add ${title.replace(/^Manage\s+/, "")}`}
          </Button>
        )}
      </div>
    </CardHeader>
  );
}
