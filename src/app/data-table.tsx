"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import { Stargazer } from "../../types"
import { useEffect, useState } from "react"
import { json2csv } from "json-2-csv";
import download from "downloadjs";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    const getSelectedData = () => {
        return table.getSelectedRowModel().rows.map((row) => row.original) as Stargazer[]
    }

    const [selectedData, setSelectedData] = useState(getSelectedData())

    useEffect(() => {
        setSelectedData(getSelectedData())
    }, [table.getSelectedRowModel().rows])

    const downloadAsCSV = () => {
        const csv = json2csv(selectedData, {
            keys: [
                {
                    field: "name",
                    title: "Name"
                },
                {
                    field: "company",
                    title: "Company"
                },
                {
                    field: "email",
                    title: "Email"
                },
                {
                    field: "location",
                    title: "Location"
                },
                {
                    field: "url",
                    title: "Profile URL"
                },
                {
                    field: "followers.totalCount",
                    title: "Followers"
                },
                {
                    field: "repositories.totalCount",
                    title: "Repositories"
                },
                {
                    field: "twitterUsername",
                    title: "Twitter Username"
                },
                {
                    field: "websiteUrl",
                    title: "Website"
                }
            ]
        });
        download(csv, "stargazers.csv")
    }

    return (
        <div>
            <div className="mt-2 flex items-center justify-between sm:justify-end space-x-2">
                <p>Selected: {selectedData.length}</p>
                <Button disabled={!selectedData.length} onClick={downloadAsCSV}>Download as CSV</Button>
            </div>
            <div className="rounded-md border mt-4">
                <div>
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                {
                    table.getPageCount() > 1 && (
                        <div className="flex items-center justify-end space-x-2 p-4 border-t">
                            <span className="text-sm font-medium">
                                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                            </span>



                            <div className="flex items-center justify-end space-x-2 p-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
            </div>
        </div>
    )
}
