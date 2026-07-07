import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy – SRFOOD" }, { name: "description", content: "SRFOOD privacy policy." }] }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const { content } = useStore();
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="text-muted-foreground text-sm mt-1">Last updated: {new Date().toLocaleDateString()}</p>
      <div className="prose prose-sm mt-6 whitespace-pre-line text-foreground/90 leading-relaxed">
        {content.privacy}
      </div>
    </div>
  );
}
