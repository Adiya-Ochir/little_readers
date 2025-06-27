import React from "react";
import { BookOpen, Heart } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Бяцхан уншигчид</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Хүүхдийн уншлагын дадал болон хөгжилд туслах мэдээлэл, зөвлөгөө,
              материалуудыг нэг дор олж авах боломжтой платформ.
            </p>
          </div>

          {/* Links Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Холбоосууд</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/reading-tips"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  Уншлагын зөвлөгөө
                </a>
              </li>
              <li>
                <a
                  href="/development"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  Хүүхдийн хөгжил
                </a>
              </li>
              <li>
                <a
                  href="/books"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  Номын санал
                </a>
              </li>
              <li>
                <a
                  href="/resources"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  Материал
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Холбоо барих</h3>
            <p className="text-gray-300 text-sm mb-2">
              Асуулт, санал хүсэлт байвал бидэнтэй холбогдоорой.
            </p>
            <p className="text-gray-300 text-sm">
              И-мэйл: little.readers.mn@gmail.com
            </p>
            <p className="text-gray-300 text-sm">Утас: 95798979</p>
          </div>
        </div>

        <Separator className="bg-gray-700 my-8" />

        <div className="text-center">
          <p className="text-gray-300 text-sm flex items-center justify-center">
            Хүүхдийн уншлагын соёлыг дэмжиж байна
            <Heart className="h-4 w-4 text-red-400 mx-1" />© 2025 Бяцхан
            уншигчид
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
