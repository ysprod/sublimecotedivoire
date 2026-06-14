import {
    API_HEADERS_EXTENDED, DEFAULT_PAGINATION_COUNT, ERROR_RESPONSE_OPTIONS, MAX_PAGINATION_COUNT,
    METHOD_NOT_ALLOWED
} from '@/libs/constants';
import { logError, simulateNetworkDelay } from '@/libs/functions';
import type { ConnexionHistory } from '@/libs/interface';
import { generateMockUsers } from '@/libs/mockUsers';
import { NextResponse } from 'next/server';

type ApiResponse<T = ConnexionHistory[]> = {
    success: boolean;
    data?: T;
    error?: string;
    timestamp: string;
    metadata?: {
        count: number;
        generatedAt: string;
    };
};

const validateUserCount = (count: number): number => {
    return Math.min(Math.max(1, count), MAX_PAGINATION_COUNT);
};

const createApiResponse = {
    success: <T>(data: T, count: number): NextResponse => {
        const response: ApiResponse<T> = {
            success: true,
            data,
            timestamp: new Date().toISOString(),
            metadata: { count, generatedAt: new Date().toISOString() }
        };

        return NextResponse.json(response, { status: 200, headers: { ...API_HEADERS_EXTENDED } });
    },

    error: (error: unknown, customMessage?: string): NextResponse => {
        logError(error);

        const response: ApiResponse = {
            success: false,
            error: customMessage || "Erreur lors de la récupération des utilisateurs",
            timestamp: new Date().toISOString()
        };

        return NextResponse.json(response, ERROR_RESPONSE_OPTIONS);
    },

    methodNotAllowed: () => NextResponse.json(
        {
            success: false,
            error: METHOD_NOT_ALLOWED,
            timestamp: new Date().toISOString()
        },
        {
            status: 405,
            headers: API_HEADERS_EXTENDED
        }
    )
};

export async function GET(request: Request) {
    try {
        if (process.env.NODE_ENV === 'development') {
            await simulateNetworkDelay();
        }

        const { searchParams } = new URL(request.url);
        const userCount = validateUserCount(
            parseInt(searchParams.get('nbusers') || DEFAULT_PAGINATION_COUNT.toString())
        );

        const mockUsers = generateMockUsers(userCount);
        return createApiResponse.success(mockUsers, userCount);

    } catch (error) {
        return createApiResponse.error(error);
    }
}

export const POST = createApiResponse.methodNotAllowed;
export const PUT = createApiResponse.methodNotAllowed;
export const DELETE = createApiResponse.methodNotAllowed;
export const PATCH = createApiResponse.methodNotAllowed;