import type { Step } from "../types/workspace";

export const getStepIdFromNumber = (progressStep: string) => {
  switch (progressStep) {
    case "0":
      return "idea";
    case "1":
      return "requirements";
    case "2":
      return "project";
    case "3":
      return "erd";
    case "4":
      return "api";
    case "5":
      return "develop";
    case "6":
      return "complete";
    default:
      console.error(`Invalid progressStep: "${progressStep}"`);
  }
};

export const getNumberFromStepId = (stepId: string): Step | undefined => {
  switch (stepId) {
    case "idea":
      return "0";
    case "requirements":
      return "1";
    case "project":
      return "2";
    case "erd":
      return "3";
    case "api":
      return "4";
    case "develop":
      return "5";
    case "complete":
      return "6";
    default:
      console.error(`Invalid stepId: "${stepId}"`);
  }
};
