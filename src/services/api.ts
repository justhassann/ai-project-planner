import { supabase } from '../config/supabase';
import { PlanGenerationRequest, ProjectPlan, TrelloExportRequest, TrelloBoard } from '../types';

export const generateProjectPlan = async (request: PlanGenerationRequest): Promise<ProjectPlan> => {
  const { data, error } = await supabase.functions.invoke('generate-plan', {
    body: request,
  });

  if (error) {
    throw new Error(error.message || 'Failed to generate project plan');
  }

  return data;
};

export const exportToTrello = async (request: TrelloExportRequest): Promise<TrelloBoard> => {
  const { data, error } = await supabase.functions.invoke('export-to-trello', {
    body: request,
  });

  if (error) {
    throw new Error(error.message || 'Failed to export to Trello');
  }

  return data;
};