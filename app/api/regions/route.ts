import {
    API_HEADERS_EXTENDED, API_INTERNAL_ERROR, ERROR_RESPONSE_OPTIONS, METHOD_NOT_ALLOWED, METHOD_NOT_ALLOWED_OPTIONS
} from '@/lib/libs/constants';
import { logError, simulateNetworkDelay } from '@/lib/libs/functions';
import { regionsCoteIvoireMock } from '@/lib/libs/mockdata';
import { NextResponse } from 'next/server';

type ApiResponse<T = typeof regionsCoteIvoireMock> = {
    success: boolean;
    data: T;
    timestamp: string;
    metadata?: {
        count?: number;
        source?: string;
    };
};

const createApiResponse = {
    success: <T>(data: T): NextResponse => {
        const response: ApiResponse<T> = {
            success: true,
            data,
            timestamp: new Date().toISOString(),
            metadata: {
                count: Array.isArray(data) ? data.length : undefined,
                source: 'mock-data'
            }
        };

        return NextResponse.json(response, { headers: { ...API_HEADERS_EXTENDED } });
    },

    error: (error: unknown): NextResponse => {
        logError(error);
        return NextResponse.json(
            {
                success: false, error: API_INTERNAL_ERROR, timestamp: new Date().toISOString()
            }, ERROR_RESPONSE_OPTIONS
        );
    }
};

export async function GET() {
    try {
        if (process.env.NODE_ENV === 'development') {
            await simulateNetworkDelay();
        }
        return createApiResponse.success(regionsCoteIvoireMock);
    } catch (error) {
        return createApiResponse.error(error);
    }
}

const createMethodNotAllowedResponse = () =>
    NextResponse.json(
        { success: false, error: METHOD_NOT_ALLOWED, timestamp: new Date().toISOString() }, METHOD_NOT_ALLOWED_OPTIONS
    );

export const POST = createMethodNotAllowedResponse;
export const PUT = createMethodNotAllowedResponse;
export const DELETE = createMethodNotAllowedResponse;
export const PATCH = createMethodNotAllowedResponse;