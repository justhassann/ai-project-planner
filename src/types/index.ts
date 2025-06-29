export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  priority: 'high' | 'medium' | 'low';
  dependencies?: string[];
}

export interface ProjectPhase {
  id: string;
  title: string;
  description: string;
  estimatedDuration: string;
  tasks: ProjectTask[];
}

export interface ProjectPlan {
  id: string;
  goal: string;
  timeline: string;
  totalEstimatedTime: string;
  phases: ProjectPhase[];
  createdAt: string;
}

export interface PlanGenerationRequest {
  goal: string;
  timeline: string;
  detailLevel: 'basic' | 'detailed' | 'comprehensive';
}

export interface TrelloExportRequest {
  plan: ProjectPlan;
  apiKey: string;
  token: string;
}

export interface TrelloBoard {
  id: string;
  name: string;
  url: string;
}