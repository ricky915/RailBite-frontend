import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import { Alert } from '@/components/feedback/Alert';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDate } from '@/utils/formatters';
import { parseApiError } from '@/utils/apiErrors';

import { useInvoice } from '@/features/invoices/hooks/useInvoice';

/**
 * Page component: invoice download (Section 11.13 Invoice Module —
 * "Invoice available for download from order history at any time").
 */
export default function InvoiceDetailPage(): JSX.Element {
  const { orderId = '' } = useParams<{ orderId: string }>();
  const { invoice, isLoading, isError, error } = useInvoice(orderId);

  if (isError) {
    return <Alert variant="error">{parseApiError(error)}</Alert>;
  }

  if (isLoading || !invoice) {
    return <Skeleton height={200} className="rounded-xl" />;
  }

  return (
    <>
      <Helmet>
        <title>Invoice {invoice.invoiceNumber} — RailBite</title>
      </Helmet>

      <div className="mx-auto flex max-w-sm flex-col gap-4 py-10 text-center">
        <h1 className="text-2xl font-bold text-neutral-900">Invoice {invoice.invoiceNumber}</h1>
        <p className="text-sm text-neutral-500">Issued {formatDate(invoice.issuedAt)}</p>
        <a href={invoice.pdfUrl} target="_blank" rel="noopener noreferrer">
          <Button>Download PDF</Button>
        </a>
      </div>
    </>
  );
}
