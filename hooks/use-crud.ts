"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Matches the { success, data } / { success, error } shape returned by every
 * route in app/api/* (see certificate-section.tsx, project-section.tsx, etc.
 * for the hand-written version this hook replaces).
 */
type ApiListResponse<T> = { success: boolean; data?: T[]; error?: string };
type ApiItemResponse<T> = { success: boolean; data?: T; error?: string };

type UseCrudResourceOptions = {
  /** e.g. APP_CONFIG.ROUTE.CERTIFICATES -> fetched at /api/{resource} */
  resource: string;
  /** used only for toast copy, e.g. { singular: "certificate", plural: "certificates" } */
  labels: { singular: string; plural: string };
};

export function useCrudResource<T extends { id: string }>({
  resource,
  labels,
}: UseCrudResourceOptions) {
  const queryClient = useQueryClient();
  const queryKey = ["resource", resource];
  const endpoint = `/api/${resource}`;

  const listQuery = useQuery({
    queryKey,
    queryFn: async (): Promise<T[]> => {
      const res = await fetch(endpoint);
      const json: ApiListResponse<T> = await res.json();
      if (!json.success) {
        throw new Error(json.error || `Failed to load ${labels.plural}`);
      }
      return json.data ?? [];
    },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const createMutation = useMutation({
    mutationFn: async (payload: Partial<T>) => {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json: ApiItemResponse<T> = await res.json();
      if (!json.success) {
        throw new Error(json.error || `Failed to add ${labels.singular}`);
      }
      return json.data as T;
    },
    onSuccess: () => {
      invalidate();
      toast.success(`${capitalize(labels.singular)} added successfully!`);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: Partial<T> & { id: string }) => {
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json: ApiItemResponse<T> = await res.json();
      if (!json.success) {
        throw new Error(json.error || `Failed to update ${labels.singular}`);
      }
      return json.data as T;
    },
    onSuccess: () => {
      invalidate();
      toast.success(`${capitalize(labels.singular)} updated successfully!`);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${endpoint}?id=${id}`, { method: "DELETE" });
      const json: ApiItemResponse<T> = await res.json();
      if (!json.success) {
        throw new Error(json.error || `Failed to delete ${labels.singular}`);
      }
      return id;
    },
    onSuccess: () => {
      invalidate();
      toast.success(`${capitalize(labels.singular)} deleted successfully!`);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return {
    items: listQuery.data ?? [],
    isLoading: listQuery.isLoading,
    isError: listQuery.isError,
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
    isMutating:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  };
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/*
 * NOTE on API routes: this hook matches the existing convention seen in
 * app/api/certificates/route.ts — POST to create, PUT to update a full
 * record, DELETE with an ?id= query param. PATCH on these routes is
 * reserved for reordering and is intentionally NOT used here; add a
 * separate `reorder` mutation per-resource if a section needs drag
 * reordering (see certificate-section.tsx's existing PATCH calls).
 * If a resource route ever changes this convention, update its
 * mutationFn above to match — don't change the route just to fit the hook.
 */
