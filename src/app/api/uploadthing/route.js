import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Export routes for Next App Router (GET and POST handlers)
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  
});
