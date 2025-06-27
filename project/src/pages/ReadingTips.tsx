"use client";

import React, { useEffect, useState } from "react";
import {
  Clock,
  Heart,
  Volume2,
  Smile,
  BookOpen,
  Users,
  HelpCircle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const iconMap = {
  Clock,
  Heart,
  Volume2,
  Smile,
  BookOpen,
  Users,
  HelpCircle,
};

interface ReadingTip {
  icon: keyof typeof iconMap;
  title: string;
  description: string;
  tips: string[];
}

interface AgeGroup {
  age: string;
  characteristics: string[];
  recommendations: string[];
}

interface TipsData {
  tips: ReadingTip[];
  ageGroups: AgeGroup[];
}

const ReadingTips = () => {
  const [data, setData] = useState<TipsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/public/reading-tips/full`
        );
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to fetch reading tips:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTips();
  }, []);

  return (
    <div className="gradient-bg min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Уншлагын зөвлөгөө
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Хүүхдэд ном уншиж өгөх арга барил, техникүүд болон насны онцлогийг
            харгалзсан зөвлөмжүүд
          </p>
        </div>

        {/* Tips */}
        <section className="mb-20">
          <h2 className="section-title">Үндсэн зөвлөгөөнүүд</h2>
          {loading || !data ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.tips.map((tip, index) => {
                const Icon = iconMap[tip.icon] || HelpCircle;
                return (
                  <div key={index} className="card p-6">
                    <Icon className="h-12 w-12 text-primary-500 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      {tip.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {tip.description}
                    </p>
                    <ul className="space-y-2">
                      {tip.tips.map((item, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-gray-600 flex items-start"
                        >
                          <span className="text-primary-500 mr-2">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Age Groups */}
        <section className="mb-20">
          <h2 className="section-title">Насны бүлгээр ангилсан зөвлөмж</h2>
          {loading || !data ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {data.ageGroups.map((group, index) => (
                <div key={index} className="card p-6">
                  <h3 className="text-2xl font-bold text-primary-600 mb-4">
                    {group.age}
                  </h3>

                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">
                      Онцлог шинж:
                    </h4>
                    <ul className="space-y-2">
                      {group.characteristics.map((char, idx) => (
                        <li
                          key={idx}
                          className="text-gray-600 flex items-start"
                        >
                          <span className="text-secondary-500 mr-2">•</span>
                          {char}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">
                      Зөвлөмж:
                    </h4>
                    <ul className="space-y-2">
                      {group.recommendations.map((rec, idx) => (
                        <li
                          key={idx}
                          className="text-gray-600 flex items-start"
                        >
                          <span className="text-primary-500 mr-2">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Common Mistakes */}
        <section className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Түгээмэл алдаанууд
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-red-600 mb-4">
                Хийж болохгүй зүйлс:
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span className="text-gray-600">
                    Хүүхэд сонсохгүй байхад албадах
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span className="text-gray-600">
                    Хурдан, тодорхойгүй унших
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span className="text-gray-600">
                    Насанд тохирохгүй ном сонгох
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span className="text-gray-600">
                    Анхаарал сарниулах орчинд унших
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-green-600 mb-4">
                Хийх хэрэгтэй зүйлс:
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">
                    Тэвчээртэй, урам зориг өгөх
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">Тод, аятайхан унших</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">
                    Хүүхдийн сонирхлыг харгалзах
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">
                    Тайван, тохиромжтой орчин бүтээх
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ReadingTips;
