import { forEach } from "lodash";
import { isHttpMethod, isRoute, router, Router } from "./router";
import type { Express } from "express";
import express from "express";
import cors from "cors";
import expressAsyncHandler from "express-async-handler";
import { loggerMiddleware } from "./middleware/logger";
import { authMiddleware } from "./middleware/auth";
import { routeSecurityLevel } from "@projecteer/api/lib/security-def";

function addRouterToExpress(app: Express, router: Router) {
  forEach(router, (routeHandler, route) => {
    forEach(routeHandler, (routeMethodHandler, method) => {
      if (!isHttpMethod(method) || !isRoute(route)) {
        throw "Something went wrong (83d3f9da-d929-47fa-9b86-db250e7dd778)";
      }

      const apiRoute = `/api${route}`;
      console.log(`Mounting endpoint on ${apiRoute} for ${method}`);

      app[method](
        apiRoute,
        expressAsyncHandler(async (request, response) => {
          const params = request.params;
          const requestBody = request.body;
          const authInfo =
            routeSecurityLevel[route][method] !== "none"
              ? {
                  ...response.locals.authPayload,
                }
              : undefined;

          const handlerResult = await routeMethodHandler(params, requestBody, authInfo as undefined);

          response
            .status(handlerResult.code)
            .set(handlerResult.headers ?? {})
            .json(handlerResult.body);
        }),
      );
    });
  });
}

export function initAPI() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(loggerMiddleware);
  app.use(authMiddleware);

  addRouterToExpress(app, router);
  app.listen(8020);
  console.log("Finished API init");
}