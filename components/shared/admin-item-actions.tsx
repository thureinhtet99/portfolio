import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Edit, Trash2 } from "lucide-react";
import { ReactNode } from "react";

type AdminItemActionsProps = {
  onMoveUp: () => void;
  onMoveDown: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  /** Disable all buttons (e.g. while a mutation is in-flight). */
  disabled?: boolean;
  /**
   * Accessible-name fragments used to build per-item `aria-label`s so a screen
   * reader can distinguish "Edit project A" from "Edit project B". Required
   * for accessibility — pass a noun like "project", "timeline item", etc.
   */
  itemTypeName: string;
  /**
   * Optional extra button(s) inserted between the ArrowDown and Edit buttons.
   * Used by the Posts section for its Eye/EyeOff publish-toggle.
   */
  extra?: ReactNode;
};

/**
 * The standard up / down / edit / delete action cluster shown on every
 * admin list card. All four buttons share h-9 w-9 p-0 ghost sizing.
 *
 * Pass `extra` to insert additional icon buttons (e.g. publish toggle)
 * between the reorder arrows and the edit button.
 */
export function AdminItemActions({
  onMoveUp,
  onMoveDown,
  onEdit,
  onDelete,
  isFirst,
  isLast,
  disabled,
  itemTypeName,
  extra,
}: AdminItemActionsProps) {
  const labels = {
    moveUp: `Move ${itemTypeName} up`,
    moveDown: `Move ${itemTypeName} down`,
    edit: `Edit ${itemTypeName}`,
    delete: `Delete ${itemTypeName}`,
  };

  return (
    <div className="flex gap-1 shrink-0">
      <Button
        size="sm"
        variant="ghost"
        onClick={onMoveUp}
        disabled={isFirst || disabled}
        aria-label={labels.moveUp}
        title={labels.moveUp}
        className="h-9 w-9 p-0"
      >
        <ArrowUp className="h-4 w-4" aria-hidden="true" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={onMoveDown}
        disabled={isLast || disabled}
        aria-label={labels.moveDown}
        title={labels.moveDown}
        className="h-9 w-9 p-0"
      >
        <ArrowDown className="h-4 w-4" aria-hidden="true" />
      </Button>

      {extra}

      <Button
        size="sm"
        variant="ghost"
        onClick={onEdit}
        disabled={disabled}
        aria-label={labels.edit}
        title={labels.edit}
        className="h-9 w-9 p-0"
      >
        <Edit className="h-4 w-4" aria-hidden="true" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={onDelete}
        disabled={disabled}
        aria-label={labels.delete}
        title={labels.delete}
        className="h-9 w-9 p-0"
      >
        <Trash2 className="h-4 w-4 text-destructive" aria-hidden="true" />
      </Button>
    </div>
  );
}
