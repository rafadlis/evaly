import { MediaType } from '../../types/media.js';
import * as _sinclair_typebox from '@sinclair/typebox';
import Elysia from 'elysia';

declare const questionRouter: Elysia<"", {
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
}, {
    derive: {};
    resolve: {};
    schema: {};
}, {
    derive: {};
    resolve: {};
    schema: {};
}>;

export { questionRouter };
