import "server-only";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { StoreHeaderClient } from "./store-header-client";

type StoreSession = {
  user: {
    id: string;
  };
} | null;

async function getSession(): Promise<StoreSession> {
  const session = await auth.api.getSession({ headers: await headers() });
  return session ? { user: { id: session.user.id } } : null;
}

export async function StoreHeader() {
  const session = await getSession();
  return <StoreHeaderClient session={session} />;
}
