
// export const dbMigrate = new sst.x.DevCommand("Migrate", {
//   dev: {
//     command: "bun --filter backend db:push",
//   },
//   environment: backendSecrets
// });

import { backendSecrets } from "./secrets";

export const dbStudio = new sst.x.DevCommand("Studio", {
  dev: {
    command: "bun --filter @evaly/backend db:studio",
  },
  environment: backendSecrets
});

// export const dbPush = new sst.x.DevCommand("Push", {
//   dev: {
//     command: "bun --filter backend db:push",
//   },
//   environment: backendSecrets
// });
