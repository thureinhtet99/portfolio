"use client";

import AdminSectionHeader from "@/components/shared/admin-section-header";
import CustomLoading from "@/components/shared/custom-loading";
import DeleteConfirmBox from "@/components/shared/delete-confirm-box";
import EmptyState from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { APP_CONFIG } from "@/config/app-config";
import { useCrudResource } from "@/hooks/use-crud";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import * as z from "zod";
import { SETTINGS_KEYS } from "../constants";

// Talks to the assistant over HTTP only: admin must not import from other features.
type AssistantSettings = {
  apiKeyConfigured: boolean;
  config: { enabled: boolean; dailyUsd: number; monthlyUsd: number };
  usage: { todayUsd: number; monthUsd: number; monthRequests: number };
};

type UnansweredQuestion = {
  id: string;
  question: string;
  page: string | null;
  createdAt: string;
};

const budgetSchema = z.object({
  dailyUsd: z.number().min(0, "Daily budget can't be negative").max(1000),
  monthlyUsd: z.number().min(0, "Monthly budget can't be negative").max(10000),
});

const SETTINGS_QUERY_KEY = ["chat-settings"];

const formatUsd = (value: number) => `$${value.toFixed(value < 0.1 ? 4 : 2)}`;

export default function AssistantSection() {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<{
    enabled?: boolean;
    dailyUsd?: string;
    monthlyUsd?: string;
  }>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);

  const settingsQuery = useQuery<AssistantSettings>({
    queryKey: SETTINGS_QUERY_KEY,
    queryFn: async () => {
      const res = await fetch(`/api/${APP_CONFIG.ROUTE.CHAT_SETTINGS}`);
      const json: {
        success: boolean;
        data?: AssistantSettings;
        error?: string;
      } = await res.json();
      if (!json.success || !json.data) {
        throw new Error(json.error || "Failed to load assistant settings");
      }
      return json.data;
    },
  });

  const {
    items: questions,
    isLoading: questionsLoading,
    remove,
    isMutating,
  } = useCrudResource<UnansweredQuestion>({
    resource: APP_CONFIG.ROUTE.CHAT_QUESTIONS,
    labels: { singular: "question", plural: "questions" },
  });

  const save = useMutation({
    mutationFn: async (values: Record<string, string>) => {
      for (const [key, value] of Object.entries(values)) {
        const res = await fetch(`/api/${APP_CONFIG.ROUTE.SETTINGS}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, value }),
        });
        if (!res.ok) throw new Error("Failed to save assistant settings");
      }
    },
    onSuccess: () => {
      toast.success("Assistant settings saved");
      setDraft({});
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const data = settingsQuery.data;
  const enabled = draft.enabled ?? data?.config.enabled ?? false;
  const dailyUsd = draft.dailyUsd ?? String(data?.config.dailyUsd ?? "");
  const monthlyUsd = draft.monthlyUsd ?? String(data?.config.monthlyUsd ?? "");
  const hasChanges = Object.keys(draft).length > 0;

  const overBudget =
    data !== undefined &&
    (data.usage.todayUsd >= data.config.dailyUsd ||
      data.usage.monthUsd >= data.config.monthlyUsd);

  const handleSave = () => {
    const parsed = budgetSchema.safeParse({
      dailyUsd: Number(dailyUsd),
      monthlyUsd: Number(monthlyUsd),
    });
    if (!parsed.success || dailyUsd.trim() === "" || monthlyUsd.trim() === "") {
      toast.error(
        parsed.success
          ? "Enter both budgets"
          : (parsed.error.issues[0]?.message ?? "Invalid budget"),
      );
      return;
    }

    save.mutate({
      [SETTINGS_KEYS.CHAT_ENABLED]: String(enabled),
      [SETTINGS_KEYS.CHAT_DAILY_BUDGET_USD]: String(parsed.data.dailyUsd),
      [SETTINGS_KEYS.CHAT_MONTHLY_BUDGET_USD]: String(parsed.data.monthlyUsd),
    });
  };

  const handleDelete = async () => {
    if (!questionToDelete) return;
    try {
      await remove(questionToDelete);
      setDeleteDialogOpen(false);
      setQuestionToDelete(null);
    } catch {
      // toast handled by hook
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <AdminSectionHeader title="AI Assistant" />
        <CardContent className="space-y-6">
          {settingsQuery.isLoading ? (
            <CustomLoading />
          ) : settingsQuery.isError || !data ? (
            <p role="alert" className="text-destructive">
              Could not load the assistant settings.
            </p>
          ) : (
            <>
              {!data.apiKeyConfigured && (
                <p className="border border-muted-foreground/20 p-3 text-sm text-muted-foreground">
                  <code>ANTHROPIC_API_KEY</code> is not set on this server, so
                  the assistant stays hidden even when switched on.
                </p>
              )}

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <Label htmlFor="assistant-enabled">Assistant enabled</Label>
                  <p className="text-sm text-muted-foreground">
                    Off is the kill switch: takes effect immediately.
                  </p>
                </div>
                <Switch
                  id="assistant-enabled"
                  checked={enabled}
                  onCheckedChange={(checked) =>
                    setDraft((current) => ({ ...current, enabled: checked }))
                  }
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="assistant-daily">Daily budget (USD)</Label>
                  <Input
                    id="assistant-daily"
                    inputMode="decimal"
                    value={dailyUsd}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        dailyUsd: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assistant-monthly">
                    Monthly budget (USD)
                  </Label>
                  <Input
                    id="assistant-monthly"
                    inputMode="decimal"
                    value={monthlyUsd}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        monthlyUsd: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-1 text-sm">
                <p>
                  Today: {formatUsd(data.usage.todayUsd)} of{" "}
                  {formatUsd(data.config.dailyUsd)}. This month:{" "}
                  {formatUsd(data.usage.monthUsd)} of{" "}
                  {formatUsd(data.config.monthlyUsd)} (
                  {data.usage.monthRequests} requests).
                </p>
                {overBudget && (
                  <p role="status" className="text-destructive">
                    A budget is used up: the assistant is paused for visitors
                    until it resets or you raise it.
                  </p>
                )}
                <p className="text-muted-foreground">
                  Costs are estimates. Also set a spend limit in the Anthropic
                  Console as the real backstop.
                </p>
              </div>

              <Button
                onClick={handleSave}
                disabled={!hasChanges || save.isPending}
              >
                {save.isPending ? "Saving..." : "Save"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <AdminSectionHeader
          title="Unanswered questions"
          count={questions.length}
        />
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Questions visitors asked that the portfolio could not answer, kept
            for 30 days without any personal data. Add the missing content, then
            delete the question.
          </p>
          {questionsLoading ? (
            <CustomLoading />
          ) : questions.length === 0 ? (
            <EmptyState message="No unanswered questions." />
          ) : (
            <ul className="space-y-2">
              {questions.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start justify-between gap-3 border border-muted-foreground/20 p-3"
                >
                  <div className="min-w-0 space-y-1">
                    <p className="break-words">{item.question}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(item.createdAt), "dd.MM.yyyy HH:mm")}
                      {item.page ? ` · from ${item.page}` : ""}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete question: ${item.question}`}
                    onClick={() => {
                      setQuestionToDelete(item.id);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>

        <DeleteConfirmBox
          deleteDialogOpen={deleteDialogOpen}
          setDeleteDialogOpen={setDeleteDialogOpen}
          isLoading={isMutating}
          handleDelete={handleDelete}
          description="Delete this question? This action cannot be undone."
        />
      </Card>
    </div>
  );
}
