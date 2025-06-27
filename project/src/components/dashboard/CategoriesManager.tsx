// components/admin/CategoriesManager.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Category {
  id: string;
  value: string;
  label: string;
  description?: string;
  is_active: boolean;
}

const CategoriesManager = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<Omit<Category, "id">>({
    value: "",
    label: "",
    description: "",
    is_active: true,
  });
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );

  const { toast } = useToast();

  const fetchCategories = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Алдаа",
        description: "Ангилал татахад алдаа гарлаа",
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const url = editingCategory
        ? `http://localhost:5000/api/categories/${editingCategory.id}`
        : "http://localhost:5000/api/categories";
      const method = editingCategory ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowModal(false);
        setEditingCategory(null);
        resetForm();
        fetchCategories();
        toast({
          title: editingCategory ? "Засагдлаа" : "Нэмэгдлээ",
          description: editingCategory
            ? "Ангилал амжилттай засагдлаа."
            : "Ангилал амжилттай нэмэгдлээ.",
          duration: 2000,
          variant: "success",
        });
      } else {
        toast({
          title: "Алдаа",
          description: "Хадгалах үед алдаа гарлаа",
          variant: "destructive",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Error saving category:", error);
      toast({
        title: "Алдаа",
        description: "Хадгалах үед алдаа гарлаа",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/categories/${categoryToDelete.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        fetchCategories();
        toast({
          title: "Устгалаа",
          description: "Ангилал устгагдлаа.",
          duration: 2000,
          variant: "success",
        });
      } else {
        toast({
          title: "Алдаа",
          description: "Устгах үед алдаа гарлаа",
          variant: "destructive",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Алдаа",
        description: "Устгах үед алдаа гарлаа",
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setShowDeleteDialog(false);
      setCategoryToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({
      value: "",
      label: "",
      description: "",
      is_active: true,
    });
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      value: category.value,
      label: category.label,
      description: category.description || "",
      is_active: category.is_active,
    });
    setShowModal(true);
  };

  const filtered = categories.filter(
    (c) =>
      c.label.toLowerCase().includes(search.toLowerCase()) ||
      c.value.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / pageSize);
  const currentData = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6 px-4 md:px-8 lg:px-16 py-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-blue-600">
            Ангиллын удирдлага
          </h1>
          <p className="text-muted-foreground text-sm text-black">
            Ангилал нэмэх, засах, устгах
          </p>
        </div>
        <Input
          type="search"
          placeholder="Хайх..."
          className="max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          onClick={() => {
            resetForm();
            setEditingCategory(null);
            setShowModal(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" /> Шинэ ангилал
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table className="border border-gray-300">
          <TableHeader>
            <TableRow className="[&>th]:border-r [&>th]:border-gray-200">
              <TableHead>#</TableHead>
              <TableHead>Нэр</TableHead>
              <TableHead>Утга</TableHead>
              <TableHead>Тайлбар</TableHead>
              <TableHead className="text-center">Статус</TableHead>
              <TableHead className="text-center">Үйлдэл</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? [...Array(pageSize)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={6}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              : currentData.map((category, index) => (
                  <TableRow
                    key={category.id}
                    className="[&>td]:border-r [&>td]:border-gray-200"
                  >
                    <TableCell>
                      {(currentPage - 1) * pageSize + index + 1}
                    </TableCell>
                    <TableCell>{category.label}</TableCell>
                    <TableCell>{category.value}</TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          category.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {category.is_active ? "Идэвхтэй" : "Идэвхгүй"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit className="w-4 h-4 text-primary-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setCategoryToDelete(category);
                            setShowDeleteDialog(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
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
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Ангилал засах" : "Шинэ ангилал нэмэх"}
            </DialogTitle>
            <DialogDescription>
              Мэдээллийг үнэн зөв бөглөнө үү
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="label">Нэр</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="value">Утга (Англи)</Label>
              <Input
                id="value"
                value={formData.value}
                onChange={(e) =>
                  setFormData({ ...formData, value: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Тайлбар</Label>
              <textarea
                id="description"
                rows={3}
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
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
                {editingCategory ? "Засах" : "Нэмэх"}
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
              Та{" "}
              <span className="font-semibold">
                {categoryToDelete?.label || "энэ ангиллыг"}
              </span>{" "}
              ангилалыг устгахдаа итгэлтэй байна уу?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Болих
            </Button>
            <Button variant="destructive" onClick={confirmDeleteCategory}>
              Устгах
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoriesManager;
