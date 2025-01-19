"use client";

import { Log } from "@/lib/models/logs";
import { Logs } from "@/lib/models/logs";
import { OrderItem } from "@/lib/models/transactions";
import { cn } from "@/lib/utils";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingFn,
    SortingState,
    useReactTable,
} from '@tanstack/react-table'
import { useRouter } from "next/navigation";
import React from 'react';

//custom sorting logic for one of our enum columns
const sortStatusFn: SortingFn<OrderItem> = (rowA, rowB, _columnId) => {
    const statusA = rowA.original.status
    const statusB = rowB.original.status
    const statusOrder = ['single', 'complicated', 'relationship']
    return statusOrder.indexOf(statusA) - statusOrder.indexOf(statusB)
}

export interface LogsTableProps {
    data: Logs;
}

export function LogsTable({ data }: LogsTableProps) {
    const router = useRouter();

    const [sorting, setSorting] = React.useState<SortingState>([]);

    const columns = React.useMemo<ColumnDef<Log>[]>(
        () => [
            {
                accessorKey: 'merchant_name',
                header: 'Merchant',
                cell: info => <p className="text-sm font-medium">{info.getValue()}</p>,
            },
            {
                accessorKey: 'severity',
                header: 'Severity',
                cell: info => {
                    const severity = (info.getValue() as string).toUpperCase();
                    return (
                        <span className={cn(
                            "inline-flex items-center rounded-md px-[8px] py-[6px] text-xs font-bold",
                            severity.toLowerCase() === 'low'
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                        )}>
                            {severity}
                        </span>
                    )
                },
            },
            {
                accessorKey: 'order_items',
                header: 'Items',
                cell: info => <p className="text-sm text-gray-600">{info.getValue()}</p>,
            },
            {
                accessorKey: 'total',
                header: 'Amount',
                cell: info => <p className="text-sm font-medium">${(info.getValue() as number).toFixed(2)}</p>,
            },
            {
                accessorKey: 'merchant_location',
                header: 'Location',
                cell: info => <p className="text-sm text-gray-600">{info.getValue()}</p>,
            },
            {
                accessorKey: 'date',
                header: 'Date',
                cell: info => <p className="text-sm text-gray-600">{info.getValue()?.toLocaleDateString()}</p>,
                sortingFn: 'datetime'
            },
            {
                accessorKey: 'resolved',
                header: 'Status',
                cell: info => {
                    const resolved = info.getValue() as boolean;
                    return (
                        <span className={cn(
                            "inline-flex items-center rounded-lg px-[8px] py-[6px] text-xs font-bold",
                            resolved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        )}>
                            {resolved ? 'RESOLVED' : 'TO BE REVIEWED'}
                        </span>
                    )
                },
            },
        ],
        []
    );

    const table = useReactTable({
        columns,
        data,
        debugTable: true,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: {
            sorting,
        },
        enableSorting: false, // - default on/true
        // enableSortingRemoval: false, //Don't allow - default on/true
        // isMultiSortEvent: (e) => true, //Make all clicks multi-sort - default requires `shift` key
        // maxMultiSortColCount: 3, // only allow 3 columns to be sorted at once - default is Infinity
    })


    //access sorting state from the table instance
    console.log(table.getState().sorting)

    return (
        <div className="p-4">
            <div className="h-2" />
            <div className="rounded-lg overflow-hidden border-2 border-gray-200">
                <table className="w-full text-center text-lg">
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => {
                                    return (
                                        <th key={header.id} colSpan={header.colSpan} className="border-b border-gray-200 p-4 text-base">
                                            {header.isPlaceholder ? null : (
                                                <div
                                                    className={
                                                        header.column.getCanSort()
                                                            ? 'cursor-pointer select-none'
                                                            : ''
                                                    }
                                                    onClick={header.column.getToggleSortingHandler()}
                                                    title={
                                                        header.column.getCanSort()
                                                            ? header.column.getNextSortingOrder() === 'asc'
                                                                ? 'Sort ascending'
                                                                : header.column.getNextSortingOrder() === 'desc'
                                                                    ? 'Sort descending'
                                                                    : 'Clear sort'
                                                            : undefined
                                                    }
                                                >
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                    {{
                                                        asc: ' 🔼',
                                                        desc: ' 🔽',
                                                    }[header.column.getIsSorted() as string] ?? null}
                                                </div>
                                            )}
                                        </th>
                                    )
                                })}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table
                            .getRowModel()
                            .rows.slice(0, 10)
                            .map(row => {
                                return (
                                    <tr
                                        key={row.id}
                                        className="hover:bg-gray-100 cursor-pointer"
                                        onClick={() => router.push(`/logs/${row.original.id}`)}
                                    >
                                        {row.getVisibleCells().map(cell => {
                                            return (
                                                <td key={cell.id} className="border-b border-gray-200 p-3">
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                )
                            })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
