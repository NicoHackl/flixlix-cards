import baseConfig from "@flixlix-cards/testing";
import { mergeConfig } from "vitest/config";

export default mergeConfig(baseConfig, {
  test: {
    name: "power-flow-card-plus",
  },
});
