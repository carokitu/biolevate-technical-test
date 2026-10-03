"use client";

import { Failure } from "@/components/failure/view";

export default function Error() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-page px-4 py-page">
      <Failure />
    </main>
  );
}
