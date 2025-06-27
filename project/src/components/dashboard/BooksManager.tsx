// components/admin/BooksManager.tsx
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Edit, Eye, EyeOff, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Book {
  id: string;
  title: string;
  author: string;
  age: string;
  category: string;
  rating: number;
  image?: string;
  description?: string;
  benefits: string[];
  is_featured: boolean;
  is_active: boolean;
}

interface Category {
  id: string;
  label: string;
  value: string;
}

const BooksManager = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState<Omit<Book, "id">>({
    title: "",
    author: "",
    age: "",
    category: "",
    rating: 5,
    image: "",
    description: "",
    benefits: [],
    is_featured: false,
    is_active: true,
  });
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  const fetchBooks = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/books", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setBooks(data.books || []);
    setLoading(false);
  };

  const fetchCategories = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/categories", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setCategories(data.categories || []);
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormData({ ...book });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingBook(null);
    setFormData({
      title: "",
      author: "",
      age: "",
      category: "",
      rating: 5,
      image: "",
      description: "",
      benefits: [],
      is_featured: false,
      is_active: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const url = editingBook
      ? `http://localhost:5000/api/books/${editingBook.id}`
      : "http://localhost:5000/api/books";
    const method = editingBook ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      toast({
        title: "Амжилттай",
        description: "Мэдээлэл хадгалагдлаа",
        duration: 2000,
        variant: "success",
      });
      fetchBooks();
      setShowModal(false);
      resetForm();
    }
  };

  const confirmDeleteBook = async () => {
    if (!bookToDelete) return;
    const token = localStorage.getItem("token");
    const res = await fetch(
      `http://localhost:5000/api/books/${bookToDelete.id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (res.ok) {
      toast({ title: "Устгагдлаа", duration: 2000, variant: "success" });
      fetchBooks();
    }
    setShowDeleteDialog(false);
    setBookToDelete(null);
  };

  const toggleStatus = async (id: string) => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `http://localhost:5000/api/books/${id}/toggle-status`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (res.ok) fetchBooks();
  };

  const filtered = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
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
            Номын удирдлага
          </h1>
          <p className="text-muted-foreground text-sm text-black">
            Ном нэмэх, засах, устгах
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
            setShowModal(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" /> Ном нэмэх
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table className="border border-gray-300">
          <TableHeader>
            <TableRow className="[&>th]:border-r [&>th]:border-gray-200">
              <TableHead>#</TableHead>
              <TableHead>Ном</TableHead>
              <TableHead>Зохиолч</TableHead>
              <TableHead>Ангилал</TableHead>
              <TableHead>Нас</TableHead>
              <TableHead className="text-center">Статус</TableHead>
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
              : currentData.map((book, index) => (
                  <TableRow
                    key={book.id}
                    className="[&>td]:border-r [&>td]:border-gray-200"
                  >
                    <TableCell>
                      {(currentPage - 1) * pageSize + index + 1}
                    </TableCell>
                    <TableCell>{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>
                      {categories.find((c) => c.value === book.category)
                        ?.label || book.category}
                    </TableCell>
                    <TableCell>{book.age}</TableCell>
                    <TableCell>
                      <span
                        className={
                          book.is_active
                            ? "text-green-600 font-medium"
                            : "text-red-600 font-medium"
                        }
                      >
                        {book.is_active ? "Идэвхтэй" : "Идэвхгүй"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(book)}
                      >
                        <Edit className="w-4 h-4 text-primary-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleStatus(book.id)}
                      >
                        {book.is_active ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setBookToDelete(book);
                          setShowDeleteDialog(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
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
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBook ? "Ном засах" : "Ном нэмэх"}</DialogTitle>
            <DialogDescription>
              Мэдээллийг үнэн зөв бөглөнө үү
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Номын нэр</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="author">Зохиолч</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Ангилал</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Сонгох" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="age">Насны бүлэг</Label>
                <Input
                  id="age"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="image">Зураг (URL)</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="description">Тайлбар</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="benefits">Ашиг тус (шугам мөрөөр)</Label>
              <Textarea
                id="benefits"
                value={formData.benefits.join("\n")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    benefits: e.target.value.split("\n"),
                  })
                }
              />
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(v) =>
                    setFormData({ ...formData, is_featured: !!v })
                  }
                />
                <Label htmlFor="is_featured">Онцлох</Label>
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
            </div>
            <DialogFooter className="pt-4">
              <Button type="submit">{editingBook ? "Засах" : "Нэмэх"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Ном устгах уу?</DialogTitle>
            <DialogDescription>
              Та{" "}
              <span className="font-semibold">
                {bookToDelete?.title || "энэ номыг"}
              </span>{" "}
              номыг устгахдаа итгэлтэй байна уу?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Болих
            </Button>
            <Button variant="destructive" onClick={confirmDeleteBook}>
              Устгах
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BooksManager;
