"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CorporateAction } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  ArrowUpDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

export const columns: ColumnDef<CorporateAction>[] = [
  {
    accessorKey: "llmResultId",
    header: () => null,
    cell: () => null,
    enableHiding: true,
  },
  {
    accessorKey: "eventType",
    header: ({ column }) => (
      <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        Event Type
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-muted-foreground/50" />
        <span className="font-bold text-[14px] text-foreground">
          {row.getValue("eventType") || "Unknown"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "primaryTickerLiquidity",
    header: ({ column }) => (
      <div className="flex justify-end">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:bg-transparent px-0 h-auto"
        >
          Amount / ADV
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("primaryTickerLiquidity"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: "standard",
      }).format(amount);
      return (
        <div className="font-bold text-[14px] text-right text-foreground">
          {formatted}
        </div>
      );
    },
  },
  {
    accessorKey: "sourceCreatedAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:bg-transparent px-0 h-auto"
      >
        Date
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("sourceCreatedAt"));
      return (
        <div className="text-[13px] text-muted-foreground whitespace-nowrap">
          {format(date, "MM/dd/yy, hh:mm a")}
        </div>
      );
    },
  },
  {
    accessorKey: "confidence",
    header: ({ column }) => (
      <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        Confidence
      </div>
    ),
    cell: ({ row }) => {
      const confidence = row.getValue("confidence") as string;

      if (confidence === "high") {
        return (
          <Badge className="bg-[var(--color-status-success-bg)] text-[var(--color-status-success-text)] border-[var(--color-status-success-border)] hover:bg-[var(--color-status-success-bg)] shadow-none font-medium px-2 py-0.5 gap-1 capitalize border">
            <CheckCircle2 className="h-3 w-3" />
            Succeeded
          </Badge>
        );
      }

      if (confidence === "medium") {
        return (
          <Badge className="bg-[var(--color-status-pending-bg)] text-[var(--color-status-pending-text)] border-[var(--color-status-pending-border)] hover:bg-[var(--color-status-pending-bg)] shadow-none font-medium px-2 py-0.5 gap-1 capitalize border">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      }

      return (
        <Badge className="bg-[var(--color-status-neutral-bg)] text-[var(--color-status-neutral-text)] border-[var(--color-status-neutral-border)] hover:bg-[var(--color-status-neutral-bg)] shadow-none font-medium px-2 py-0.5 gap-1 capitalize border">
          <AlertCircle className="h-3 w-3" />
          {confidence}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem className="text-xs">
              <FileText className="mr-2 h-4 w-4" /> View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-xs">
              <ExternalLink className="mr-2 h-4 w-4" /> Source File
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
