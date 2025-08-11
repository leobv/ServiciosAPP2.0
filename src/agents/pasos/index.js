// src/agents/pasos/index.js
import { generarPaso3 } from "./paso3";
import { generarPaso5 } from "./paso5";
import { generarPaso7 } from "./paso7";

export const generators = {
  3: generarPaso3,
  5: generarPaso5,
  7: generarPaso7,
};
