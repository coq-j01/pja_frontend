export interface MainFunction {
    mainFunctionId: number;
    content: string;
}

export interface TechStack {
    techStackId: number;
    content: string;
}

export interface IdeaData {
    ideaInputId: number;
    projectName: string;
    projectTarget: string;
    projectDescription: string;
    mainFunction: { mainFunctionId: number; content: string }[];
    techStack: { techStackId: number; content: string }[];
}