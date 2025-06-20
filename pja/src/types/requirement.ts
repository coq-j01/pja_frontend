type RequirementType = "FUNCTIONAL" | "PERFORMANCE";

export interface setrequire {
    requirementType: RequirementType,
    content: string,
}

export interface getrequire extends setrequire {
    requirementId: number
}