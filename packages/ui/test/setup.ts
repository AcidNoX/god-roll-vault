import Module from "node:module";
import * as ReactNative from "./react-native";

type ModuleLoader = typeof Module._load;

const moduleWithLoader = Module as unknown as {
  _load: ModuleLoader;
};
const defaultLoad = moduleWithLoader._load;

moduleWithLoader._load = function loadReactNativeShim(request, parent, isMain) {
  if (request === "react-native") {
    return ReactNative;
  }

  if (request === "react-native/package.json") {
    return { version: "0.79.2" };
  }

  return defaultLoad.call(this, request, parent, isMain);
} as ModuleLoader;
