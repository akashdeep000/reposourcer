"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Stargazer } from "../../types"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarImage } from "@/components/ui/avatar"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export const columns: ColumnDef<Stargazer>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllRowsSelected() ||
          (table.getIsSomeRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "avatarUrl",
    header: "Avatar",
    cell: ({ row }) => {
      const value: string = row.getValue("avatarUrl")
      return (
        <Avatar>
          <AvatarImage src={value} />
        </Avatar>
      )
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "url",
    header: "Username",
    cell: ({ row }) => {
      const value: string = row.getValue("url")
      const username = value.split("/").pop()
      return <a className="underline" href={value}>{username}</a>
    }
  },
  {
    accessorKey: "followers",
    header: "Followers",
    cell: ({ row }) => {
      const value: {totalCount: number} = row.getValue("repositories")
      return value.totalCount
    }
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "company",
    header: "Companty",
  },
  {
    accessorKey: "repositories",
    header: "Repo Count",
    cell: ({ row }) => {
      const value: {totalCount: number} = row.getValue("repositories")
      return value.totalCount
    }
  },
  {
    accessorKey: "url",
    header: "Activity",
    cell: ({ row }) => {
      const value: string = row.getValue("url")
      const username = value.split("/").pop() as string
      return <img className="h-8 min-w-52" src={`https://ghchart.rshah.org/${username}`}/>
    }
  },
  {
    accessorKey: "twitterUsername",
    header: "Twitter Username",
  }, 
  {
    accessorKey: "websiteUrl",
    header: "Website",
  },
]
