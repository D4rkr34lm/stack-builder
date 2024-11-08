import { initAPI } from "./core/api/api";
import { initDB } from "./core/db/db";

export interface ProcessEnv {
  isDEV: boolean;
}

startBackend();

async function startBackend() {
  await initAPI();
  await initDB();
}

export default startBackend;
