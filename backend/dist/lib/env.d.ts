declare const env: {
    ENVIRONMENT: "development" | "staging" | "production";
    WEB_PUBLIC_URL: string;
    BETTER_AUTH_SECRET: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    DATABASE_URL_DEVELOPMENT: string;
    DATABASE_URL_STAGING: string;
    DATABASE_URL_PROD: string;
    AXIOM_API_TOKEN: string;
    AXIOM_DATASET_NAME: string;
};

export { env };
