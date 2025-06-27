"use client";

import React, { useEffect, useState } from "react";
import { Star, Filter, BookOpen } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";

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
}

interface Option {
  value: string;
  label: string;
}

const BookRecommendations: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Option[]>([]);
  const [ageGroups, setAgeGroups] = useState<Option[]>([]);
  const [selectedAge, setSelectedAge] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const booksRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/public/books`
      );
      const booksData = await booksRes.json();
      setBooks(booksData.books || []);

      const categoriesRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/public/categories`
      );
      const categoriesData = await categoriesRes.json();
      setCategories([
        { value: "all", label: "Бүгд" },
        ...(categoriesData.categories || []),
      ]);

      const ageRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/public/age-groups`
      );
      const ageData = await ageRes.json();
      setAgeGroups([
        { value: "all", label: "Бүх нас" },
        ...(ageData.ageGroups || []),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
      // fallback
      setBooks([
        {
          id: "1",
          title: "Бяцхан Улаан Малгай",
          author: "Ардын үлгэр",
          age: "3-5",
          category: "fairy-tale",
          rating: 5,
          image:
            "https://images.pexels.com/photos/1741230/pexels-photo-1741230.jpeg",
          description:
            "Сонгодог ардын үлгэр. Хүүхдэд аюулгүй байдлын талаар заах сайхан түүх.",
          benefits: [
            "Аюулгүй байдлын ухамсар",
            "Сонсох чадвар",
            "Төсөөлөх чадвар",
          ],
        },
      ]);
      setCategories([
        { value: "all", label: "Бүгд" },
        { value: "fairy-tale", label: "Үлгэр" },
        { value: "educational", label: "Боловсролын" },
      ]);
      setAgeGroups([
        { value: "all", label: "Бүх нас" },
        { value: "0-2", label: "0-2 нас" },
        { value: "3-5", label: "3-5 нас" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter((book) => {
    const ageMatch =
      selectedAge === "all" || book.age.includes(selectedAge.split("-")[0]);
    const categoryMatch =
      selectedCategory === "all" || book.category === selectedCategory;
    return ageMatch && categoryMatch;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 flex justify-center items-center">
        <Skeleton className="h-32 w-32 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 md:px-12 space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Номын санал</h1>
        <p className="text-gray-600 text-lg">
          Насны бүлэг болон сэдвээр ангилсан хүүхдэд тохирсон номнуудын жагсаалт
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold">Шүүлтүүр</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Насны бүлэг</Label>
            <Select value={selectedAge} onValueChange={setSelectedAge}>
              <SelectTrigger>
                <SelectValue placeholder="Сонгох" />
              </SelectTrigger>
              <SelectContent>
                {ageGroups.map((g) => (
                  <SelectItem key={g.value} value={g.value}>
                    {g.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Ангилал</Label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Сонгох" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition group"
          >
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                {book.age} нас
              </span>
              <div className="flex">{renderStars(book.rating)}</div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary-600">
              {book.title}
            </h3>
            <p className="text-sm text-gray-500 mb-2">{book.author}</p>
            <p className="text-sm text-gray-600 mb-3">{book.description}</p>
            <div>
              <h4 className="text-sm font-medium text-gray-800 mb-1">
                Хөгжүүлэх чадварууд:
              </h4>
              <div className="flex flex-wrap gap-1">
                {book.benefits.map((b, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-secondary-100 text-secondary-700 px-2 py-1 rounded-full"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-16">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-lg text-gray-600">Ном олдсонгүй</p>
          <p className="text-gray-500 text-sm">
            Сонгосон шүүлтүүрт тохирох ном байхгүй байна
          </p>
        </div>
      )}
    </div>
  );
};

export default BookRecommendations;
