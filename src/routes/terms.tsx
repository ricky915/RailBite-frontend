import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms of Service – SRFOOD" }, { name: "description", content: "SRFOOD terms of service." }] }),
  component: TermsPage,
});

function TermsPage() {
  const { content } = useStore();
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8">
      <h1 className="text-3xl font-bold">Terms of Service</h1>
      <p className="text-muted-foreground text-sm mt-1">Last updated: {new Date().toLocaleDateString()}</p>
      <div className="prose prose-sm mt-6 whitespace-pre-line text-foreground/90 leading-relaxed">
        {content.terms}
      </div>
    </div>
  );
}
