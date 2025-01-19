"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { Order } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

export interface OrdersTableProps {
  data: Order[];
}

export function OrdersTable({ data }: OrdersTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns = React.useMemo<ColumnDef<Order>[]>(
    () => [
      {
        accessorKey: "merchantName",
        header: "Merchant",
        cell: (info) => (
          <p className="text-sm font-medium">{info.getValue<string>()}</p>
        ),
      },
      {
        accessorKey: "severity",
        header: "Severity",
        cell: (info) => {
          const severity = info.getValue<string>().toUpperCase();
          return (
            <span
              className={`inline-flex items-center rounded-md px-[8px] py-[6px] text-xs font-bold ${
                severity === "CRITICAL"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {severity}
            </span>
          );
        },
      },
      {
        accessorKey: "orderItems",
        header: "Items",
        cell: (info) => {
          const items =
            info.getValue<
              Array<{ name: string; price: number; quantity: number }>
            >();
          return (
            <p className="text-sm text-gray-600">
              {items.map((item) => item.name).join(", ")}
            </p>
          );
        },
      },
      {
        accessorKey: "total",
        header: "Amount",
        cell: (info) => (
          <p className="text-sm font-medium">${info.getValue<number>()}</p>
        ),
      },
      {
        accessorKey: "merchantLocation",
        header: "Location",
        cell: (info) => (
          <p className="text-sm text-gray-600">{info.getValue<string>()}</p>
        ),
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: (info) => (
          <p className="text-sm text-gray-600">
            {info.getValue<Date>().toLocaleDateString()}
          </p>
        ),
        sortingFn: "datetime",
      },
      {
        accessorKey: "resolved",
        header: "Status",
        cell: (info) => {
          const resolved = info.getValue<boolean>();
          return (
            <span
              className={cn(
                "inline-flex items-center rounded-lg px-[8px] py-[6px] text-xs font-bold",
                resolved
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700",
              )}
            >
              {resolved ? "Resolved" : "Pending"}
            </span>
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    columns,
    data: data || [],
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    enableSorting: true,
  });

  return (
    <div className="p-4">
      <div className="h-2" />
      <div className="overflow-hidden rounded-lg border-2 border-gray-200">
        <table className="w-full text-center text-lg">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className="border-b border-gray-200 p-4 text-base"
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : ""
                          }
                          onClick={header.column.getToggleSortingHandler()}
                          title={
                            header.column.getCanSort()
                              ? header.column.getNextSortingOrder() === "asc"
                                ? "Sort ascending"
                                : header.column.getNextSortingOrder() === "desc"
                                  ? "Sort descending"
                                  : "Clear sort"
                              : undefined
                          }
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {{
                            asc: " 🔼",
                            desc: " 🔽",
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table
              .getRowModel()
              .rows.slice(0, 10)
              .map((row) => {
                return (
                  <tr
                    key={row.id}
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => router.push(`/logs/${row.original.id}`)}
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td
                          key={cell.id}
                          className="border-b border-gray-200 p-3"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
