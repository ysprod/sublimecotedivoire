import {
  API_HEADERS, API_INTERNAL_ERROR, ERROR_RESPONSE_OPTIONS, METHOD_NOT_ALLOWED, METHOD_NOT_ALLOWED_OPTIONS, RESPONSE_CACHE_CONTROL,
} from "@/lib/libs/constants";
import { logError, simulateNetworkDelay } from "@/lib/libs/functions";
import { ErrorApiResponse } from "@/lib/libs/interface";
import { NextResponse } from "next/server";
import { departementData, regionsData } from "@/lib/libs/mockdata";

type ApiResponseData = {
  regionsData: typeof regionsData;
  departementData: typeof departementData;
};

type SuccessApiResponse = ApiResponseData & {
  timestamp: string;
  cacheControl?: string;
};

const createApiResponse = {
  success: (data: ApiResponseData, cacheControl = RESPONSE_CACHE_CONTROL): NextResponse => {
    const responseData: SuccessApiResponse = { ...data, timestamp: new Date().toISOString(), };
    return NextResponse.json(responseData, { headers: { ...API_HEADERS, "Cache-Control": cacheControl, }, });
  },

  error: (error: unknown): NextResponse => {
    logError(error);
    const errorData: ErrorApiResponse = {
      error: API_INTERNAL_ERROR, details: error instanceof Error ? error.message : undefined,
    };

    return NextResponse.json(errorData, ERROR_RESPONSE_OPTIONS);
  },

  methodNotAllowed: (): NextResponse =>
    NextResponse.json({ error: METHOD_NOT_ALLOWED }, METHOD_NOT_ALLOWED_OPTIONS),
};

export async function GET() {
  try {
    if (process.env.NODE_ENV === "development") { await simulateNetworkDelay(); }
    return createApiResponse.success({ regionsData, departementData });
  } catch (error) {
    return createApiResponse.error(error);
  }
}

export const POST = createApiResponse.methodNotAllowed;
export const PUT = createApiResponse.methodNotAllowed;
export const DELETE = createApiResponse.methodNotAllowed;
export const PATCH = createApiResponse.methodNotAllowed;