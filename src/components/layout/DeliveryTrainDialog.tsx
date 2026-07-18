import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDeliveryStore } from "@/store/deliveryStore";

export function DeliveryTrainDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [manualNumber, setManualNumber] = useState("");
  const setTrain = useDeliveryStore((s) => s.setTrain);

  const reset = () => setManualNumber("");

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
    if (!next) reset();
  };

  const saveManual = () => {
    const number = manualNumber.trim();
    if (!/^\d{4,5}$/.test(number)) {
      toast.error("Enter a valid 4–5 digit train number");
      return;
    }
    setTrain(number);
    toast.success(`Delivery train set to #${number}`);
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Set your delivery train</DialogTitle>
          <DialogDescription>Enter your train number to change where we deliver.</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label>Train Number</Label>
          <div className="flex gap-2">
            <Input
              value={manualNumber}
              onChange={(e) => setManualNumber(e.target.value)}
              placeholder="e.g. 12345"
              maxLength={5}
              className="flex-1"
              autoFocus
            />
            <Button type="button" onClick={saveManual}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
