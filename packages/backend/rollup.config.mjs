import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default {
  plugins: [nodeResolve(), commonjs(), json(), typescript()],
  output: {
    file: "build/dist.cjs",
    format: "cjs",
    sourcemap: true,
  },
};
