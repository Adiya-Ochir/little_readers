"use client";

import React, { useEffect, useState } from "react";
import {
  Brain,
  Heart,
  Users,
  Zap,
  Target,
  Lightbulb,
  HelpCircle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const iconMap = {
  Brain,
  Heart,
  Users,
  Zap,
  Target,
  Lightbulb,
  HelpCircle, // fallback icon
};

interface DevelopmentArea {
  id: string;
  icon: keyof typeof iconMap;
  title: string;
  description: string;
  benefits: string[];
  color: string;
}

interface AgeGroup {
  id: string;
  value: string;
  label: string;
  min_age: number;
  max_age: number;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  characteristics: string[];
  reading_benefits: string[];
}
interface ReadingImpact {
  id: string;
  icon: keyof typeof iconMap;
  title: string;
  description: string;
}

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

const Development: React.FC = () => {
  const [developmentAreas, setDevelopmentAreas] = useState<
    DevelopmentArea[] | null
  >(null);
  const [ageGroups, setAgeGroups] = useState<AgeGroup[] | null>(null);
  const [readingImpacts, setReadingImpacts] = useState<ReadingImpact[] | null>(
    null
  );

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [areaRes, ageRes, impactRes] = await Promise.all([
          fetch(`${API_BASE}/public/development-areas`),
          fetch(`${API_BASE}/public/age-groups`),
          fetch(`${API_BASE}/public/reading-impacts`),
        ]);

        const areaJson = await areaRes.json();
        const ageJson = await ageRes.json();
        const impactJson = await impactRes.json();

        setDevelopmentAreas(areaJson?.developmentAreas || []);
        setAgeGroups(ageJson?.ageGroups || []);
        setReadingImpacts(impactJson?.readingImpacts || []);
      } catch (err) {
        console.error("Failed to fetch development data:", err);
      }
    };

    fetchAll();
  }, []);

  return (
    <div className="gradient-bg min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Хүүхдийн хөгжил
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Хүүхдийн хөгжлийн шат, онцлог болон уншлагын нөлөөллийн талаарх
            мэдээлэл
          </p>
        </div>

        {/* Development Areas */}
        <section className="mb-20">
          <h2 className="section-title">Хөгжлийн үндсэн чиглэлүүд</h2>
          {!developmentAreas ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {developmentAreas.map((area) => {
                const Icon = iconMap[area.icon] || HelpCircle;

                return (
                  <div key={area.id} className="card p-6">
                    <Icon className={`h-12 w-12 text-${area.color}-500 mb-4`} />
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      {area.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {area.description}
                    </p>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Уншлагын ач тус:
                      </h4>
                      <ul className="space-y-1">
                        {(area.benefits || []).map((benefit, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-gray-600 flex items-start"
                          >
                            <span className={`text-${area.color}-500 mr-2`}>
                              •
                            </span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Age Groups */}
        <section className="mb-20">
          <h2 className="section-title">Насны шатны онцлог</h2>
          {!ageGroups ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <div className="space-y-8">
              {ageGroups.map((stage) => (
                <div key={stage.id} className="card p-8">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
                    <div className="lg:w-1/3 mb-6 lg:mb-0">
                      <h3 className="text-2xl font-bold text-primary-600 mb-2">
                        {stage.label}
                      </h3>
                      <h4 className="text-xl font-semibold text-gray-800 mb-4">
                        {stage.description}
                      </h4>
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-2">
                          Онцлог шинж:
                        </h5>
                        <ul className="space-y-1">
                          {(stage.characteristics || []).map((char, idx) => (
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
                    </div>
                    <div className="lg:w-2/3">
                      <h5 className="font-semibold text-gray-800 mb-3">
                        Уншлагын ач тус энэ насанд:
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(stage.reading_benefits || []).map((benefit, idx) => (
                          <div
                            key={idx}
                            className="bg-primary-50 p-4 rounded-lg"
                          >
                            <p className="text-gray-700 flex items-start">
                              <span className="text-primary-500 mr-2">✓</span>
                              {benefit}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Reading Impacts */}
        <section>
          <h2 className="section-title">Уншлагын нөлөө</h2>
          {!readingImpacts ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {readingImpacts.map((impact) => {
                const Icon = iconMap[impact.icon] || HelpCircle;
                return (
                  <div key={impact.id} className="card p-6 text-center">
                    <Icon className="h-16 w-16 text-primary-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      {impact.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {impact.description}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Development;
