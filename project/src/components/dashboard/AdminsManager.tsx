"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Edit, Trash2, Key } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Admin {
  id: string;
  name: string;
  email: string;
  role: "admin" | "super_admin";
  is_active: boolean;
  created_at: string;
}

type AdminRole = "admin" | "super_admin";

interface FormData {
  name: string;
  email: string;
  password: string;
  role: AdminRole;
  is_active: boolean;
}

const AdminsManager = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [resetPasswordAdmin, setResetPasswordAdmin] = useState<Admin | null>(
    null
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    role: "admin",
    is_active: true,
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "admin",
      is_active: true,
    });
  };

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admins`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setAdmins(data.admins || []);
    } catch (err) {
      console.error("Failed to fetch admins", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(search.toLowerCase()) ||
      admin.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / pageSize);
  const currentData = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleEdit = (admin: Admin) => {
    setEditingAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      password: "",
      role: admin.role,
      is_active: admin.is_active,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const url = editingAdmin
      ? `${import.meta.env.VITE_API_URL}/api/admins/${editingAdmin.id}`
      : `${import.meta.env.VITE_API_URL}/api/admins`;
    const method = editingAdmin ? "PUT" : "POST";
    const payload = editingAdmin
      ? {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          is_active: formData.is_active,
        }
      : formData;

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      fetchAdmins();
      resetForm();
      setEditingAdmin(null);
      setShowModal(false);
      toast({
        title: "Амжилттай",
        description: editingAdmin
          ? "Админы мэдээлэл шинэчлэгдлээ."
          : "Шинэ админ амжилттай нэмэгдлээ.",
        duration: 2000,
      });
    } else {
      toast({
        title: "Алдаа",
        description: "Үйлдлийг гүйцэтгэж чадсангүй",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Алдаа",
        description: "Нууц үг таарахгүй байна",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }
    const token = localStorage.getItem("token");
    await fetch(
      `${import.meta.env.VITE_API_URL}/api/admins/${
        resetPasswordAdmin?.id
      }/reset-password`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword: passwordData.newPassword }),
      }
    );
    setShowPasswordModal(false);
    setPasswordData({ newPassword: "", confirmPassword: "" });
    toast({
      title: "Амжилттай",
      description: "Нууц үг шинэчлэгдлээ",
      duration: 2000,
    });
  };

  const handleDelete = async () => {
    if (!adminToDelete) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admins/${adminToDelete.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        fetchAdmins();
        toast({
          title: "Амжилттай",
          description: "Админ устгагдлаа.",
          duration: 2000,
        });
      } else {
        toast({
          title: "Алдаа",
          description: "Устгаж чадсангүй.",
          variant: "destructive",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
      toast({
        title: "Алдаа",
        description: "Устгах үед алдаа гарлаа.",
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setShowDeleteDialog(false);
      setAdminToDelete(null);
    }
  };

  return (
    <div className="space-y-6 px-4 md:px-8 lg:px-16 py-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Админуудын удирдлага</h1>
          <p className="text-muted-foreground">
            Системийн админ хэрэглэгчдийг энд удирдана.
          </p>
        </div>
        <Input
          type="search"
          placeholder="Хайх..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button
          onClick={() => {
            resetForm();
            setEditingAdmin(null);
            setShowModal(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Шинэ админ
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Нэр</TableHead>
              <TableHead>И-мэйл</TableHead>
              <TableHead>Эрх</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="text-center">Үүссэн</TableHead>
              <TableHead className="text-center">Үйлдэл</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? [...Array(pageSize)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={7}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              : currentData.map((admin, index) => (
                  <TableRow key={admin.id}>
                    <TableCell>
                      {(currentPage - 1) * pageSize + index + 1}
                    </TableCell>
                    <TableCell>{admin.name}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>
                      {admin.role === "super_admin" ? "Супер админ" : "Админ"}
                    </TableCell>
                    <TableCell>
                      {admin.is_active ? "Идэвхтэй" : "Идэвхгүй"}
                    </TableCell>
                    <TableCell>
                      {new Date(admin.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(admin)}
                      >
                        <Edit className="h-4 w-4 text-primary-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setResetPasswordAdmin(admin);
                          setShowPasswordModal(true);
                        }}
                      >
                        <Key className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setAdminToDelete(admin);
                          setShowDeleteDialog(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center items-center gap-2 pt-4">
        <Button
          variant="outline"
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Өмнөх
        </Button>
        <span>
          {currentPage} / {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Дараах
        </Button>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAdmin ? "Админ засах" : "Шинэ админ"}
            </DialogTitle>
            <DialogDescription>Админы мэдээллийг бөглөнө үү.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Нэр</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">И-мэйл</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            {!editingAdmin && (
              <div className="space-y-2">
                <Label htmlFor="password">Нууц үг</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="role">Эрх</Label>
              <select
                id="role"
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value as AdminRole,
                  })
                }
              >
                <option value="admin">Админ</option>
                <option value="super_admin">Супер админ</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(v) =>
                  setFormData({ ...formData, is_active: !!v })
                }
              />
              <Label htmlFor="is_active">Идэвхтэй</Label>
            </div>
            <DialogFooter className="pt-4">
              <Button type="submit" className="w-full">
                {editingAdmin ? "Засах" : "Нэмэх"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Нууц үг солих</DialogTitle>
            <DialogDescription>
              {resetPasswordAdmin?.name} админы шинэ нууц үгийг оруулна уу.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">Шинэ нууц үг</Label>
              <Input
                id="new-password"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Баталгаажуулах</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                required
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="submit" className="w-full">
                Солих
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Устгах уу?</DialogTitle>
            <DialogDescription>
              Та {adminToDelete?.name} админыг устгахдаа итгэлтэй байна уу?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Болих
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Устгах
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminsManager;
