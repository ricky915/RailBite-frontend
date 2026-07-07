import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/queryClient';
import { useToast } from '@/providers/ToastProvider';
import { parseApiError } from '@/utils/apiErrors';

import { supportApi } from '@/features/support/services/supportApi';
import type { CreateSupportTicketFormValues } from '@/features/support/schemas/supportTicketSchema';

/**
 * Container hook for the support ticket list + creation (Section 6.2 /
 * Section 11.14 Support Module).
 */
export function useSupportTickets() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const query = useQuery({
    queryKey: queryKeys.support.tickets({}),
    queryFn: () => supportApi.listTickets({}),
  });

  const createMutation = useMutation({
    mutationFn: (values: CreateSupportTicketFormValues) => supportApi.createTicket(values),
    onSuccess: (ticket) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.support.all });
      showToast(`Ticket ${ticket.ticketNumber} created — we'll be in touch shortly.`, 'success');
    },
    onError: (error) => {
      showToast(parseApiError(error), 'error');
    },
  });

  return {
    tickets: query.data ?? [],
    isLoading: query.isLoading,
    createTicket: createMutation.mutate,
    isCreating: createMutation.isPending,
    createError: createMutation.error ? parseApiError(createMutation.error) : null,
  };
}
