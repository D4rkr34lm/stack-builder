import { initAPI } from "./api/index.js";

export interface ProcessEnv {
  isDEV: boolean;
}

startBackend();

async function startBackend() {
  await initAPI();
}

export default startBackend;
