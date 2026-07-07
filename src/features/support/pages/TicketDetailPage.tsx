import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';

import { Badge, type BadgeVariant } from '@/components/ui/Badge';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ROUTES } from '@/routes/routePaths';
import { formatDateTime } from '@/utils/formatters';
import type { SupportTicketStatus } from '@/types/domain.types';

import { useSupportTickets } from '@/features/support/hooks/useSupportTickets';

const STATUS_BADGE: Record<SupportTicketStatus, BadgeVariant> = {
  OPEN: 'pending',
  IN_PROGRESS: 'pending',
  RESOLVED: 'active',
  CLOSED: 'inactive',
};

/**
 * Page component: support ticket detail (Section 11.14). Reuses the same
 * `useSupportTickets` list query cache rather than a dedicated detail
 * endpoint — Section 11.4's endpoint table only lists ticket create/list.
 */
export default function TicketDetailPage(): JSX.Element {
  const { ticketId } = useParams<{ ticketId: string }>();
  const { tickets, isLoading } = useSupportTickets();
  const ticket = tickets.find((candidate) => candidate.id === ticketId);

  if (isLoading) {
    return <p className="text-sm text-neutral-500">Loading…</p>;
  }

  if (!ticket) {
    return (
      <EmptyState
        title="Ticket not found"
        description="This ticket may have been resolved and archived."
        action={
          <Link to={ROUTES.SUPPORT} className="text-brand-600 hover:underline">
            Back to support
          </Link>
        }
      />
    );
  }

  return (
    <>
      <Helmet>
        <title>Ticket {ticket.ticketNumber} — RailBite</title>
      </Helmet>

      <div className="mx-auto flex max-w-lg flex-col gap-4 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-neutral-900">{ticket.ticketNumber}</h1>
          <Badge variant={STATUS_BADGE[ticket.status]} label={ticket.status.replace(/_/g, ' ')} />
        </div>
        <p className="text-sm text-neutral-500">Raised {formatDateTime(ticket.createdAt)}</p>
        <p className="rounded-xl border border-neutral-200 bg-white p-4 text-sm text-neutral-700">
          {ticket.description}
        </p>
      </div>
    </>
  );
}
