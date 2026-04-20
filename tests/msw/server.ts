import { setupServer } from "msw/node";
import { handlers, githubHandlers } from "./handlers";
export const server = setupServer(...handlers, ...githubHandlers);
