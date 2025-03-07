import * as _sinclair_typebox from '@sinclair/typebox';
import Elysia from 'elysia';

declare const testSessionRouter: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: _sinclair_typebox.TModule<{}>;
    error: {};
}, {
    schema: {};
    macro: {};
    macroFn: {};
    parser: {};
}, {
    session: {
        all: {
            get: {
                body: unknown;
                params: {};
                query: {
                    testId: string;
                };
                headers: unknown;
                response: {
                    200: {
                        sessions: {
                            duration: number | null;
                            id: string;
                            createdAt: string;
                            updatedAt: string;
                            deletedAt: string | null;
                            description: string | null;
                            title: string | null;
                            order: number | null;
                            testId: string;
                        }[];
                    };
                    422: {
                        type: "validation";
                        on: string;
                        summary?: string;
                        message?: string;
                        found?: unknown;
                        property?: string;
                        expected?: string;
                    };
                };
            };
        };
    } & {
        create: {
            post: {
                body: {
                    testId: string;
                };
                params: {};
                query: unknown;
                headers: unknown;
                response: {
                    200: {
                        sessions: {
                            duration: number | null;
                            id: string;
                            createdAt: string;
                            updatedAt: string;
                            deletedAt: string | null;
                            description: string | null;
                            title: string | null;
                            order: number | null;
                            testId: string;
                        }[];
                    };
                    422: {
                        type: "validation";
                        on: string;
                        summary?: string;
                        message?: string;
                        found?: unknown;
                        property?: string;
                        expected?: string;
                    };
                };
            };
        };
    } & {
        ":id": {
            delete: {
                delete: {
                    body: unknown;
                    params: {
                        id: string;
                    };
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: {
                            sessionRowChanges: number;
                            questionRowChanges: number;
                        };
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    } & {
        ":id": {
            get: {
                body: unknown;
                params: {
                    id: string;
                };
                query: unknown;
                headers: unknown;
                response: {
                    200: {
                        duration: number | null;
                        id: string;
                        createdAt: string;
                        updatedAt: string;
                        deletedAt: string | null;
                        description: string | null;
                        title: string | null;
                        order: number | null;
                        testId: string;
                    } | undefined;
                    422: {
                        type: "validation";
                        on: string;
                        summary?: string;
                        message?: string;
                        found?: unknown;
                        property?: string;
                        expected?: string;
                    };
                };
            };
        };
    } & {
        ":id": {
            put: {
                body: {
                    duration?: number | null | undefined;
                    id?: string | undefined;
                    createdAt?: string | undefined;
                    updatedAt?: string | undefined;
                    deletedAt?: string | null | undefined;
                    description?: string | null | undefined;
                    title?: string | null | undefined;
                    order?: number | null | undefined;
                    testId?: string | undefined;
                };
                params: {
                    id: string;
                };
                query: unknown;
                headers: unknown;
                response: {
                    200: {
                        id: string;
                        title: string | null;
                        duration: number | null;
                        order: number | null;
                        testId: string;
                        description: string | null;
                        createdAt: string;
                        updatedAt: string;
                        deletedAt: string | null;
                    }[];
                    422: {
                        type: "validation";
                        on: string;
                        summary?: string;
                        message?: string;
                        found?: unknown;
                        property?: string;
                        expected?: string;
                    };
                };
            };
        };
    } & {
        order: {
            put: {
                body: {
                    order: string[];
                    testId: string;
                };
                params: {};
                query: unknown;
                headers: unknown;
                response: {
                    200: void;
                    422: {
                        type: "validation";
                        on: string;
                        summary?: string;
                        message?: string;
                        found?: unknown;
                        property?: string;
                        expected?: string;
                    };
                };
            };
        };
    };
}, {
    derive: {};
    resolve: {};
    schema: {};
}, {
    derive: {};
    resolve: {};
    schema: {};
}>;

export { testSessionRouter };
