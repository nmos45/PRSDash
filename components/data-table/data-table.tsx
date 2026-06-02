"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { subDays, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { DateRange } from "react-day-picker";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CorporateAction } from "@/types";
import { DateRangePicker } from "@/components/date-range-picker";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [selectedRow, setSelectedRow] = React.useState<TData | null>(null);

  // Initialize date range to last 7 days
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  // Custom filtering logic for dates
  const filteredData = React.useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return data;

    return data.filter((item) => {
      const date = new Date((item as any).sourceCreatedAt);
      return isWithinInterval(date, {
        start: startOfDay(dateRange.from!),
        end: endOfDay(dateRange.to!),
      });
    });
  }, [data, dateRange]);

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      globalFilter,
      columnVisibility,
    },
  });

  return (
    <div className="w-full bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between pb-6">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">
            Transaction Overview
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search all fields..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="h-9 w-[250px] bg-white border-gray-200 text-sm"
          />
          <DateRangePicker date={dateRange} setDate={setDateRange} />
        </div>
      </div>

      <div className="border-t border-gray-50">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="hover:bg-transparent border-b border-gray-50"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-12">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedRow(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between pt-6">
        <div className="text-sm font-medium text-muted-foreground">
          {table.getFilteredRowModel().rows.length} results
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-lg border-gray-200 text-xs font-semibold px-4"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-lg border-gray-200 text-xs font-semibold px-4"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      <Sheet open={!!selectedRow} onOpenChange={() => setSelectedRow(null)}>
        <SheetContent className="sm:max-w-xl overflow-y-auto px-8">
          {selectedRow && (
            <div className="space-y-8 pt-6 pb-10">
              <SheetHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant="outline"
                    className="text-[10px] font-bold uppercase tracking-widest px-2 py-0 border-gray-200"
                  >
                    ID: {(selectedRow as CorporateAction).llmResultId}
                  </Badge>
                </div>
                <SheetTitle className="text-2xl font-bold">
                  {(selectedRow as CorporateAction).eventType}
                </SheetTitle>
                <SheetDescription className="text-sm text-muted-foreground">
                  View full classification details and liquidity markers.
                </SheetDescription>
              </SheetHeader>

              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Confidence
                  </p>
                  <p className="text-sm font-semibold capitalize">
                    {(selectedRow as CorporateAction).confidence}
                  </p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Primary ADV
                  </p>
                  <p className="text-sm font-bold">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(
                      (selectedRow as CorporateAction).primaryTickerLiquidity,
                    )}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Key Details
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <p className="text-[14px] leading-relaxed text-foreground whitespace-pre-wrap">
                    {(selectedRow as CorporateAction).keyDetails}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Reasoning
                </h3>
                <p className="text-[14px] text-muted-foreground leading-relaxed italic">
                  {(selectedRow as CorporateAction).reasoning}
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Top Tickers & Liquidity
                </h3>
                <div className="space-y-2">
                  {(selectedRow as CorporateAction).topTickersWithLiquidity.map(
                    (item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-md bg-white border border-gray-100 shadow-sm"
                      >
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-50 font-bold px-2 py-0 shadow-none">
                            {item.ticker}
                          </Badge>
                        </div>
                        <p className="text-sm font-bold font-mono">
                          {new Intl.NumberFormat("en-US", {
                            notation: "compact",
                          }).format(item.adv)}{" "}
                          ADV
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="pt-6">
                <Button className="w-full gap-2" variant="outline">
                  <FileText className="h-4 w-4" /> Open Source File
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
