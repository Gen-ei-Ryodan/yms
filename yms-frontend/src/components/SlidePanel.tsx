"use client";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface SlidePanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export function SlidePanel({ open, onClose, title, children, size = "md" }: SlidePanelProps) {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "fixed right-0 top-0 h-full translate-x-full data-[state=open]:translate-x-0 transition-transform duration-300 ease-in-out p-0 gap-0",
          sizeClasses[size],
          "w-[90vw]"
        )}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <div className="flex flex-col h-full">
          <DialogHeader className="flex flex-row items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
            <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-4">
            {children}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}