import * as _sinclair_typebox from '@sinclair/typebox';
import { Elysia } from 'elysia';

declare const app: Elysia<"", any, {
    error: any;
    typebox: _sinclair_typebox.TModule<any, any>;
}, any, any, {
    derive: {};
    resolve: {};
    schema: {};
}, any>;
type App = typeof app;

export type { App };
