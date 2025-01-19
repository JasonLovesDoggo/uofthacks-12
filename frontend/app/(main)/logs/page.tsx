"use client";

import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { LogsTable } from './table';
import { logsSchema } from '@/lib/models/logs';

export default function LogsPage() {
    const { status, data, error, isFetching } = useQuery({
        queryKey: ['logs'],
        queryFn: () => fetch('/api/logs')
            .then(res => res.json())
            .then(obj => obj.success ? logsSchema.parse(obj.data) : undefined)
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">Logs</h1>
            {
                status === 'pending' ? <p className="text-center text-gray-600">Loading...</p>
                    : status === 'error' ? <p className="text-center text-red-600">Error: {error?.message}</p>
                        : (
                            // <pre>{JSON.stringify(data, null, 2)}</pre>
                            <LogsTable data={data} />
                        )
            }
        </div>
    )
}
