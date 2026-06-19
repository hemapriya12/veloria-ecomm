// Auth middleware now lives in the shared @repo/middleware package.
// This file re-exports from there to avoid breaking existing imports.
export { shouldBeUser, shouldBeAdmin } from "@repo/middleware";
