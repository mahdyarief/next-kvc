"use client";

import { ColumnDef } from "@tanstack/react-table";
import { UserProfile } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, Trash2, ShieldAlert, ShieldCheck, User as UserIcon } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ColumnsProps {
    onEdit: (user: UserProfile) => void;
    onDelete: (id: string) => void;
}

export const getColumns = ({ onEdit, onDelete }: ColumnsProps): ColumnDef<UserProfile>[] => [
    {
        accessorKey: "name",
        header: "User",
        cell: ({ row }) => {
            const user = row.original;
            const initial = user.name?.charAt(0) || user.email.charAt(0);

            return (
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 font-heading text-sm font-bold text-primary border border-primary/20">
                        {initial}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-foreground/90">{user.name || "User"}</span>
                        <span className="text-muted-foreground text-[11px] leading-tight">{user.email}</span>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
            const role = row.getValue("role") as string;

            const getRoleConfig = (role: string) => {
                switch (role) {
                    case "SUPERADMIN":
                        return { icon: ShieldAlert, color: "text-red-500", label: "Super Admin" };
                    case "ADMIN":
                        return { icon: ShieldCheck, color: "text-blue-500", label: "Admin" };
                    case "STAFF":
                        return { icon: ShieldCheck, color: "text-amber-500", label: "Staff" };
                    default:
                        return { icon: UserIcon, color: "text-muted-foreground", label: "Customer" };
                }
            };

            const config = getRoleConfig(role);
            return (
                <Badge variant="outline" className="flex w-fit items-center gap-1.5 px-2 py-0.5 font-medium border-border/60">
                    <config.icon className={`h-3 w-3 ${config.color}`} />
                    {config.label}
                </Badge>
            );
        },
    },
    {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => {
            const isOnline = row.original.status === "online";
            return (
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "h-2 w-2 rounded-full",
                        isOnline ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-muted-foreground/30"
                    )} />
                    <span className={cn(
                        "text-[11px] font-semibold uppercase tracking-wider",
                        isOnline ? "text-emerald-500" : "text-muted-foreground/60"
                    )}>
                        {isOnline ? "Online" : "Offline"}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: "Joined",
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt"));
            return <span className="text-muted-foreground text-xs">{date.toLocaleDateString()}</span>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const user = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted/60">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEdit(user)} className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => onDelete(user.id)}
                            className="text-destructive focus:text-destructive cursor-pointer"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
