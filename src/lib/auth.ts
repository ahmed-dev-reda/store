import "server-only";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { username } from "better-auth/plugins";
import { prisma } from "@/lib/prisma";

const secret = process.env.BETTER_AUTH_SECRET;
const baseURL = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
if (!secret || secret.length < 32) {
  throw new Error("BETTER_AUTH_SECRET must be set to at least 32 characters");
}

export const auth = betterAuth({
  appName: "Store",
  baseURL,
  secret,
  trustedOrigins: [
    baseURL,
    ...(process.env.NODE_ENV === "development"
      ? ["http://localhost:3010", "http://127.0.0.1:3000", "http://127.0.0.1:3010"]
      : []),
  ],
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true },
  plugins: [username()],
});
