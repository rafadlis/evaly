import * as better_auth_adapters_drizzle from 'better-auth/adapters/drizzle';
import * as better_auth from 'better-auth';

declare const auth: {
    handler: (request: Request) => Promise<Response>;
    api: better_auth.InferAPI<{
        ok: {
            <C extends [({
                body?: undefined;
                method?: "GET" | undefined;
                query?: Record<string, any> | undefined;
                params?: Record<string, any> | undefined;
                request?: Request | undefined;
                headers?: HeadersInit | undefined;
                asResponse?: boolean | undefined;
                returnHeaders?: boolean | undefined;
                use?: better_auth.Middleware[] | undefined;
                path?: string | undefined;
            } | undefined)?]>(...inputCtx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : C extends [{
                returnHeaders: true;
            }] ? {
                headers: Headers;
                response: {
                    ok: boolean;
                };
            } : {
                ok: boolean;
            }>;
            options: {
                method: "GET";
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                ok: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    isAction: false;
                };
            } & {
                use: any[];
            };
            path: "/ok";
        };
        error: {
            <C extends [({
                body?: undefined;
                method?: "GET" | undefined;
                query?: Record<string, any> | undefined;
                params?: Record<string, any> | undefined;
                request?: Request | undefined;
                headers?: HeadersInit | undefined;
                asResponse?: boolean | undefined;
                returnHeaders?: boolean | undefined;
                use?: better_auth.Middleware[] | undefined;
                path?: string | undefined;
            } | undefined)?]>(...inputCtx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : C extends [{
                returnHeaders: true;
            }] ? {
                headers: Headers;
                response: Response;
            } : Response>;
            options: {
                method: "GET";
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "text/html": {
                                        schema: {
                                            type: "string";
                                        };
                                    };
                                };
                            };
                        };
                    };
                    isAction: false;
                };
            } & {
                use: any[];
            };
            path: "/error";
        };
        signInSocial: {
            <C extends [{
                body: {
                    provider: "apple" | "discord" | "facebook" | "github" | "google" | "microsoft" | "spotify" | "twitch" | "twitter" | "dropbox" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "vk";
                    scopes?: string[] | undefined;
                    idToken?: {
                        token: string;
                        accessToken?: string | undefined;
                        refreshToken?: string | undefined;
                        expiresAt?: number | undefined;
                        nonce?: string | undefined;
                    } | undefined;
                    callbackURL?: string | undefined;
                    requestSignUp?: boolean | undefined;
                    errorCallbackURL?: string | undefined;
                    newUserCallbackURL?: string | undefined;
                    disableRedirect?: boolean | undefined;
                };
                method?: "POST" | undefined;
                query?: Record<string, any> | undefined;
                params?: Record<string, any> | undefined;
                request?: Request | undefined;
                headers?: HeadersInit | undefined;
                asResponse?: boolean | undefined;
                returnHeaders?: boolean | undefined;
                use?: better_auth.Middleware[] | undefined;
                path?: string | undefined;
            }]>(...inputCtx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : C extends [{
                returnHeaders: true;
            }] ? {
                headers: Headers;
                response: {
                    redirect: boolean;
                    token: string;
                    url: undefined;
                    user: {
                        id: string;
                        email: string;
                        name: string;
                        image: string | null | undefined;
                        emailVerified: boolean;
                        createdAt: Date;
                        updatedAt: Date;
                    };
                } | {
                    url: string;
                    redirect: boolean;
                };
            } : {
                redirect: boolean;
                token: string;
                url: undefined;
                user: {
                    id: string;
                    email: string;
                    name: string;
                    image: string | null | undefined;
                    emailVerified: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } | {
                url: string;
                redirect: boolean;
            }>;
            options: {
                method: "POST";
                body: better_auth.ZodObject<{
                    callbackURL: better_auth.ZodOptional<better_auth.ZodString>;
                    newUserCallbackURL: better_auth.ZodOptional<better_auth.ZodString>;
                    errorCallbackURL: better_auth.ZodOptional<better_auth.ZodString>;
                    provider: better_auth.ZodEnum<["github", ...("apple" | "discord" | "facebook" | "github" | "google" | "microsoft" | "spotify" | "twitch" | "twitter" | "dropbox" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "vk")[]]>;
                    disableRedirect: better_auth.ZodOptional<better_auth.ZodBoolean>;
                    idToken: better_auth.ZodOptional<better_auth.ZodObject<{
                        token: better_auth.ZodString;
                        nonce: better_auth.ZodOptional<better_auth.ZodString>;
                        accessToken: better_auth.ZodOptional<better_auth.ZodString>;
                        refreshToken: better_auth.ZodOptional<better_auth.ZodString>;
                        expiresAt: better_auth.ZodOptional<better_auth.ZodNumber>;
                    }, "strip", better_auth.ZodTypeAny, {
                        token: string;
                        accessToken?: string | undefined;
                        refreshToken?: string | undefined;
                        expiresAt?: number | undefined;
                        nonce?: string | undefined;
                    }, {
                        token: string;
                        accessToken?: string | undefined;
                        refreshToken?: string | undefined;
                        expiresAt?: number | undefined;
                        nonce?: string | undefined;
                    }>>;
                    scopes: better_auth.ZodOptional<better_auth.ZodArray<better_auth.ZodString, "many">>;
                    requestSignUp: better_auth.ZodOptional<better_auth.ZodBoolean>;
                }, "strip", better_auth.ZodTypeAny, {
                    provider: "apple" | "discord" | "facebook" | "github" | "google" | "microsoft" | "spotify" | "twitch" | "twitter" | "dropbox" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "vk";
                    scopes?: string[] | undefined;
                    idToken?: {
                        token: string;
                        accessToken?: string | undefined;
                        refreshToken?: string | undefined;
                        expiresAt?: number | undefined;
                        nonce?: string | undefined;
                    } | undefined;
                    callbackURL?: string | undefined;
                    requestSignUp?: boolean | undefined;
                    errorCallbackURL?: string | undefined;
                    newUserCallbackURL?: string | undefined;
                    disableRedirect?: boolean | undefined;
                }, {
                    provider: "apple" | "discord" | "facebook" | "github" | "google" | "microsoft" | "spotify" | "twitch" | "twitter" | "dropbox" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "vk";
                    scopes?: string[] | undefined;
                    idToken?: {
                        token: string;
                        accessToken?: string | undefined;
                        refreshToken?: string | undefined;
                        expiresAt?: number | undefined;
                        nonce?: string | undefined;
                    } | undefined;
                    callbackURL?: string | undefined;
                    requestSignUp?: boolean | undefined;
                    errorCallbackURL?: string | undefined;
                    newUserCallbackURL?: string | undefined;
                    disableRedirect?: boolean | undefined;
                }>;
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                session: {
                                                    type: string;
                                                };
                                                user: {
                                                    type: string;
                                                };
                                                url: {
                                                    type: string;
                                                };
                                                redirect: {
                                                    type: string;
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/sign-in/social";
        };
        callbackOAuth: {
            <C extends [{
                method: "GET" | "POST";
                params: {
                    id: string;
                };
                body?: {
                    state?: string | undefined;
                    code?: string | undefined;
                    device_id?: string | undefined;
                    error?: string | undefined;
                    error_description?: string | undefined;
                } | undefined;
                query?: {
                    state?: string | undefined;
                    code?: string | undefined;
                    device_id?: string | undefined;
                    error?: string | undefined;
                    error_description?: string | undefined;
                } | undefined;
                request?: Request | undefined;
                headers?: HeadersInit | undefined;
                asResponse?: boolean | undefined;
                returnHeaders?: boolean | undefined;
                use?: better_auth.Middleware[] | undefined;
                path?: string | undefined;
            }]>(...inputCtx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : C extends [{
                returnHeaders: true;
            }] ? {
                headers: Headers;
                response: void;
            } : void>;
            options: {
                method: ("GET" | "POST")[];
                body: better_auth.ZodOptional<better_auth.ZodObject<{
                    code: better_auth.ZodOptional<better_auth.ZodString>;
                    error: better_auth.ZodOptional<better_auth.ZodString>;
                    device_id: better_auth.ZodOptional<better_auth.ZodString>;
                    error_description: better_auth.ZodOptional<better_auth.ZodString>;
                    state: better_auth.ZodOptional<better_auth.ZodString>;
                }, "strip", better_auth.ZodTypeAny, {
                    state?: string | undefined;
                    code?: string | undefined;
                    device_id?: string | undefined;
                    error?: string | undefined;
                    error_description?: string | undefined;
                }, {
                    state?: string | undefined;
                    code?: string | undefined;
                    device_id?: string | undefined;
                    error?: string | undefined;
                    error_description?: string | undefined;
                }>>;
                query: better_auth.ZodOptional<better_auth.ZodObject<{
                    code: better_auth.ZodOptional<better_auth.ZodString>;
                    error: better_auth.ZodOptional<better_auth.ZodString>;
                    device_id: better_auth.ZodOptional<better_auth.ZodString>;
                    error_description: better_auth.ZodOptional<better_auth.ZodString>;
                    state: better_auth.ZodOptional<better_auth.ZodString>;
                }, "strip", better_auth.ZodTypeAny, {
                    state?: string | undefined;
                    code?: string | undefined;
                    device_id?: string | undefined;
                    error?: string | undefined;
                    error_description?: string | undefined;
                }, {
                    state?: string | undefined;
                    code?: string | undefined;
                    device_id?: string | undefined;
                    error?: string | undefined;
                    error_description?: string | undefined;
                }>>;
                metadata: {
                    isAction: false;
                };
            } & {
                use: any[];
            };
            path: "/callback/:id";
        };
        getSession: {
            <C extends [{
                headers: HeadersInit;
                body?: undefined;
                method?: "GET" | undefined;
                query?: {
                    disableCookieCache?: string | boolean | undefined;
                    disableRefresh?: string | boolean | undefined;
                } | undefined;
                params?: Record<string, any> | undefined;
                request?: Request | undefined;
                asResponse?: boolean | undefined;
                returnHeaders?: boolean | undefined;
                use?: better_auth.Middleware[] | undefined;
                path?: string | undefined;
            }]>(...inputCtx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : C extends [{
                returnHeaders: true;
            }] ? {
                headers: Headers;
                response: {
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
                    user: {
                        id: string;
                        name: string;
                        email: string;
                        emailVerified: boolean;
                        createdAt: Date;
                        updatedAt: Date;
                        image?: string | null | undefined | undefined;
                    };
                } | null;
            } : {
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
                user: {
                    id: string;
                    name: string;
                    email: string;
                    emailVerified: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    image?: string | null | undefined | undefined;
                };
            } | null>;
            options: {
                method: "GET";
                query: better_auth.ZodOptional<better_auth.ZodObject<{
                    disableCookieCache: better_auth.ZodOptional<better_auth.ZodOptional<better_auth.ZodUnion<[better_auth.ZodBoolean, better_auth.ZodEffects<better_auth.ZodString, boolean, string>]>>>;
                    disableRefresh: better_auth.ZodOptional<better_auth.ZodUnion<[better_auth.ZodBoolean, better_auth.ZodEffects<better_auth.ZodString, boolean, string>]>>;
                }, "strip", better_auth.ZodTypeAny, {
                    disableCookieCache?: boolean | undefined;
                    disableRefresh?: boolean | undefined;
                }, {
                    disableCookieCache?: string | boolean | undefined;
                    disableRefresh?: string | boolean | undefined;
                }>>;
                requireHeaders: true;
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                session: {
                                                    type: string;
                                                    properties: {
                                                        token: {
                                                            type: string;
                                                        };
                                                        userId: {
                                                            type: string;
                                                        };
                                                        expiresAt: {
                                                            type: string;
                                                        };
                                                    };
                                                };
                                                user: {
                                                    type: string;
                                                    $ref: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/get-session";
        };
        signOut: {
            <C extends [{
                headers: HeadersInit;
                body?: undefined;
                method?: "POST" | undefined;
                query?: Record<string, any> | undefined;
                params?: Record<string, any> | undefined;
                request?: Request | undefined;
                asResponse?: boolean | undefined;
                returnHeaders?: boolean | undefined;
                use?: better_auth.Middleware[] | undefined;
                path?: string | undefined;
            }]>(...inputCtx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : C extends [{
                returnHeaders: true;
            }] ? {
                headers: Headers;
                response: {
                    success: boolean;
                };
            } : {
                success: boolean;
            }>;
            options: {
                method: "POST";
                requireHeaders: true;
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                success: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/sign-out";
        };
        signUpEmail: {
            <C extends [{
                body: {
                    name: string;
                    email: string;
                    password: string;
                };
                method?: "POST" | undefined;
                query?: Record<string, any> | undefined;
                params?: Record<string, any> | undefined;
                request?: Request | undefined;
                headers?: HeadersInit | undefined;
                asResponse?: boolean | undefined;
                returnHeaders?: boolean | undefined;
                use?: better_auth.Middleware[] | undefined;
                path?: string | undefined;
            }]>(...inputCtx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : C extends [{
                returnHeaders: true;
            }] ? {
                headers: Headers;
                response: {
                    token: null;
                    user: {
                        id: string;
                        email: string;
                        name: string;
                        image: string | null | undefined;
                        emailVerified: boolean;
                        createdAt: Date;
                        updatedAt: Date;
                    };
                } | {
                    token: string;
                    user: {
                        id: string;
                        email: string;
                        name: string;
                        image: string | null | undefined;
                        emailVerified: boolean;
                        createdAt: Date;
                        updatedAt: Date;
                    };
                };
            } : {
                token: null;
                user: {
                    id: string;
                    email: string;
                    name: string;
                    image: string | null | undefined;
                    emailVerified: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } | {
                token: string;
                user: {
                    id: string;
                    email: string;
                    name: string;
                    image: string | null | undefined;
                    emailVerified: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                };
            }>;
            options: {
                method: "POST";
                body: better_auth.ZodRecord<better_auth.ZodString, better_auth.ZodAny>;
                metadata: {
                    $Infer: {
                        body: {
                            name: string;
                            email: string;
                            password: string;
                        };
                    };
                    openapi: {
                        description: string;
                        requestBody: {
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            name: {
                                                type: string;
                                                description: string;
                                            };
                                            email: {
                                                type: string;
                                                description: string;
                                            };
                                            password: {
                                                type: string;
                                                description: string;
                                            };
                                            callbackURL: {
                                                type: string;
                                                description: string;
                                            };
                                        };
                                        required: string[];
                                    };
                                };
                            };
                        };
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                id: {
                                                    type: string;
                                                    description: string;
                                                };
                                                email: {
                                                    type: string;
                                                    description: string;
                                                };
                                                name: {
                                                    type: string;
                                                    description: string;
                                                };
                                                image: {
                                                    type: string;
                                                    description: string;
                                                };
                                                emailVerified: {
                                                    type: string;
                                                    description: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/sign-up/email";
        };
        signInEmail: {
            <C extends [{
                body: {
                    password: string;
                    email: string;
                    callbackURL?: string | undefined;
                    rememberMe?: boolean | undefined;
                };
                method?: "POST" | undefined;
                query?: Record<string, any> | undefined;
                params?: Record<string, any> | undefined;
                request?: Request | undefined;
                headers?: HeadersInit | undefined;
                asResponse?: boolean | undefined;
                returnHeaders?: boolean | undefined;
                use?: better_auth.Middleware[] | undefined;
                path?: string | undefined;
            }]>(...inputCtx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : C extends [{
                returnHeaders: true;
            }] ? {
                headers: Headers;
                response: {
                    redirect: boolean;
                    token: string;
                    url: string | undefined;
                    user: {
                        id: string;
                        email: string;
                        name: string;
                        image: string | null | undefined;
                        emailVerified: boolean;
                        createdAt: Date;
                        updatedAt: Date;
                    };
                };
            } : {
                redirect: boolean;
                token: string;
                url: string | undefined;
                user: {
                    id: string;
                    email: string;
                    name: string;
                    image: string | null | undefined;
                    emailVerified: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                };
            }>;
            options: {
                method: "POST";
                body: better_auth.ZodObject<{
                    email: better_auth.ZodString;
                    password: better_auth.ZodString;
                    callbackURL: better_auth.ZodOptional<better_auth.ZodString>;
                    rememberMe: better_auth.ZodOptional<better_auth.ZodDefault<better_auth.ZodBoolean>>;
                }, "strip", better_auth.ZodTypeAny, {
                    password: string;
                    email: string;
                    callbackURL?: string | undefined;
                    rememberMe?: boolean | undefined;
                }, {
                    password: string;
                    email: string;
                    callbackURL?: string | undefined;
                    rememberMe?: boolean | undefined;
                }>;
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                user: {
                                                    type: string;
                                                };
                                                url: {
                                                    type: string;
                                                };
                                                redirect: {
                                                    type: string;
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/sign-in/email";
        };
        forgetPassword: {
            <C extends [{
                body: {
                    email: string;
                    redirectTo?: string | undefined;
                };
                method?: "POST" | undefined;
                query?: Record<string, any> | undefined;
                params?: Record<string, any> | undefined;
                request?: Request | undefined;
                headers?: HeadersInit | undefined;
                asResponse?: boolean | undefined;
                returnHeaders?: boolean | undefined;
                use?: better_auth.Middleware[] | undefined;
                path?: string | undefined;
            }]>(...inputCtx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : C extends [{
                returnHeaders: true;
            }] ? {
                headers: Headers;
                response: {
                    status: boolean;
                };
            } : {
                status: boolean;
            }>;
            options: {
                method: "POST";
                body: better_auth.ZodObject<{
                    email: better_auth.ZodString;
                    redirectTo: better_auth.ZodOptional<better_auth.ZodString>;
                }, "strip", better_auth.ZodTypeAny, {
                    email: string;
                    redirectTo?: string | undefined;
                }, {
                    email: string;
                    redirectTo?: string | undefined;
                }>;
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                status: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/forget-password";
        };
        resetPassword: {
            <C extends [{
                body: {
                    newPassword: string;
                    token?: string | undefined;
                };
                method?: "POST" | undefined;
                query?: {
                    token?: string | undefined;
                } | undefined;
                params?: Record<string, any> | undefined;
                request?: Request | undefined;
                headers?: HeadersInit | undefined;
                asResponse?: boolean | undefined;
                returnHeaders?: boolean | undefined;
                use?: better_auth.Middleware[] | undefined;
                path?: string | undefined;
            }]>(...inputCtx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : C extends [{
                returnHeaders: true;
            }] ? {
                headers: Headers;
                response: {
                    status: boolean;
                };
            } : {
                status: boolean;
            }>;
            options: {
                method: "POST";
                query: better_auth.ZodOptional<better_auth.ZodObject<{
                    token: better_auth.ZodOptional<better_auth.ZodString>;
                }, "strip", better_auth.ZodTypeAny, {
                    token?: string | undefined;
                }, {
                    token?: string | undefined;
                }>>;
                body: better_auth.ZodObject<{
                    newPassword: better_auth.ZodString;
                    token: better_auth.ZodOptional<better_auth.ZodString>;
                }, "strip", better_auth.ZodTypeAny, {
                    newPassword: string;
                    token?: string | undefined;
                }, {
                    newPassword: string;
                    token?: string | undefined;
                }>;
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                status: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/reset-password";
        };
        verifyEmail: {
            <C extends [{
                query: {
                    token: string;
                    callbackURL?: string | undefined;
                };
                body?: undefined;
                method?: "GET" | undefined;
                params?: Record<string, any> | undefined;
                request?: Request | undefined;
                headers?: HeadersInit | undefined;
                asResponse?: boolean | undefined;
                returnHeaders?: boolean | undefined;
                use?: better_auth.Middleware[] | undefined;
                path?: string | undefined;
            }]>(...inputCtx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : C extends [{
                returnHeaders: true;
            }] ? {
                headers: Headers;
                response: void | {
                    status: boolean;
                    user: {
                        id: any;
                        email: any;
                        name: any;
                        image: any;
                        emailVerified: any;
                        createdAt: any;
                        updatedAt: any;
                    };
                } | {
                    status: boolean;
                    user: null;
                };
            } : void | {
                status: boolean;
                user: {
                    id: any;
                    email: any;
                    name: any;
                    image: any;
                    emailVerified: any;
                    createdAt: any;
                    updatedAt: any;
                };
            } | {
                status: boolean;
                user: null;
            }>;
            options: {
                method: "GET";
                query: better_auth.ZodObject<{
                    token: better_auth.ZodString;
                    callbackURL: better_auth.ZodOptional<better_auth.ZodString>;
                }, "strip", better_auth.ZodTypeAny, {
                    token: string;
                    callbackURL?: string | undefined;
                }, {
                    token: string;
                    callbackURL?: string | undefined;
                }>;
                use: ((inputContext: {
                    body?: any;
                    query?: Record<string, any> | undefined;
                    request?: Request | undefined;
                    headers?: Headers | undefined;
                    asResponse?: boolean | undefined;
                    returnHeaders?: boolean | undefined;
                    use?: better_auth.Middleware[] | undefined;
                }) => Promise<void>)[];
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                user: {
                                                    type: string;
                                                };
                                                status: {
                                                    type: string;
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/verify-email";
        };
        sendVerificationEmail: {
            <C extends [{
                body: {
                    email: string;
                    callbackURL?: string | undefined;
                };
                method?: "POST" | undefined;
                query?: Record<string, any> | undefined;
                params?: Record<string, any> | undefined;
                request?: Request | undefined;
                headers?: HeadersInit | undefined;
                asResponse?: boolean | undefined;
                returnHeaders?: boolean | undefined;
                use?: better_auth.Middleware[] | undefined;
                path?: string | undefined;
            }]>(...inputCtx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : C extends [{
                returnHeaders: true;
            }] ? {
                headers: Headers;
                response: {
                    status: boolean;
                };
            } : {
                status: boolean;
            }>;
            options: {
                method: "POST";
                body: better_auth.ZodObject<{
                    email: better_auth.ZodString;
                    callbackURL: better_auth.ZodOptional<better_auth.ZodString>;
                }, "strip", better_auth.ZodTypeAny, {
                    email: string;
                    callbackURL?: string | undefined;
                }, {
                    email: string;
                    callbackURL?: string | undefined;
                }>;
                metadata: {
                    openapi: {
                        description: string;
                        requestBody: {
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            email: {
                                                type: string;
                                                description: string;
                                            };
                                            callbackURL: {
                                                type: string;
                                                description: string;
                                            };
                                        };
                                        required: string[];
                                    };
                                };
                            };
                        };
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                status: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/send-verification-email";
        };
        changeEmail: {
            <C extends [{
                body: {
                    newEmail: string;
                    callbackURL?: string | undefined;
                };
                method?: "POST" | undefined;
                query?: Record<string, any> | undefined;
                params?: Record<string, any> | undefined;
                request?: Request | undefined;
                headers?: HeadersInit | undefined;
                asResponse?: boolean | undefined;
                returnHeaders?: boolean | undefined;
                use?: better_auth.Middleware[] | undefined;
                path?: string | undefined;
            }]>(...inputCtx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : C extends [{
                returnHeaders: true;
            }] ? {
                headers: Headers;
                response: {
                    status: boolean;
                };
            } : {
                status: boolean;
            }>;
            options: {
                method: "POST";
                body: better_auth.ZodObject<{
                    newEmail: better_auth.ZodString;
                    callbackURL: better_auth.ZodOptional<better_auth.ZodString>;
                }, "strip", better_auth.ZodTypeAny, {
                    newEmail: string;
                    callbackURL?: string | undefined;
                }, {
                    newEmail: string;
                    callbackURL?: string | undefined;
                }>;
                use: ((inputContext: {
                    body?: any;
                    query?: Record<string, any> | undefined;
                    request?: Request | undefined;
                    headers?: Headers | undefined;
                    asResponse?: boolean | undefined;
                    returnHeaders?: boolean | undefined;
                    use?: better_auth.Middleware[] | undefined;
                }) => Promise<{
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            name: string;
                            email: string;
                            emailVerified: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>)[];
                metadata: {
                    openapi: {
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                user: {
                                                    type: string;
                                                };
                                                status: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/change-email";
        };
        changePassword: {
            <C extends [{
                body: {
                    newPassword: string;
                    currentPassword: string;
                    revokeOtherSessions?: boolean | undefined;
                };
                method?: "POST" | undefined;
                query?: Record<string, any> | undefined;
                params?: Record<string, any> | undefined;
                request?: Request | undefined;
                headers?: HeadersInit | undefined;
                asResponse?: boolean | undefined;
                returnHeaders?: boolean | undefined;
                use?: better_auth.Middleware[] | undefined;
                path?: string | undefined;
            }]>(...inputCtx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : C extends [{
                returnHeaders: true;
            }] ? {
                headers: Headers;
                response: {
                    token: string | null;
                    user: {
                        id: string;
                        email: string;
                        name: string;
                        image: string | null | undefined;
                        emailVerified: boolean;
                        createdAt: Date;
                        updatedAt: Date;
                    };
                };
            } : {
                token: string | null;
                user: {
                    id: string;
                    email: string;
                    name: string;
                    image: string | null | undefined;
                    emailVerified: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                };
            }>;
            options: {
                method: "POST";
                body: better_auth.ZodObject<{
                    newPassword: better_auth.ZodString;
                    currentPassword: better_auth.ZodString;
                    revokeOtherSessions: better_auth.ZodOptional<better_auth.ZodBoolean>;
                }, "strip", better_auth.ZodTypeAny, {
                    newPassword: string;
                    currentPassword: string;
                    revokeOtherSessions?: boolean | undefined;
                }, {
                    newPassword: string;
                    currentPassword: string;
                    revokeOtherSessions?: boolean | undefined;
                }>;
                use: ((inputContext: {
                    body?: any;
                    query?: Record<string, any> | undefined;
                    request?: Request | undefined;
                    headers?: Headers | undefined;
                    asResponse?: boolean | undefined;
                    returnHeaders?: boolean | undefined;
                    use?: better_auth.Middleware[] | undefined;
                }) => Promise<{
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            name: string;
                            email: string;
                            emailVerified: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>)[];
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                user: {
                                                    description: string;
                                                    $ref: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/change-password";
        };
        setPassword: {
            <C extends [{
                body: {
                    newPassword: string;
                };
                method?: "POST" | undefined;
                query?: Record<string, any> | undefined;
                params?: Record<string, any> | undefined;
                request?: Request | undefined;
                headers?: HeadersInit | undefined;
                asResponse?: boolean | undefined;
                returnHeaders?: boolean | undefined;
                use?: better_auth.Middleware[] | undefined;
                path?: string | undefined;
            }]>(...inputCtx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : C extends [{
                returnHeaders: true;
            }] ? {
                headers: Headers;
                response: {
                    status: boolean;
                };
            } : {
                status: boolean;
            }>;
            options: {
                method: "POST";
                body: better_auth.ZodObject<{
                    newPassword: better_auth.ZodString;
                }, "strip", better_auth.ZodTypeAny, {
                    newPassword: string;
                }, {
                    newPassword: string;
                }>;
                metadata: {
                    SERVER_ONLY: true;
                };
                use: ((inputContext: {
                    body?: any;
                    query?: Record<string, any> | undefined;
                    request?: Request | undefined;
                    headers?: Headers | undefined;
                    asResponse?: boolean | undefined;
                    returnHeaders?: boolean | undefined;
                    use?: better_auth.Middleware[] | undefined;
                }) => Promise<{
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            name: string;
                            email: string;
                            emailVerified: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>)[];
            } & {
                use: any[];
            };
            path: "/set-password";
        };
        updateUser: {
            <C extends [{
                body: Partial<better_auth.Prettify<{
                    name?: string;
                    image?: string | null;
                }>>;
                method?: "POST" | undefined;
                query?: Record<string, any> | undefined;
                params?: Record<string, any> | undefined;
                request?: Request | undefined;
                headers?: HeadersInit | undefined;
                asResponse?: boolean | undefined;
                returnHeaders?: boolean | undefined;
                use?: better_auth.Middleware[] | undefined;
                path?: string | undefined;
            }]>(...inputCtx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : C extends [{
                returnHeaders: true;
            }] ? {
                headers: Headers;
                response: {
                    status: boolean;
                };
            } : {
                status: boolean;
            }>;
            options: {
                method: "POST";
                body: better_auth.ZodRecord<better_auth.ZodString, better_auth.ZodAny>;
                use: ((inputContext: {
                    body?: any;
                    query?: Record<string, any> | undefined;
                    request?: Request | undefined;
                    headers?: Headers | undefined;
                    asResponse?: boolean | undefined;
                    returnHeaders?: boolean | undefined;
                    use?: better_auth.Middleware[] | undefined;
                }) => Promise<{
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            name: string;
                            email: string;
                            emailVerified: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>)[];
                metadata: {
                    $Infer: {
                        body: Partial<better_auth.Prettify<{
                            name?: string;
                            image?: string | null;
                        }>>;
                    };
                    openapi: {
                        description: string;
                        requestBody: {
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            name: {
                                                type: string;
                                                description: string;
                                            };
                                            image: {
                                                type: string;
                                                description: string;
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                user: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/update-user";
        };
        deleteUser: {
            <C extends [{
                body: {
                    password?: string | undefined;
                    token?: string | undefined;
                    callbackURL?: string | undefined;
                };
                method?: "POST" | undefined;
                query?: Record<string, any> | undefined;
                params?: Record<string, any> | undefined;
                request?: Request | undefined;
                headers?: HeadersInit | undefined;
                asResponse?: boolean | undefined;
                returnHeaders?: boolean | undefined;
                use?: better_auth.Middleware[] | undefined;
                path?: string | undefined;
            }]>(...inputCtx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : C extends [{
                returnHeaders: true;
            }] ? {
                headers: Headers;
                response: {
                    success: boolean;
                    message: string;
                };
            } : {
                success: boolean;
                message: string;
            }>;
            options: {
                method: "POST";
                use: ((inputContext: {
                    body?: any;
                    query?: Record<string, any> | undefined;
                    request?: Request | undefined;
                    headers?: Headers | undefined;
                    asResponse?: boolean | undefined;
                    returnHeaders?: boolean | undefined;
                    use?: better_auth.Middleware[] | undefined;
                }) => Promise<{
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            name: string;
                            email: string;
                            emailVerified: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>)[];
                body: better_auth.ZodObject<{
                    callbackURL: better_auth.ZodOptional<better_auth.ZodString>;
                    password: better_auth.ZodOptional<better_auth.ZodString>;
                    token: better_auth.ZodOptional<better_auth.ZodString>;
                }, "strip", better_auth.ZodTypeAny, {
                    password?: string | undefined;
                    token?: string | undefined;
                    callbackURL?: string | undefined;
                }, {
                    password?: string | undefined;
                    token?: string | undefined;
                    callbackURL?: string | undefined;
                }>;
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/delete-user";
        };
        forgetPasswordCallback: {
            <C extends [{
                query: {
                    callbackURL: string;
                };
                params: {
                    token: string;
                };
                body?: undefined;
                method?: "GET" | undefined;
                request?: Request | undefined;
                headers?: HeadersInit | undefined;
                asResponse?: boolean | undefined;
                returnHeaders?: boolean | undefined;
                use?: better_auth.Middleware[] | undefined;
                path?: string | undefined;
            }]>(...inputCtx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : C extends [{
                returnHeaders: true;
            }] ? {
                headers: Headers;
                response: never;
            } : never>;
            options: {
                method: "GET";
                query: better_auth.ZodObject<{
                    callbackURL: better_auth.ZodString;
                }, "strip", better_auth.ZodTypeAny, {
                    callbackURL: string;
                }, {
                    callbackURL: string;
                }>;
                use: ((inputContext: {
                    body?: any;
                    query?: Record<string, any> | undefined;
                    request?: Request | undefined;
                    headers?: Headers | undefined;
                    asResponse?: boolean | undefined;
                    returnHeaders?: boolean | undefined;
                    use?: better_auth.Middleware[] | undefined;
                }) => Promise<void>)[];
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                token: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/reset-password/:token";
        };
        listSessions: {
            <C extends [{
                headers: HeadersInit;
                body?: undefined;
                method?: "GET" | undefined;
                query?: Record<string, any> | undefined;
                params?: Record<string, any> | undefined;
                request?: Request | undefined;
                asResponse?: boolean | undefined;
                returnHeaders?: boolean | undefined;
                use?: better_auth.Middleware[] | undefined;
                path?: string | undefined;
            }]>(...inputCtx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : C extends [{
                returnHeaders: true;
            }] ? {
                headers: Headers;
                response: better_auth.Prettify<{
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    expiresAt: Date;
                    token: string;
                    ipAddress?: string | null | undefined | undefined;
                    userAgent?: string | null | undefined | undefined;
                }>[];
            } : better_auth.Prettify<{
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                expiresAt: Date;
                token: string;
                ipAddress?: string | null | undefined | undefined;
                userAgent?: string | null | undefined | undefined;
            }>[]>;
            options: {
                method: "GET";
                use: ((inputContext: {
                    body?: any;
                    query?: Record<string, any> | undefined;
                    request?: Request | undefined;
                    headers?: Headers | undefined;
                    asResponse?: boolean | undefined;
                    returnHeaders?: boolean | undefined;
                    use?: better_auth.Middleware[] | undefined;
                }) => Promise<{
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            name: string;
                            email: string;
                            emailVerified: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>)[];
                requireHeaders: true;
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "array";
                                            items: {
                                                type: string;
                                                properties: {
                                                    token: {
                                                        type: string;
                                                    };
                                                    userId: {
                                                        type: string;
                                                    };
                                                    expiresAt: {
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/list-sessions";
        };
        revokeSession: {
            <C extends [{
                body: {
                    token: string;
                };
                headers: HeadersInit;
                method?: "POST" | undefined;
                query?: Record<string, any> | undefined;
                params?: Record<string, any> | undefined;
                request?: Request | undefined;
                asResponse?: boolean | undefined;
                returnHeaders?: boolean | undefined;
                use?: better_auth.Middleware[] | undefined;
                path?: string | undefined;
            }]>(...inputCtx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : C extends [{
                returnHeaders: true;
            }] ? {
                headers: Headers;
                response: {
                    status: boolean;
                };
            } : {
                status: boolean;
            }>;
            options: {
                method: "POST";
                body: better_auth.ZodObject<{
                    token: better_auth.ZodString;
                }, "strip", better_auth.ZodTypeAny, {
                    token: string;
                }, {
                    token: string;
                }>;
                use: ((inputContext: {
                    body?: any;
                    query?: Record<string, any> | undefined;
                    request?: Request | undefined;
                    headers?: Headers | undefined;
                    asResponse?: boolean | undefined;
                    returnHeaders?: boolean | undefined;
                    use?: better_auth.Middleware[] | undefined;
                }) => Promise<{
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            name: string;
                            email: string;
                            emailVerified: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>)[];
                requireHeaders: true;
                metadata: {
                    openapi: {
                        description: string;
                        requestBody: {
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            token: {
                                                type: string;
                                            };
                                        };
                                        required: string[];
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/revoke-session";
        };
        revokeSessions: {
            <C extends [{
                headers: HeadersInit;
                body?: undefined;
                method?: "POST" | undefined;
                query?: Record<string, any> | undefined;
                params?: Record<string, any> | undefined;
                request?: Request | undefined;
                asResponse?: boolean | undefined;
                returnHeaders?: boolean | undefined;
                use?: better_auth.Middleware[] | undefined;
                path?: string | undefined;
            }]>(...inputCtx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : C extends [{
                returnHeaders: true;
            }] ? {
                headers: Headers;
                response: {
                    status: boolean;
                };
            } : {
                status: boolean;
            }>;
            options: {
                method: "POST";
                use: ((inputContext: {
                    body?: any;
                    query?: Record<string, any> | undefined;
                    request?: Request | undefined;
                    headers?: Headers | undefined;
                    asResponse?: boolean | undefined;
                    returnHeaders?: boolean | undefined;
                    use?: better_auth.Middleware[] | undefined;
                }) => Promise<{
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            name: string;
                            email: string;
                            emailVerified: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>)[];
                requireHeaders: true;
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                status: {
                                                    type: string;
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/revoke-sessions";
        };
        revokeOtherSessions: {
            <C extends [{
                headers: HeadersInit;
                body?: undefined;
                method?: "POST" | undefined;
                query?: Record<string, any> | undefined;
                params?: Record<string, any> | undefined;
                request?: Request | undefined;
                asResponse?: boolean | undefined;
                returnHeaders?: boolean | undefined;
                use?: better_auth.Middleware[] | undefined;
                path?: string | undefined;
            }]>(...inputCtx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : C extends [{
                returnHeaders: true;
            }] ? {
                headers: Headers;
                response: {
                    status: boolean;
                };
            } : {
                status: boolean;
            }>;
            options: {
                method: "POST";
                requireHeaders: true;
                use: ((inputContext: {
                    body?: any;
                    query?: Record<string, any> | undefined;
                    request?: Request | undefined;
                    headers?: Headers | undefined;
                    asResponse?: boolean | undefined;
                    returnHeaders?: boolean | undefined;
                    use?: better_auth.Middleware[] | undefined;
                }) => Promise<{
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            name: string;
                            email: string;
                            emailVerified: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>)[];
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                status: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/revoke-other-sessions";
        };
        linkSocialAccount: {
            <C extends [{
                body: {
                    provider: "apple" | "discord" | "facebook" | "github" | "google" | "microsoft" | "spotify" | "twitch" | "twitter" | "dropbox" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "vk";
                    callbackURL?: string | undefined;
                };
                headers: HeadersInit;
                method?: "POST" | undefined;
                query?: Record<string, any> | undefined;
                params?: Record<string, any> | undefined;
                request?: Request | undefined;
                asResponse?: boolean | undefined;
                returnHeaders?: boolean | undefined;
                use?: better_auth.Middleware[] | undefined;
                path?: string | undefined;
            }]>(...inputCtx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : C extends [{
                returnHeaders: true;
            }] ? {
                headers: Headers;
                response: {
                    url: string;
                    redirect: boolean;
                };
            } : {
                url: string;
                redirect: boolean;
            }>;
            options: {
                method: "POST";
                requireHeaders: true;
                body: better_auth.ZodObject<{
                    callbackURL: better_auth.ZodOptional<better_auth.ZodString>;
                    provider: better_auth.ZodEnum<["github", ...("apple" | "discord" | "facebook" | "github" | "google" | "microsoft" | "spotify" | "twitch" | "twitter" | "dropbox" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "vk")[]]>;
                }, "strip", better_auth.ZodTypeAny, {
                    provider: "apple" | "discord" | "facebook" | "github" | "google" | "microsoft" | "spotify" | "twitch" | "twitter" | "dropbox" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "vk";
                    callbackURL?: string | undefined;
                }, {
                    provider: "apple" | "discord" | "facebook" | "github" | "google" | "microsoft" | "spotify" | "twitch" | "twitter" | "dropbox" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "vk";
                    callbackURL?: string | undefined;
                }>;
                use: ((inputContext: {
                    body?: any;
                    query?: Record<string, any> | undefined;
                    request?: Request | undefined;
                    headers?: Headers | undefined;
                    asResponse?: boolean | undefined;
                    returnHeaders?: boolean | undefined;
                    use?: better_auth.Middleware[] | undefined;
                }) => Promise<{
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            name: string;
                            email: string;
                            emailVerified: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>)[];
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                url: {
                                                    type: string;
                                                };
                                                redirect: {
                                                    type: string;
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/link-social";
        };
        listUserAccounts: {
            <C extends [({
                body?: undefined;
                method?: "GET" | undefined;
                query?: Record<string, any> | undefined;
                params?: Record<string, any> | undefined;
                request?: Request | undefined;
                headers?: HeadersInit | undefined;
                asResponse?: boolean | undefined;
                returnHeaders?: boolean | undefined;
                use?: better_auth.Middleware[] | undefined;
                path?: string | undefined;
            } | undefined)?]>(...inputCtx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : C extends [{
                returnHeaders: true;
            }] ? {
                headers: Headers;
                response: {
                    id: string;
                    provider: string;
                    createdAt: Date;
                    updatedAt: Date;
                    accountId: string;
                    scopes: string[];
                }[];
            } : {
                id: string;
                provider: string;
                createdAt: Date;
                updatedAt: Date;
                accountId: string;
                scopes: string[];
            }[]>;
            options: {
                method: "GET";
                use: ((inputContext: {
                    body?: any;
                    query?: Record<string, any> | undefined;
                    request?: Request | undefined;
                    headers?: Headers | undefined;
                    asResponse?: boolean | undefined;
                    returnHeaders?: boolean | undefined;
                    use?: better_auth.Middleware[] | undefined;
                }) => Promise<{
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            name: string;
                            email: string;
                            emailVerified: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>)[];
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "array";
                                            items: {
                                                type: string;
                                                properties: {
                                                    id: {
                                                        type: string;
                                                    };
                                                    provider: {
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/list-accounts";
        };
        deleteUserCallback: {
            <C extends [{
                query: {
                    token: string;
                    callbackURL?: string | undefined;
                };
                body?: undefined;
                method?: "GET" | undefined;
                params?: Record<string, any> | undefined;
                request?: Request | undefined;
                headers?: HeadersInit | undefined;
                asResponse?: boolean | undefined;
                returnHeaders?: boolean | undefined;
                use?: better_auth.Middleware[] | undefined;
                path?: string | undefined;
            }]>(...inputCtx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : C extends [{
                returnHeaders: true;
            }] ? {
                headers: Headers;
                response: {
                    success: boolean;
                    message: string;
                };
            } : {
                success: boolean;
                message: string;
            }>;
            options: {
                method: "GET";
                query: better_auth.ZodObject<{
                    token: better_auth.ZodString;
                    callbackURL: better_auth.ZodOptional<better_auth.ZodString>;
                }, "strip", better_auth.ZodTypeAny, {
                    token: string;
                    callbackURL?: string | undefined;
                }, {
                    token: string;
                    callbackURL?: string | undefined;
                }>;
                use: ((inputContext: {
                    body?: any;
                    query?: Record<string, any> | undefined;
                    request?: Request | undefined;
                    headers?: Headers | undefined;
                    asResponse?: boolean | undefined;
                    returnHeaders?: boolean | undefined;
                    use?: better_auth.Middleware[] | undefined;
                }) => Promise<void>)[];
            } & {
                use: any[];
            };
            path: "/delete-user/callback";
        };
        unlinkAccount: {
            <C extends [{
                body: {
                    providerId: string;
                };
                method?: "POST" | undefined;
                query?: Record<string, any> | undefined;
                params?: Record<string, any> | undefined;
                request?: Request | undefined;
                headers?: HeadersInit | undefined;
                asResponse?: boolean | undefined;
                returnHeaders?: boolean | undefined;
                use?: better_auth.Middleware[] | undefined;
                path?: string | undefined;
            }]>(...inputCtx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : C extends [{
                returnHeaders: true;
            }] ? {
                headers: Headers;
                response: {
                    status: boolean;
                };
            } : {
                status: boolean;
            }>;
            options: {
                method: "POST";
                body: better_auth.ZodObject<{
                    providerId: better_auth.ZodString;
                }, "strip", better_auth.ZodTypeAny, {
                    providerId: string;
                }, {
                    providerId: string;
                }>;
                use: ((inputContext: {
                    body?: any;
                    query?: Record<string, any> | undefined;
                    request?: Request | undefined;
                    headers?: Headers | undefined;
                    asResponse?: boolean | undefined;
                    returnHeaders?: boolean | undefined;
                    use?: better_auth.Middleware[] | undefined;
                }) => Promise<{
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            name: string;
                            email: string;
                            emailVerified: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>)[];
            } & {
                use: any[];
            };
            path: "/unlink-account";
        };
    }>;
    options: {
        secret: string;
        database: (options: better_auth.BetterAuthOptions) => {
            id: string;
            create<T extends Record<string, any>, R = T>(data: {
                model: string;
                data: T;
                select?: string[];
            }): Promise<any>;
            findOne<T>(data: {
                model: string;
                where: better_auth.Where[];
                select?: string[];
            }): Promise<any>;
            findMany<T>(data: {
                model: string;
                where?: better_auth.Where[];
                limit?: number;
                sortBy?: {
                    field: string;
                    direction: "asc" | "desc";
                };
                offset?: number;
            }): Promise<any[]>;
            count(data: {
                model: string;
                where?: better_auth.Where[];
            }): Promise<any>;
            update<T>(data: {
                model: string;
                where: better_auth.Where[];
                update: Record<string, any>;
            }): Promise<any>;
            updateMany(data: {
                model: string;
                where: better_auth.Where[];
                update: Record<string, any>;
            }): Promise<any>;
            delete<T>(data: {
                model: string;
                where: better_auth.Where[];
            }): Promise<void>;
            deleteMany(data: {
                model: string;
                where: better_auth.Where[];
            }): Promise<any>;
            options: better_auth_adapters_drizzle.DrizzleAdapterConfig;
        };
        emailAndPassword: {
            enabled: true;
        };
        socialProviders: {
            google: {
                clientId: string;
                clientSecret: string;
                redirectURI: string;
            };
        };
        trustedOrigins: string[];
        advanced: {
            useSecureCookies: true;
            crossSubDomainCookies: {
                enabled: true;
                domain: string;
            };
            defaultCookieAttributes: {
                secure: true;
                httpOnly: true;
                sameSite: "none";
                partitioned: true;
            };
        } | undefined;
    };
    $context: Promise<better_auth.AuthContext>;
    $Infer: {
        Session: {
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
            user: {
                id: string;
                name: string;
                email: string;
                emailVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
                image?: string | null | undefined | undefined;
            };
        };
    };
    $ERROR_CODES: {
        USER_NOT_FOUND: string;
        FAILED_TO_CREATE_USER: string;
        FAILED_TO_CREATE_SESSION: string;
        FAILED_TO_UPDATE_USER: string;
        FAILED_TO_GET_SESSION: string;
        INVALID_PASSWORD: string;
        INVALID_EMAIL: string;
        INVALID_EMAIL_OR_PASSWORD: string;
        SOCIAL_ACCOUNT_ALREADY_LINKED: string;
        PROVIDER_NOT_FOUND: string;
        INVALID_TOKEN: string;
        ID_TOKEN_NOT_SUPPORTED: string;
        FAILED_TO_GET_USER_INFO: string;
        USER_EMAIL_NOT_FOUND: string;
        EMAIL_NOT_VERIFIED: string;
        PASSWORD_TOO_SHORT: string;
        PASSWORD_TOO_LONG: string;
        USER_ALREADY_EXISTS: string;
        EMAIL_CAN_NOT_BE_UPDATED: string;
        CREDENTIAL_ACCOUNT_NOT_FOUND: string;
        SESSION_EXPIRED: string;
        FAILED_TO_UNLINK_LAST_ACCOUNT: string;
        ACCOUNT_NOT_FOUND: string;
    };
};

export { auth };
