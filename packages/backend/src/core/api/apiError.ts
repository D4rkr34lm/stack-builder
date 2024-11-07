import { logger } from "../logger/logger";
import { HttpStatusCode } from "./types/httpStatusCodes";

export function createApiError(
  code: HttpStatusCode,
  source: string,
  msg: string,
  additionalData?: { [key: string]: unknown },
) {
  logger.warn(additionalData, `${msg} | returned at ${source}`);

  return {
    code,
    source,
    msg,
  };
}
