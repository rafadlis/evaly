import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
  entry: [
    'src/**/*.ts',
  ],
  splitting: false,
  clean: true,
  dts: true,
  bundle: false,
  format: ['esm'],
  platform: 'node',
  target: ["es2020", "node18"],
  tsconfig: './tsconfig.build.json',
  sourcemap: !options.watch,
  minify: !options.watch,
  outDir: 'dist',
  treeshake: true,
}));
