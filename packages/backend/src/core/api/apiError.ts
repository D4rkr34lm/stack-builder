import type { ApiErrorCode } from "@projecteer/shared/lib/util/types/apiError";

export function createApiError<ErrorCode extends ApiErrorCode>(code: ErrorCode, message: string, source: string) {
  return {
    code,
    body: {
      code,
      message,
      source,
    },
  };
}
