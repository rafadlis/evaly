import { MediaType } from './types/media.js';
import { Pagination } from './types/pagination.js';
import * as _sinclair_typebox from '@sinclair/typebox';
import { Elysia } from 'elysia';

declare const app: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    error: {};
    typebox: _sinclair_typebox.TModule<{}, {}>;
}, {
    schema: {};
    macro: {};
    macroFn: {};
    parser: {};
}, {
    index: {
        get: {
            body: unknown;
            params: {};
            query: unknown;
            headers: unknown;
            response: {
                200: string;
            };
        };
    };
} & {
    api: {
        auth: {
            "*": {
                [x: string]: {
                    body: unknown;
                    params: {
                        "*": string;
                    };
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response | undefined;
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
    };
} & {
    organization: {
        index: {
            get: {
                body: unknown;
                params: {};
                query: unknown;
                headers: unknown;
                response: {
                    200: string;
                };
            };
        };
    } & {
        profile: {
            get: {
                body: unknown;
                params: {};
                query: unknown;
                headers: unknown;
                response: {
                    200: {
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
                    };
                };
            };
        };
    } & {
        test: {
            all: {
                get: {
                    body: unknown;
                    params: {};
                    query: {
                        limit: number;
                        page: number;
                    };
                    headers: unknown;
                    response: {
                        200: {
                            data: {
                                type: "live" | "self-paced";
                                id: string;
                                createdAt: string;
                                updatedAt: string;
                                deletedAt: string | null;
                                organizationId: string;
                                description: string | null;
                                title: string | null;
                                access: "public" | "invite-only" | null;
                                isPublished: boolean | null;
                                createdByOrganizerId: string;
                                heldAt: string | null;
                                finishedAt: string | null;
                            }[];
                            pagination: Pagination;
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
                        type: "live" | "self-paced";
                    };
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: {
                            type: "live" | "self-paced";
                            id: string;
                            createdAt: string;
                            updatedAt: string;
                            deletedAt: string | null;
                            organizationId: string;
                            description: string | null;
                            title: string | null;
                            access: "public" | "invite-only" | null;
                            isPublished: boolean | null;
                            createdByOrganizerId: string;
                            heldAt: string | null;
                            finishedAt: string | null;
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
                get: {
                    body: unknown;
                    params: {
                        id: string;
                    };
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: {
                            type: "live" | "self-paced";
                            id: string;
                            createdAt: string;
                            updatedAt: string;
                            deletedAt: string | null;
                            organizationId: string;
                            description: string | null;
                            title: string | null;
                            access: "public" | "invite-only" | null;
                            isPublished: boolean | null;
                            createdByOrganizerId: string;
                            heldAt: string | null;
                            finishedAt: string | null;
                        };
                        404: "Test not found";
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
                        type?: "live" | "self-paced" | undefined;
                        id?: string | undefined;
                        createdAt?: string | undefined;
                        updatedAt?: string | undefined;
                        deletedAt?: string | null | undefined;
                        organizationId?: string | undefined;
                        description?: string | null | undefined;
                        title?: string | null | undefined;
                        access?: "public" | "invite-only" | null | undefined;
                        isPublished?: boolean | null | undefined;
                        createdByOrganizerId?: string | undefined;
                        heldAt?: string | null | undefined;
                        finishedAt?: string | null | undefined;
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
                            type: "live" | "self-paced";
                            access: "public" | "invite-only" | null;
                            isPublished: boolean | null;
                            description: string | null;
                            createdByOrganizerId: string;
                            organizationId: string;
                            heldAt: string | null;
                            finishedAt: string | null;
                            createdAt: string;
                            updatedAt: string;
                            deletedAt: string | null;
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
        };
    } & {
        question: {
            create: {
                post: {
                    body: {
                        options?: {
                            pointValue?: number | undefined;
                            mediaType?: "image" | "audio" | "video" | "file" | undefined;
                            mediaUrl?: string | undefined;
                            id: string;
                            text: string;
                            isCorrect: boolean;
                        }[] | null | undefined;
                        type?: "multiple-choice" | "yes-or-no" | "point-based" | "text-field" | "file-upload" | "fill-the-blank" | "audio-response" | "video-response" | "dropdown" | "matching-pairs" | "slider-scale" | "ranking" | "hotspot" | "drag-and-drop" | "matrix" | "likert-scale" | "open-ended" | "code-snippet" | "math-formula" | "drawing" | null | undefined;
                        id?: string | undefined;
                        createdAt?: string | undefined;
                        updatedAt?: string | undefined;
                        deletedAt?: string | null | undefined;
                        organizationId?: string | null | undefined;
                        question?: string | null | undefined;
                        referenceType?: "test-session" | "template" | "ai-generated" | undefined;
                        order?: number | undefined;
                        pointValue?: number | null | undefined;
                        allowMultipleAnswers?: boolean | undefined;
                        referenceId: string;
                    }[];
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: {
                            questions: {
                                options: {
                                    id: string;
                                    text: string;
                                    isCorrect: boolean;
                                    mediaUrl?: string;
                                    mediaType?: MediaType;
                                    pointValue?: number;
                                }[] | null;
                                type: "multiple-choice" | "yes-or-no" | "point-based" | "text-field" | "file-upload" | "fill-the-blank" | "audio-response" | "video-response" | "dropdown" | "matching-pairs" | "slider-scale" | "ranking" | "hotspot" | "drag-and-drop" | "matrix" | "likert-scale" | "open-ended" | "code-snippet" | "math-formula" | "drawing" | null;
                                id: string;
                                createdAt: string;
                                updatedAt: string;
                                deletedAt: string | null;
                                organizationId: string | null;
                                question: string | null;
                                referenceId: string;
                                referenceType: "test-session" | "template" | "ai-generated";
                                order: number;
                                pointValue: number | null;
                                allowMultipleAnswers: boolean;
                            }[];
                        };
                        400: "Failed to create question";
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
            all: {
                get: {
                    body: unknown;
                    params: {};
                    query: {
                        referenceId: string;
                    };
                    headers: unknown;
                    response: {
                        200: {
                            questions: {
                                options: {
                                    id: string;
                                    text: string;
                                    isCorrect: boolean;
                                    mediaUrl?: string;
                                    mediaType?: MediaType;
                                    pointValue?: number;
                                }[] | null;
                                type: "multiple-choice" | "yes-or-no" | "point-based" | "text-field" | "file-upload" | "fill-the-blank" | "audio-response" | "video-response" | "dropdown" | "matching-pairs" | "slider-scale" | "ranking" | "hotspot" | "drag-and-drop" | "matrix" | "likert-scale" | "open-ended" | "code-snippet" | "math-formula" | "drawing" | null;
                                id: string;
                                createdAt: string;
                                updatedAt: string;
                                deletedAt: string | null;
                                organizationId: string | null;
                                question: string | null;
                                referenceId: string;
                                referenceType: "test-session" | "template" | "ai-generated";
                                order: number;
                                pointValue: number | null;
                                allowMultipleAnswers: boolean;
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
            update: {
                ":id": {
                    put: {
                        body: {
                            options?: {
                                pointValue?: number | undefined;
                                mediaType?: "image" | "audio" | "video" | "file" | undefined;
                                mediaUrl?: string | undefined;
                                id: string;
                                text: string;
                                isCorrect: boolean;
                            }[] | null | undefined;
                            type?: "multiple-choice" | "yes-or-no" | "point-based" | "text-field" | "file-upload" | "fill-the-blank" | "audio-response" | "video-response" | "dropdown" | "matching-pairs" | "slider-scale" | "ranking" | "hotspot" | "drag-and-drop" | "matrix" | "likert-scale" | "open-ended" | "code-snippet" | "math-formula" | "drawing" | null | undefined;
                            id?: string | undefined;
                            createdAt?: string | undefined;
                            updatedAt?: string | undefined;
                            deletedAt?: string | null | undefined;
                            organizationId?: string | null | undefined;
                            question?: string | null | undefined;
                            referenceId?: string | undefined;
                            referenceType?: "test-session" | "template" | "ai-generated" | undefined;
                            order?: number | undefined;
                            pointValue?: number | null | undefined;
                            allowMultipleAnswers?: boolean | undefined;
                        };
                        params: {
                            id: string;
                        };
                        query: unknown;
                        headers: unknown;
                        response: {
                            200: {
                                updatedQuestion: {
                                    id: string;
                                    question: string | null;
                                    referenceId: string;
                                    referenceType: "test-session" | "template" | "ai-generated";
                                    organizationId: string | null;
                                    order: number;
                                    type: "multiple-choice" | "yes-or-no" | "point-based" | "text-field" | "file-upload" | "fill-the-blank" | "audio-response" | "video-response" | "dropdown" | "matching-pairs" | "slider-scale" | "ranking" | "hotspot" | "drag-and-drop" | "matrix" | "likert-scale" | "open-ended" | "code-snippet" | "math-formula" | "drawing" | null;
                                    pointValue: number | null;
                                    options: {
                                        id: string;
                                        text: string;
                                        isCorrect: boolean;
                                        mediaUrl?: string;
                                        mediaType?: MediaType;
                                        pointValue?: number;
                                    }[] | null;
                                    allowMultipleAnswers: boolean;
                                    createdAt: string;
                                    updatedAt: string;
                                    deletedAt: string | null;
                                };
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
                delete: {
                    body: unknown;
                    params: {
                        id: string;
                    };
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: {
                            message: string;
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
            "update-order": {
                put: {
                    body: {
                        order: number;
                        questionId: string;
                    }[];
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: {
                            message: string;
                        };
                        400: "Failed to update order";
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
type App = typeof app;

export type { App };
