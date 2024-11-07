import { HttpStatusCodes } from "@projecteer/shared/lib/util/types/apiError";
import { hasValue } from "@projecteer/shared/lib/util/valueCheck";
import { Request, Response, NextFunction } from "express";
import { isString } from "lodash";
import { createApiError } from "../apiError";
import { validateToken } from "../../modules/auth/authUtils";
import { routeSecurityLevel } from "@projecteer/api/lib/security-def";
import { apiPrefix, isHttpMethod, isRoute } from "../router";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const apiRoute = req.url.replace(apiPrefix, "");
  const method = req.method.toLowerCase();
  if (isRoute(apiRoute) && isHttpMethod(method)) {
    if (routeSecurityLevel[apiRoute][method] === "none") {
      next();
    } else {
      const authHeader = req.headers.authorization;

      if (hasValue(authHeader) && isString(authHeader)) {
        const [authType, authValue] = authHeader.split(" ");

        if (authType === "Bearer") {
          const validationResult = validateToken(authValue);
          if (validationResult.isErr()) {
            res
              .status(HttpStatusCodes.UNAUTHORIZED)
              .json(createApiError(HttpStatusCodes.UNAUTHORIZED, "unauthorized/invalid-auth", "862a96e7-4c0e-4ae4-bda6-c416c6ad42b3"));
          } else {
            res.locals.authPayload = validationResult.value;
            next();
          }
        }
      } else {
        res
          .status(HttpStatusCodes.UNAUTHORIZED)
          .json(createApiError(HttpStatusCodes.UNAUTHORIZED, "unauthorized/invalid-auth", "8c4ec6a2-7db9-494d-b65e-a6199598d0e1"));
      }
    }
  } else {
    res
      .status(HttpStatusCodes.NOT_FOUND)
      .json(createApiError(HttpStatusCodes.NOT_FOUND, "not-found/route-does-not-exist", "f21bb431-ca98-4562-8f72-9f79794faa74"));
  }
}
