"use client";

import { Construction } from "lucide-react";

export function LabsView() {
  return (
    <div className="page-shell">
      <section className="px-6 py-16 sm:py-20 min-h-[80vh] flex items-center justify-center">
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="flex justify-center">
            <Construction className="h-12 w-12" />
          </div>
          <p className="text-sm text-center leading-relaxed">
            This page is coming soon. Check back later.
          </p>
        </div>
      </section>
    </div>
  );
}
