"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Users, FileText, Download } from "lucide-react";

interface Props {
  admin: {
    name: string;
    role: "admin" | "super_admin";
  };
}

const DashboardHome: React.FC<Props> = ({ admin }) => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalCategories: 0,
    totalResources: 0,
    totalAdmins: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const booksRes = await fetch("http://localhost:5000/api/books?limit=1", {
        headers,
      });
      const booksData = await booksRes.json();

      const categoriesRes = await fetch(
        "http://localhost:5000/api/categories",
        { headers }
      );
      const categoriesData = await categoriesRes.json();

      const resourcesRes = await fetch("http://localhost:5000/api/resources", {
        headers,
      });
      const resourcesData = await resourcesRes.json();

      let totalAdmins = 0;
      if (admin.role === "super_admin") {
        const adminsRes = await fetch("http://localhost:5000/api/admins", {
          headers,
        });
        const adminsData = await adminsRes.json();
        totalAdmins = adminsData.admins?.length || 0;
      }

      setStats({
        totalBooks: booksData.pagination?.total || 0,
        totalCategories: categoriesData.categories?.length || 0,
        totalResources: resourcesData.resources?.length || 0,
        totalAdmins,
      });
    } catch (err) {
      console.error("Failed to fetch stats", err);
    } finally {
      setLoading(false);
    }
  }, [admin.role]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const statCards = [
    {
      name: "Нийт номнууд",
      value: stats.totalBooks,
      icon: BookOpen,
      color: "bg-blue-500",
    },
    {
      name: "Ангиллууд",
      value: stats.totalCategories,
      icon: FileText,
      color: "bg-green-500",
    },
    {
      name: "Материалууд",
      value: stats.totalResources,
      icon: Download,
      color: "bg-purple-500",
    },
    ...(admin.role === "super_admin"
      ? [
          {
            name: "Админууд",
            value: stats.totalAdmins,
            icon: Users,
            color: "bg-yellow-500",
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6 px-4 py-6">
      <div>
        <h1 className="text-2xl font-bold">Сайн байна уу, {admin.name}!</h1>
        <p className="text-muted-foreground">Системийн ерөнхий статистик</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton key={idx} className="h-28 w-full rounded-xl" />
            ))
          : statCards.map((item) => (
              <Card key={item.name} className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {item.name}
                  </CardTitle>
                  <div className={`rounded-md p-2 ${item.color}`}>
                    <item.icon className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{item.value}</div>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  );
};

export default DashboardHome;
