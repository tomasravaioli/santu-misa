import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Red square with a white X. Same control on every dialog. */
export function DialogCloseButton({ className }: { className?: string }) {
  return (
    <Dialog.Close asChild>
      <Button
        type="button"
        size="icon"
        aria-label="Close"
        className={cn("shrink-0 border-0 bg-[#c1272d] text-white hover:bg-[#a11f24]", className)}
      >
        <X className="size-5" strokeWidth={2.25} />
      </Button>
    </Dialog.Close>
  );
}
