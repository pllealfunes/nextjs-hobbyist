"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/ui/components/button";
import { Checkbox } from "@/ui/components/checkbox";
import { ArrowUpDown, Trash2, Pencil } from "lucide-react";
import Link from "next/link";
import { Post } from "@/lib/types";
import DeleteConfirmationDialog from "@/ui/components/deleteConfirmationDialog";
import { deletePost } from "@/lib/actions";

export const columns = (
  getCategoryName: (categoryId: number) => string,
  onDeleteSuccess: () => void
): ColumnDef<Post>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <Link href={`/posts/editpost/${row.original.id}`} passHref>
        {" "}
        <div className="capitalize cursor-pointer">
          {row.getValue("title")}
        </div>{" "}
      </Link>
    ),
  },
  {
    accessorKey: "category_id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Category
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return <div>{getCategoryName(row.getValue("category_id"))}</div>;
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>{new Date(row.getValue("created_at")).toLocaleDateString()}</div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex justify-evenly items-center gap-3 lg:gap-1">
        {/* Correctly pass the post ID to the Link */}
        <Link href={`/posts/editpost/${row.original.id}`} passHref>
          <Pencil className="text-rose-400 cursor-pointer over:text-rose-600 transition" />
        </Link>
        <DeleteConfirmationDialog
          trigger={
            <Trash2 className="text-red-500 cursor-pointer over:text-red-600 transition" />
          }
          onConfirm={() => deletePost(row.original.id, onDeleteSuccess)}
        />
      </div>
    ),
  },
];
