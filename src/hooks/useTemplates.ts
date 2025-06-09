import { useTemplateStore } from '../store/templateStore';

export function useTemplates() {
  const { templates, addTemplate, updateTemplate, deleteTemplate } = useTemplateStore();
  const isLoading = false; // TODO: Add loading state when implementing API calls

  return {
    templates,
    isLoading,
    addTemplate,
    updateTemplate,
    deleteTemplate,
  };
} 