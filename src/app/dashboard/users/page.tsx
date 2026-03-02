"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { DataTable } from "@/features/users/components/data-table";
import { getColumns } from "@/features/users/components/columns";
import { UserProfile } from "@/features/users/types";

export default function UsersPage() {
  useSession(); // Make sure session is initialized/checked
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "CUSTOMER",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const [usersRes, onlineRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/users/online")
      ]);

      if (usersRes.ok) {
        const usersResult = await usersRes.json();
        const onlineIds = onlineRes.ok ? (await onlineRes.json()).data : [];

        const mergedUsers = (usersResult.data || []).map((user: UserProfile) => ({
          ...user,
          status: onlineIds.includes(user.id) ? "online" : "offline"
        }));

        setUsers(mergedUsers);
      } else if (usersRes.status === 403) {
        toast.error("Unauthorized. Only Super Admin can view users.");
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingUser ? `/api/users/${editingUser.id}` : "/api/users";
      const method = editingUser ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(editingUser ? "User updated" : "User created");
        setShowForm(false);
        setEditingUser(null);
        setFormData({ name: "", email: "", password: "", role: "CUSTOMER" });
        fetchUsers();
      } else {
        const result = await res.json();
        toast.error(result.message || "Operation failed");
      }
    } catch {
      toast.error("Operation failed");
    }
  };

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/users/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("User deleted");
        fetchUsers();
      } else {
        const result = await res.json();
        toast.error(result.message || "Failed to delete");
      }
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setDeleteId(null);
    }
  };


  if (loading) return <div className="text-muted-foreground p-8 text-center">Loading...</div>;

  // TODO: Improve RBAC check here if strictly needed, but API protects it.
  // If empty list and not loading, likely unauthorized or empty.

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <UsersIcon className="h-6 w-6" /> User Management
          </h1>
          <p className="text-muted-foreground">Manage users and roles</p>
        </div>
        <Button
          onClick={() => {
            setEditingUser(null);
            setFormData({ name: "", email: "", password: "", role: "CUSTOMER" });
            setShowForm(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>

      {/* User Form Modal/Card */}
      {showForm && (
        <Card className="border-primary/20 border-2">
          <CardHeader>
            <CardTitle>{editingUser ? "Edit User" : "New User"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{editingUser ? "New Password (leave blank to keep)" : "Password"}</Label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required={!editingUser}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(v: string) => setFormData({ ...formData, role: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
                      <SelectItem value="OWNER">Owner</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="STAFF">Staff</SelectItem>
                      <SelectItem value="CUSTOMER">Customer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingUser ? "Update" : "Create"}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <DataTable
        columns={getColumns({
          onEdit: (user) => {
            setEditingUser(user);
            setFormData({
              name: user.name || "",
              email: user.email,
              password: "",
              role: user.role,
            });
            setShowForm(true);
          },
          onDelete: (id) => handleDelete(id),
        })}
        data={users}
        searchKey="name"
        searchPlaceholder="Search by name or email..."
      />
      {/* Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user request and remove
              their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
