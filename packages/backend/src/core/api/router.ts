

import type { paths } from "@projecteer/api/lib/openapi.js";

import type { RouterSecurityDef } from "@projecteer/api/lib/security-def.js";

export type UnionizeObjectFields<obj extends object> = obj[keyof obj];

export type Route = Extract<keyof paths, string>;
export function isRoute(value: string): value is Route {
  return value in router;
}

export type HttpMethod = "get" | "put" | "post" | "delete" | "patch";
export function isHttpMethod(name: string): name is HttpMethod {
  return ["post", "get", "put", "delete", "patch"].includes(name);
}

export type Router = {
  [route in Route]: {
    [method in Extract<keyof paths[route], HttpMethod>]?: paths[route][method] extends never
      ? never
      : (
          params: paths[route][method]["parameters"],
          requestBody: paths[route][method]["requestBody"]["content"]["application/json"] extends never
            ? undefined
            : paths[route][method]["requestBody"]["content"]["application/json"],
          authInfo: RouterSecurityDef[route][method] extends never ? undefined : RouterSecurityDef[route][method],
        ) => Promise<
          UnionizeObjectFields<{
            [responseCode in keyof paths[route][method]["responses"]]: {
              code: responseCode;
              headers?: paths[route][method]["responses"][responseCode] extends { headers: unknown }
                ? paths[route][method]["responses"][responseCode]["headers"]
                : never;
              body: paths[route][method]["responses"][responseCode] extends { content: { "application/json": unknown } }
                ? paths[route][method]["responses"][responseCode]["content"]["application/json"]
                : never;
            };
          }>
        >;
  };
};
export type RequestHandler<route extends Route, method extends keyof Router[route]> = Router[route][method];
export const apiPrefix = "/api";

export const router: Router = {
};
