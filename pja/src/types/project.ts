export interface setproject {
  title: string;
  category: string;
  targetUsers: string[];
  coreFeatures: string[];
  technologyStack: string[];
  problemSolving: {
    currentProblem: string;
    solutionIdea: string;
    expectedBenefits: string[];
  };
}
export interface getproject extends setproject {
  projectInfold: number;
}
