import * as elysia_dist_error from 'elysia/dist/error';
import { User, Session } from 'better-auth/types';
import { Context } from 'elysia';

declare const userMiddleware: (c: Context) => Promise<{
    success: string;
    message: string;
    user?: undefined;
    session?: undefined;
} | {
    user: {
        id: string;
        name: string;
        email: string;
        emailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
        image?: string | null | undefined | undefined;
    };
    session: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresAt: Date;
        token: string;
        ipAddress?: string | null | undefined | undefined;
        userAgent?: string | null | undefined | undefined;
    };
    success?: undefined;
    message?: undefined;
}>;
declare const userInfo: (user: User | null, session: Session | null) => {
    user: {
        id: string;
        name: string;
        email: string;
        emailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
        image?: string | null | undefined;
    } | null;
    session: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresAt: Date;
        token: string;
        ipAddress?: string | null | undefined;
        userAgent?: string | null | undefined;
    } | null;
};
declare const organizationMiddleware: ({ request, error }: Context) => Promise<elysia_dist_error.ElysiaCustomStatusResponse<"Unauthorized", "Unauthorized Access: Token is missing", 401> | elysia_dist_error.ElysiaCustomStatusResponse<"Internal Server Error", any, 500> | {
    user: {
        id: string;
        name: string;
        email: string;
        emailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
        image?: string | null | undefined | undefined;
    };
    session: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresAt: Date;
        token: string;
        ipAddress?: string | null | undefined | undefined;
        userAgent?: string | null | undefined | undefined;
    };
    organizer: {
        id: string;
        createdAt: string;
        updatedAt: string;
        deletedAt: string | null;
        organizationId: string;
        userId: string;
        level: "owner" | "admin";
        organizationRole: "other" | "admin" | "teacher" | "hr" | null;
        organization: {
            type: "school" | "company" | "other" | null;
            id: string;
            name: string;
            logoUrl: string | null;
            createdAt: string;
            updatedAt: string;
            deletedAt: string | null;
        };
    };
}>;

export { organizationMiddleware, userInfo, userMiddleware };
