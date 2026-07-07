import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/help")({
  head: () => ({ meta: [{ title: "Help & Support – SRFOOD" }] }),
  component: HelpPage,
});

const faqs = [
  { q: "How do I place an order?", a: "Browse the menu, add items to your cart, then enter your PNR, coach and seat number at checkout." },
  { q: "How is food delivered on train?", a: "Our partner kitchens near your upcoming station prepare food and hand it over at the platform to your seat." },
  { q: "Can I cancel an order?", a: "Orders can be cancelled before they enter the Preparing stage. Contact support for assistance." },
  { q: "What are the payment options?", a: "We accept UPI, Cards, Wallets and Cash on Delivery." },
  { q: "Is the food hygienic?", a: "All partner kitchens are FSSAI-certified and follow strict hygiene protocols." },
];

function HelpPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-6">
      <h1 className="text-3xl font-bold">Help & Support</h1>
      <p className="text-muted-foreground mt-2">Frequently asked questions</p>
      <div className="mt-6 bg-card border rounded-2xl p-4">
        <Accordion type="single" collapsible>
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`i${i}`}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
