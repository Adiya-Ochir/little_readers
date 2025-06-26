import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import {
  BookOpen,
  Users,
  Settings,
  BarChart3,
  FileText,
  Brain,
  Lightbulb,
  Download,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import DashboardHome from "../components/dashboard/DashboardHome";
import BooksManager from "../components/dashboard/BooksManager";
import CategoriesManager from "../components/dashboard/CategoriesManager";
import AdminsManager from "../components/dashboard/AdminsManager";
import DevelopmentManager from "@/components/dashboard/DevelopmentManager";

interface Admin {
  name: string;
  role: "admin" | "super_admin";
}

const Dashboard: React.FC = () => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const adminData = localStorage.getItem("admin");

    if (!token || !adminData) {
      window.location.href = "/admin/login";
      return;
    }

    setAdmin(JSON.parse(adminData));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    window.location.href = "/admin/login";
  };

  if (!admin) {
    return <div>Loading...</div>;
  }

  const navigation: {
    name: string;
    href: string;
    icon: React.ElementType;
  }[] = [
    { name: "Нүүр хуудас", href: "/admin/dashboard", icon: BarChart3 },
    { name: "Номнууд", href: "/admin/books", icon: BookOpen },
    { name: "Ангилал", href: "/admin/categories", icon: FileText },
    { name: "Хөгжлийн чиглэл", href: "/admin/development", icon: Brain },
    { name: "Уншлагын зөвлөгөө", href: "/admin/tips", icon: Lightbulb },
    { name: "Материалууд", href: "/admin/resources", icon: Download },
    ...(admin.role === "super_admin"
      ? [{ name: "Админууд", href: "/admin/admins", icon: Users }]
      : []),
    { name: "Тохиргоо", href: "/admin/settings", icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="h-screen flex overflow-hidden bg-muted">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-background shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <div className="flex items-center">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="ml-2 text-lg font-semibold">Админ самбар</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-muted-foreground"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-4 px-2 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all ${
                isActive(item.href)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="h-4 w-4 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium">{admin.name}</p>
              <p className="text-xs text-muted-foreground">
                {admin.role === "super_admin" ? "Супер админ" : "Админ"}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="ml-3 p-2 rounded-md text-muted-foreground"
              title="Гарах"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="bg-background border-b shadow-sm lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-muted-foreground"
            >
              <Menu className="h-6 w-6" />
            </button>
            <span className="text-lg font-semibold">Админ самбар</span>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Routes>
                <Route
                  path="/"
                  element={<Navigate to="/admin/dashboard" replace />}
                />
                <Route
                  path="/dashboard"
                  element={<DashboardHome admin={admin} />}
                />
                <Route path="/books" element={<BooksManager />} />
                <Route path="/categories" element={<CategoriesManager />} />
                <Route path="/development" element={<DevelopmentManager />} />
                {admin.role === "super_admin" && (
                  <Route path="/admins" element={<AdminsManager />} />
                )}
                <Route path="*" element={<div>Page not found</div>} />
              </Routes>
            </div>
          </div>
        </main>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
