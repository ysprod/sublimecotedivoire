import {
    API_HEADERS_EXTENDED, DEFAULT_PAGINATION_COUNT, MAX_PAGINATION_COUNT, METHOD_NOT_ALLOWED, METHOD_NOT_ALLOWED_OPTIONS
} from '@/lib/libs/constants';
import { logError, simulateNetworkDelay } from '@/lib/libs/functions';
import { generateMockEtablissements } from '@/lib/libs/mockEtablissements';
import { NextResponse } from 'next/server';

type ApiResponse<T = unknown> = {
    success: boolean;
    data?: T;
    error?: string;
    timestamp: string;
    count?: number;
};

const validateCountParam = (count: number): number => {
    return Math.min(Math.max(1, count), MAX_PAGINATION_COUNT);
};

const createApiResponse = {
    success: <T>(data: T, count?: number): NextResponse => {
        const response: ApiResponse<T> = {
            success: true, data, count, timestamp: new Date().toISOString()
        };

        return NextResponse.json(response, { status: 200, headers: API_HEADERS_EXTENDED });
    },

    error: (error: unknown, customMessage?: string): NextResponse => {
        logError(error);

        const errorMessage = customMessage || "Erreur lors de la récupération des établissements";
        const response: ApiResponse = {
            success: false, error: errorMessage, timestamp: new Date().toISOString()
        };

        return NextResponse.json(response, { status: 500 });
    }
};

export async function GET(request: Request) {
    try {
        if (process.env.NODE_ENV === 'development') {
            await simulateNetworkDelay();
        }

        const { searchParams } = new URL(request.url);
        const rawCount = searchParams.get('nbetablissements');
        const count = validateCountParam(parseInt(rawCount || DEFAULT_PAGINATION_COUNT.toString()));

        const data = generateMockEtablissements(count);

        return createApiResponse.success(data, count);
    } catch (error) {
        return createApiResponse.error(error);
    }
}

const methodNotAllowed = () => NextResponse.json({ error: METHOD_NOT_ALLOWED }, METHOD_NOT_ALLOWED_OPTIONS);

export const POST = methodNotAllowed;
export const PUT = methodNotAllowed;
export const DELETE = methodNotAllowed;
export const PATCH = methodNotAllowed;