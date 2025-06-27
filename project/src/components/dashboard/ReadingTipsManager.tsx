"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit } from "lucide-react";

interface ReadingTip {
  id: string;
  icon: string;
  title: string;
  description: string;
  tips: string[];
}

interface AgeGroup {
  id: string;
  age: string;
  characteristics: string[];
  recommendations: string[];
}

type EditType = "readingTip" | "ageGroup";
type EditableItem = ReadingTip | AgeGroup;
type FormState = Partial<ReadingTip & AgeGroup>;

const ReadingTipsManager: React.FC = () => {
  const [tips, setTips] = useState<ReadingTip[]>([]);
  const [ageGroups, setAgeGroups] = useState<AgeGroup[]>([]);
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
        `${import.meta.env.VITE_API_URL}/api/public/reading-tips/full`
      );
      const json = await res.json();
      setTips(json.tips || []);
      setAgeGroups(json.ageGroups || []);
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
    if (editType === "readingTip") {
      url = `${import.meta.env.VITE_API_URL}/api/reading-tips/${
        editingItem.id
      }`;
    } else if (editType === "ageGroup") {
      url = `${import.meta.env.VITE_API_URL}/api/age-group2/${editingItem.id}`;
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
      toast({
        title: "Амжилттай",
        description: "Хадгалагдлаа",
        variant: "success",
      });
      setShowDialog(false);
      fetchData();
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
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-8">
      <h1 className="text-xl font-semibold text-blue-600">
        Уншлагын зөвлөгөө удирдах
      </h1>
      {loading ? (
        <Skeleton className="h-12 w-full" />
      ) : (
        <>
          {/* Reading Tips */}
          <div>
            <h2 className="text-lg font-bold mb-2">Зөвлөгөөнүүд</h2>
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
                {tips.map((tip, index) => (
                  <TableRow
                    key={tip.id}
                    className="[&>td]:border-r [&>td]:border-gray-200"
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{tip.title}</TableCell>
                    <TableCell>{tip.description}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog("readingTip", tip)}
                      >
                        <Edit className="w-4 h-4 text-primary-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Age Groups */}
          <div>
            <h2 className="text-lg font-bold mb-2">Насны бүлгүүд</h2>
            <Table className="border border-gray-300">
              <TableHeader>
                <TableRow className="[&>th]:border-r [&>th]:border-gray-200">
                  <TableHead>№</TableHead>
                  <TableHead>Нас</TableHead>
                  <TableHead>Онцлог шинж</TableHead>
                  <TableHead>Зөвлөмж</TableHead>
                  <TableHead>Үйлдэл</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ageGroups.map((group, index) => (
                  <TableRow
                    key={group.id}
                    className="[&>td]:border-r [&>td]:border-gray-200"
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{group.age}</TableCell>
                    <TableCell>
                      <ul className="list-disc list-inside">
                        {group.characteristics.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell>
                      <ul className="list-disc list-inside">
                        {group.recommendations.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog("ageGroup", group)}
                      >
                        <Edit className="w-4 h-4 text-primary-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Мэдээлэл засах</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {editType === "readingTip" && (
              <>
                <Label>Гарчиг</Label>
                <Input
                  value={formData.title || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
                <Label>Тайлбар</Label>
                <Textarea
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
                <Label>Зөвлөмжүүд</Label>
                <Textarea
                  value={(formData.tips || []).join("\n")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tips: e.target.value.split("\n"),
                    })
                  }
                />
              </>
            )}
            {editType === "ageGroup" && (
              <>
                <Label>Нас</Label>
                <Input
                  value={formData.age || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                />
                <Label>Онцлог шинжүүд</Label>
                <Textarea
                  value={(formData.characteristics || []).join("\n")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      characteristics: e.target.value.split("\n"),
                    })
                  }
                />
                <Label>Зөвлөмжүүд</Label>
                <Textarea
                  value={(formData.recommendations || []).join("\n")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      recommendations: e.target.value.split("\n"),
                    })
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

export default ReadingTipsManager;
