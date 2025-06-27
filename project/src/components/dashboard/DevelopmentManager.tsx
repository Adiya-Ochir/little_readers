"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit } from "lucide-react";

interface DevelopmentArea {
  id: string;
  title: string;
  description: string;
  benefits: string[];
}

interface AgeGroup {
  id: string;
  label: string;
  description: string;
  characteristics: string[];
  reading_benefits: string[];
}

interface ReadingImpact {
  id: string;
  title: string;
  description: string;
}

type EditType = "developmentArea" | "ageGroup" | "readingImpact";
type EditableItem = DevelopmentArea | AgeGroup | ReadingImpact;
type FormState = Partial<DevelopmentArea & AgeGroup & ReadingImpact>;

interface CombinedData {
  developmentAreas: DevelopmentArea[];
  ageGroups: AgeGroup[];
  readingImpacts: ReadingImpact[];
}

const DevelopmentManager: React.FC = () => {
  const [data, setData] = useState<CombinedData>({
    developmentAreas: [],
    ageGroups: [],
    readingImpacts: [],
  });
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editType, setEditType] = useState<EditType | null>(null);
  const [editingItem, setEditingItem] = useState<EditableItem | null>(null);
  const [formData, setFormData] = useState<FormState>({});
  const { toast } = useToast();

  const getToken = () => localStorage.getItem("token");

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/public/development/all`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Амжилтгүй хүсэлт");
      setData(json);
    } catch (e) {
      console.error(e);
      toast({
        title: "Алдаа",
        description: "Өгөгдөл татаж чадсангүй",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openEditDialog = (type: EditType, item: EditableItem) => {
    setEditType(type);
    setEditingItem(item);
    setFormData({ ...item });
    setShowDialog(true);
  };

  const handleSave = async () => {
    if (!editType || !editingItem) return;
    let url = "";
    if (editType === "developmentArea") {
      url = `${import.meta.env.VITE_API_URL}/api/development-areas/${
        editingItem.id
      }`;
    } else if (editType === "ageGroup") {
      url = `${import.meta.env.VITE_API_URL}/api/age-groups/${editingItem.id}`;
    } else if (editType === "readingImpact") {
      url = `${import.meta.env.VITE_API_URL}/api/reading-impacts/${
        editingItem.id
      }`;
    }

    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save changes");
      setShowDialog(false);
      fetchData();
      toast({
        title: "Амжилттай",
        description: "Хадгалагдлаа",
        variant: "success",
      });
    } catch (e) {
      console.error(e);
      toast({
        title: "Алдаа",
        description: "Хадгалах үед алдаа гарлаа",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-lg md:text-xl font-semibold text-blue-600">
        Хөгжлийн удирдлага
      </h1>
      {loading ? (
        <Skeleton className="h-12 w-full" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/** Development Areas */}
          <div className="overflow-x-auto">
            <h2 className="text-base md:text-lg font-bold mb-2">
              Хөгжлийн чиглэлүүд
            </h2>
            <Table className="border border-gray-300">
              <TableHeader>
                <TableRow className="[&>th]:border-r [&>th]:border-gray-200">
                  <TableHead>№</TableHead>
                  <TableHead>Гарчиг</TableHead>
                  <TableHead>Тайлбар</TableHead>
                  <TableHead>Үйлдэл</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.developmentAreas.map((item, index) => (
                  <TableRow
                    key={item.id}
                    className="[&>td]:border-r [&>td]:border-gray-200"
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog("developmentArea", item)}
                      >
                        <Edit className="w-4 h-4 text-primary-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/** Reading Impacts */}
          <div className="overflow-x-auto">
            <h2 className="text-base md:text-lg font-bold mb-2">
              Уншлагын нөлөө
            </h2>
            <Table className="border border-gray-300">
              <TableHeader>
                <TableRow className="[&>th]:border-r [&>th]:border-gray-200">
                  <TableHead>№</TableHead>
                  <TableHead>Гарчиг</TableHead>
                  <TableHead>Тайлбар</TableHead>
                  <TableHead>Үйлдэл</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.readingImpacts.map((item, index) => (
                  <TableRow
                    key={item.id}
                    className="[&>td]:border-r [&>td]:border-gray-200"
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog("readingImpact", item)}
                      >
                        <Edit className="w-4 h-4 text-primary-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/** Age Groups */}
          <div className="overflow-x-auto md:col-span-2">
            <h2 className="text-base md:text-lg font-bold mb-2">
              Насны бүлгүүд
            </h2>
            <Table className="border border-gray-300">
              <TableHeader>
                <TableRow className="[&>th]:border-r [&>th]:border-gray-200">
                  <TableHead>№</TableHead>
                  <TableHead>Нас</TableHead>
                  <TableHead>Онцлог шинж</TableHead>
                  <TableHead>Ач тус</TableHead>
                  <TableHead>Үйлдэл</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.ageGroups.map((item, index) => (
                  <TableRow
                    key={item.id}
                    className="[&>td]:border-r [&>td]:border-gray-200"
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.label}</TableCell>
                    <TableCell>
                      <ul className="list-disc list-inside space-y-1">
                        {item.characteristics.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell>
                      <ul className="list-disc list-inside space-y-1">
                        {item.reading_benefits.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog("ageGroup", item)}
                      >
                        <Edit className="w-4 h-4 text-primary-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Мэдээлэл засах</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {editType === "developmentArea" && (
              <>
                <Label>Гарчиг</Label>
                <Input
                  className="w-full"
                  value={formData.title || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
                <Label>Тайлбар</Label>
                <Textarea
                  className="w-full"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
                <Label>Ач тусууд</Label>
                <Textarea
                  className="w-full"
                  value={(formData.benefits || []).join("\n")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      benefits: e.target.value.split("\n"),
                    })
                  }
                />
              </>
            )}

            {editType === "ageGroup" && (
              <>
                <Label>Насны бүлэг</Label>
                <Input
                  className="w-full"
                  value={formData.label || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, label: e.target.value })
                  }
                />
                <Label>Тайлбар</Label>
                <Textarea
                  className="w-full"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
                <Label>Онцлог шинжүүд</Label>
                <Textarea
                  className="w-full"
                  value={(formData.characteristics || []).join("\n")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      characteristics: e.target.value.split("\n"),
                    })
                  }
                />
                <Label>Ач тусууд</Label>
                <Textarea
                  className="w-full"
                  value={(formData.reading_benefits || []).join("\n")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      reading_benefits: e.target.value.split("\n"),
                    })
                  }
                />
              </>
            )}

            {editType === "readingImpact" && (
              <>
                <Label>Гарчиг</Label>
                <Input
                  className="w-full"
                  value={formData.title || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
                <Label>Тайлбар</Label>
                <Textarea
                  className="w-full"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleSave} className="w-full">
              Хадгалах
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DevelopmentManager;
