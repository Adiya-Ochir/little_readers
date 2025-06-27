import React, { useEffect, useState } from "react";
import {
  Download,
  ExternalLink,
  FileText,
  Video,
  Headphones,
  Image,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type Resource = {
  id: number;
  title: string;
  type: string;
  description: string;
  download_url: string;
  category: string;
};

type Tip = {
  title: string;
  description: string;
  points: string[];
};

type Category = {
  id: string;
  name: string;
  color: "primary" | "secondary";
};

const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  const categories: Category[] = [
    { id: "planning", name: "Төлөвлөлт", color: "primary" },
    { id: "development", name: "Хөгжил", color: "secondary" },
    { id: "techniques", name: "Арга техник", color: "primary" },
    { id: "shopping", name: "Худалдан авалт", color: "secondary" },
    { id: "environment", name: "Орчин", color: "primary" },
  ];

  const tips: Tip[] = [
    {
      title: "Гэрийн номын сан бүтээх",
      description:
        "Хүүхдэдээ зориулсан номын сан бүтээж, уншлагын орчинг бэлтгэх арга замууд",
      points: [
        "Хүүхдийн гарт хүрэх газар номыг байрлуулах",
        "Өнгө аястай, сонирхолтой номыг сонгох",
        "Тогтмол шинэ ном нэмж байх",
        "Хүүхдийг ном сонгоход оролцуулах",
      ],
    },
    {
      title: "Уншлагын дадал үүсгэх",
      description: "Хүүхдэд уншлагын тогтмол дадал үүсгэх практик зөвлөгөөнүүд",
      points: [
        "Өдөр бүр тогтсон цагт уншах",
        "Уншлагыг шагнал болгон ашиглах",
        "Өөрөө жишээ үзүүлэх",
        "Уншсан номын талаар ярилцах",
      ],
    },
    {
      title: "Технологи ашиглах",
      description: "Орчин үеийн технологийг уншлагад хэрхэн ашиглах талаар",
      points: [
        "Аудио номыг сонсох",
        "Интерактив номын апп ашиглах",
        "Е-ном, цахим номын сан ашиглах",
        "Уншлагын тоглоом, дасгал хийх",
      ],
    },
  ];

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/public/resources"
      );
      const data = await response.json();
      setResources(data.resources || []);
    } catch (error) {
      console.error("Error fetching resources:", error);
      setResources([
        {
          id: 1,
          title: "Уншлагын хуваарийн загвар",
          type: "template",
          description:
            "Долоо хоног бүрийн уншлагын хуваарь гаргахад туслах загвар",
          download_url: "#",
          category: "planning",
        },
        {
          id: 2,
          title: "Хүүхдийн хөгжлийн шалгуур",
          type: "guide",
          description: "Насны бүлэг тус бүрийн хөгжлийн шалгуур үзүүлэлтүүд",
          download_url: "#",
          category: "development",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "template":
      case "guide":
        return FileText;
      case "audio":
        return Headphones;
      case "video":
        return Video;
      case "image":
        return Image;
      case "list":
        return ExternalLink;
      default:
        return FileText;
    }
  };

  const getCategoryName = (category: string) => {
    const cat = categories.find((c) => c.id === category);
    return cat ? cat.name : category;
  };

  return (
    <div className="py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Материал ба зөвлөмж
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Эцэг эхчүүдэд зориулсан хэрэгтэй материал, загвар, зөвлөмжүүд
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((category) => (
            <span
              key={category.id}
              className={`bg-${category.color}-100 text-${category.color}-700 px-3 py-1 rounded-full text-sm font-medium`}
            >
              {category.name}
            </span>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold mb-6">Татаж авах материалууд</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {resources.map((resource) => {
                const IconComponent = getIcon(resource.type);
                return (
                  <Card
                    key={resource.id}
                    className="group hover:scale-[1.02] transition-transform"
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <IconComponent className="h-6 w-6 text-primary" />
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {getCategoryName(resource.category)}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold mb-1 text-gray-800">
                        {resource.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {resource.description}
                      </p>
                      <Button className="w-full">
                        <Download className="w-4 h-4 mr-2" /> Татаж авах
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold mb-6">Практик зөвлөгөөнүүд</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {tips.map((tip, index) => (
              <Card key={index} className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {tip.title}
                </h3>
                <p className="text-muted-foreground mb-4">{tip.description}</p>
                <ul className="space-y-2">
                  {tip.points.map((point, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-muted-foreground flex"
                    >
                      <span className="text-primary mr-2">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl p-8 shadow-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Түгээмэл асуултууд
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Хэдэн настай хүүхдэд ном уншиж эхлэх вэ?
              </h3>
              <p className="text-muted-foreground">
                Хүүхэд төрсөн цагаасаа эхлэн ном уншиж өгч болно. Жирэмсэн үед ч
                гэсэн хүүхэд дуу авиаг сонсдог тул энэ үеэс эхлэж болно.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Хүүхэд анхаарал хандуулахгүй байвал яах вэ?
              </h3>
              <p className="text-muted-foreground">
                Энэ нь хэвийн үзэгдэл. Хүүхдийг албадахгүйгээр, өөр цагт дахин
                оролдоно уу. Интерактив байдлаар уншиж, хүүхдийг оролцуулахыг
                хичээнэ үү.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Өдөрт хэр удаан ном уншиж өгөх хэрэгтэй вэ?
              </h3>
              <p className="text-muted-foreground">
                Хүүхдийн наснаас хамаарна. Бага насны хүүхдэд 5-10 минут, том
                хүүхдэд 15-30 минут хангалттай. Чанар нь хугацаанаас чухал.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Ижил номыг дахин дахин уншиж өгөх нь зөв үү?
              </h3>
              <p className="text-muted-foreground">
                Тийм ээ, энэ нь маш сайн. Хүүхэд дуртай номоо дахин дахин сонсох
                дуртай байдаг. Энэ нь тэдний хэл, ойлголтыг хөгжүүлэхэд
                тусалдаг.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
