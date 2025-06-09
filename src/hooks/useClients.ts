import { useClientStore } from '../store/clientStore';

export function useClients() {
  const { clients } = useClientStore();
  const isLoading = false; // TODO: Add loading state when implementing API calls

  return { clients, isLoading };
} 