"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      theme="dark"
      position="bottom-right"
      toastOptions={{
        style: {
          background: "hsl(240 6% 6%)",
          color: "hsl(0 0% 98%)",
          border: "1px solid hsl(240 3.7% 14%)",
          fontSize: "13px",
        },
      }}
    />
  );
}
