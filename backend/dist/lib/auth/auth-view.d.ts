import { Context } from 'elysia';

declare const betterAuthView: (context: Context) => Promise<Response> | undefined;

export { betterAuthView as default };
