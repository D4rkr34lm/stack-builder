export type HttpMethod = "post" | "get" | "put" | "delete" | "patch";

export function isHttpMethod(name: string): name is HttpMethod {
  return ["post", "get", "put", "delete", "patch"].includes(name);
}
