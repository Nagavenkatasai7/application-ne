"use client";

import { useEffect } from "react";
import { useSidebar } from "@resume-maker/ui";

/**
 * Component that syncs sidebar state to a cookie for SSR persistence
 */
export function SidebarCookieSync() {
  const { open } = useSidebar();

  useEffect(() => {
    // Set cookie when sidebar state changes
    document.cookie = `sidebar_state=${open}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  }, [open]);

  return null;
}
