import type { paths } from "@stack-builder/api/lib/openapi.js";

import { RouterSecurityDef } from "@stack-builder/api/lib/security-def";
import { HttpMethod } from "./types/httpMethods";

export type UnionizeObjectFields<obj extends object> = obj[keyof obj];

export type Route = Extract<keyof paths, string>;
export function isRoute(value: string): value is Route {
  return value in router;
}

export type Method<route extends Route> = Extract<
  {
    [M in HttpMethod]: paths[route][M] extends never ? never : M;
  }[HttpMethod],
  HttpMethod
>;

export type RequestParams<
  route extends Route,
  method extends Method<route>,
> = paths[route][method]["parameters"];

export type RequestBody<
  route extends Route,
  method extends Method<route>,
> = paths[route][method]["requestBody"]["content"]["application/json"] extends never
  ? null
  : paths[route][method]["requestBody"]["content"]["application/json"];

export type RequestAuthContext<
  route extends Route,
  method extends Method<route>,
> = RouterSecurityDef[route][method] extends never ? null : RouterSecurityDef[route][method];

export type ResponseCodes<
  route extends Route,
  method extends Method<route>,
> = keyof paths[route][method]["responses"];

export type HandlerResponses<
  route extends Route,
  method extends Method<route>,
> = UnionizeObjectFields<{
  [code in ResponseCodes<route, method>]: paths[route][method]["responses"][code] extends {
    content: { "application/json": unknown };
  }
    ? paths[route][method]["responses"][code]["content"]["application/json"]
    : null;
}>;

export type RequestTypeGuard<route extends Route, method extends Method<route>> = (
  value: unknown,
) => value is RequestBody<route, method>;

export type RequestHandler<route extends Route, method extends Method<route>> = (
  params: RequestParams<route, method>,
  body: RequestBody<route, method>,
  authContext: RequestAuthContext<route, method>,
) => HandlerResponses<route, method>;

export type Router = {
  [route in Route]: {
    [method in Method<route>]: {
      handler: RequestHandler<route, method>;
      typeGuard: RequestTypeGuard<route, method>;
    };
  };
};
const router: Router = {};

export type Endpoint<route extends Route, method extends Method<route>> = Router[route][method];
