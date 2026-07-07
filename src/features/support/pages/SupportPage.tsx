import { zodResolver } from '@hookform/resolvers/zod';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { Alert } from '@/components/feedback/Alert';
import { Badge, type BadgeVariant } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/feedback/EmptyState';
import { buildPath, ROUTES } from '@/routes/routePaths';

import { useSupportTickets } from '@/features/support/hooks/useSupportTickets';
import {
  createSupportTicketSchema,
  SUPPORT_TICKET_CATEGORIES,
  type CreateSupportTicketFormValues,
} from '@/features/support/schemas/supportTicketSchema';
import type { SupportTicketStatus } from '@/types/domain.types';

const STATUS_BADGE: Record<SupportTicketStatus, BadgeVariant> = {
  OPEN: 'pending',
  IN_PROGRESS: 'pending',
  RESOLVED: 'active',
  CLOSED: 'inactive',
};

const CATEGORY_LABELS: Record<(typeof SUPPORT_TICKET_CATEGORIES)[number], string> = {
  wrong_order: 'Wrong order',
  order_not_delivered: 'Order not delivered',
  food_quality: 'Food quality',
  refund_inquiry: 'Refund inquiry',
  account_issue: 'Account issue',
  other: 'Other',
};

/** Page component: support tickets (Section 11.14 Support Module). */
export default function SupportPage(): JSX.Element {
  const { tickets, isLoading, createTicket, isCreating, createError } = useSupportTickets();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateSupportTicketFormValues>({
    resolver: zodResolver(createSupportTicketSchema),
    mode: 'onBlur',
  });

  return (
    <>
      <Helmet>
        <title>Support — RailBite</title>
      </Helmet>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <h1 className="mb-4 text-2xl font-bold text-neutral-900">Raise a support ticket</h1>

          {createError && <Alert variant="error">{createError}</Alert>}

          <form
            onSubmit={handleSubmit((values) => {
              createTicket(values);
              reset();
            })}
            className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-4"
            noValidate
          >
            <div>
              <label htmlFor="category" className="text-sm font-medium text-neutral-700">
                Category
              </label>
              <select
                id="category"
                className="mt-1 h-10 w-full rounded-lg border border-neutral-300 px-3 text-sm"
                {...register('category')}
              >
                {SUPPORT_TICKET_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {CATEGORY_LABELS[category]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="description" className="text-sm font-medium text-neutral-700">
                Describe your issue
              </label>
              <textarea
                id="description"
                rows={5}
                className="mt-1 w-full rounded-lg border border-neutral-300 p-3 text-sm"
                {...register('description')}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-danger-700">{errors.description.message}</p>
              )}
            </div>

            <Button type="submit" isLoading={isCreating} disabled={!isValid || isCreating}>
              Submit ticket
            </Button>
          </form>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold text-neutral-900">Your tickets</h2>
          {isLoading ? (
            <p className="text-sm text-neutral-500">Loading…</p>
          ) : tickets.length === 0 ? (
            <EmptyState title="No support tickets yet" description="Tickets you raise will appear here." />
          ) : (
            <ul className="flex flex-col gap-3">
              {tickets.map((ticket) => (
                <li key={ticket.id}>
                  <Link
                    to={buildPath(ROUTES.SUPPORT_TICKET_DETAIL, { ticketId: ticket.id })}
                    className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-4 hover:shadow-md"
                  >
                    <div>
                      <p className="font-medium text-neutral-900">{ticket.ticketNumber}</p>
                      <p className="text-sm text-neutral-500">{CATEGORY_LABELS[ticket.category as keyof typeof CATEGORY_LABELS] ?? ticket.category}</p>
                    </div>
                    <Badge variant={STATUS_BADGE[ticket.status]} label={ticket.status.replace(/_/g, ' ')} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
