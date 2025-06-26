import React from 'react';
import { Clock, Heart, Volume2, Smile, BookOpen, Users } from 'lucide-react';

const ReadingTips = () => {
  const tips = [
    {
      icon: Clock,
      title: 'Тогтмол цаг гаргах',
      description: 'Өдөр бүр тогтсон цагт ном уншиж өгөх дадал үүсгэх нь чухал. Орой унтахын өмнө эсвэл өглөө сэрсний дараа тогтсон цагт уншаарай.',
      tips: [
        'Өдөрт 15-20 минут хангалттай',
        'Тогтсон цагт уншах дадал үүсгэх',
        'Хүүхэд ядарсан үед албадахгүй байх'
      ]
    },
    {
      icon: Heart,
      title: 'Сонирхолтой орчин бүтээх',
      description: 'Уншлагыг хүүхдэд таатай, сонирхолтой болгохын тулд тохиромжтой орчин бүтээх хэрэгтэй.',
      tips: [
        'Тайван, гэрэлтэй газар сонгох',
        'Хамтдаа суух тохиромжтой газар бэлтгэх',
        'Телевиз, утас зэрэг анхаарал сарниулах зүйлсийг хаах'
      ]
    },
    {
      icon: Volume2,
      title: 'Дуу хоолойгоо өөрчлөх',
      description: 'Өөр өөр дүрийн хувьд дуу хоолойгоо өөрчлөн уншвал хүүхэд илүү сонирхон сонсоно.',
      tips: [
        'Дүр тус бүрт өөр дуу хоолой ашиглах',
        'Инээд, гайхшрал зэрэг сэтгэл хөдлөлийг илэрхийлэх',
        'Хүүхдийг дуурайлгах, хамт дуулахыг урих'
      ]
    },
    {
      icon: Smile,
      title: 'Интерактив байх',
      description: 'Зөвхөн уншихаас гадна хүүхэдтэй ярилцаж, асуулт асууж, санал бодлыг нь сонсох.',
      tips: [
        'Зургийн талаар асуулт асуух',
        'Дараа нь юу болох талаар таамаглуулах',
        'Хүүхдийн санал бодлыг сонсох'
      ]
    },
    {
      icon: BookOpen,
      title: 'Зөв ном сонгох',
      description: 'Хүүхдийн нас, сонирхол, хөгжлийн түвшинд тохирсон ном сонгох нь чухал.',
      tips: [
        'Насанд тохирсон агуулга сонгох',
        'Зургийн чанар сайн номыг сонгох',
        'Хүүхдийн сонирхлыг харгалзах'
      ]
    },
    {
      icon: Users,
      title: 'Хамтдаа оролцох',
      description: 'Гэр бүлийн бүх гишүүн уншлагын үйл ажиллагаанд оролцох нь чухал.',
      tips: [
        'Эцэг эх хоёулаа ном уншиж өгөх',
        'Ах эгч нар хамт оролцуулах',
        'Номын талаар гэр бүлээрээ ярилцах'
      ]
    }
  ];

  const ageGroups = [
    {
      age: '0-2 нас',
      characteristics: [
        'Өнгө, дуу авиа сонирхдог',
        'Богино анхаарал',
        'Зургийг илүү их харах дуртай'
      ],
      recommendations: [
        'Том зурагтай ном',
        'Хүрэх боломжтой материалаар хийсэн',
        '5-10 минут уншах'
      ]
    },
    {
      age: '3-5 нас',
      characteristics: [
        'Түүх сонсох дуртай',
        'Асуулт их асуудаг',
        'Дүрд нэрлэх дуртай'
      ],
      recommendations: [
        'Энгийн үйл явдалтай түүх',
        'Давтагдах хэсэг бүхий ном',
        '15-20 минут уншах'
      ]
    },
    {
      age: '6-8 нас',
      characteristics: [
        'Өөрөө уншиж сурч байгаа',
        'Илүү урт түүх сонсох чаддаг',
        'Дүрүүдтэй өөрийгөө адилтгах'
      ],
      recommendations: [
        'Илүү нарийвчилсан түүх',
        'Цуврал номнууд',
        '20-30 минут уншах'
      ]
    }
  ];

  return (
    <div className="gradient-bg min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Уншлагын зөвлөгөө
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Хүүхдэд ном уншиж өгөх арга барил, техникүүд болон насны онцлогийг харгалзсан зөвлөмжүүд
          </p>
        </div>

        {/* Reading Tips */}
        <section className="mb-20">
          <h2 className="section-title">Үндсэн зөвлөгөөнүүд</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tips.map((tip, index) => (
              <div key={index} className="card p-6">
                <tip.icon className="h-12 w-12 text-primary-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {tip.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {tip.description}
                </p>
                <ul className="space-y-2">
                  {tip.tips.map((item, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start">
                      <span className="text-primary-500 mr-2">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Age-specific recommendations */}
        <section className="mb-20">
          <h2 className="section-title">Насны бүлгээр ангилсан зөвлөмж</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {ageGroups.map((group, index) => (
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
                      <li key={idx} className="text-gray-600 flex items-start">
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
                      <li key={idx} className="text-gray-600 flex items-start">
                        <span className="text-primary-500 mr-2">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
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
                  <span className="text-gray-600">Хүүхэд сонсохгүй байхад албадах</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span className="text-gray-600">Хурдан, тодорхойгүй унших</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span className="text-gray-600">Насанд тохирохгүй ном сонгох</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span className="text-gray-600">Анхаарал сарниулах орчинд унших</span>
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
                  <span className="text-gray-600">Тэвчээртэй, урам зориг өгөх</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">Тод, аятайхан унших</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">Хүүхдийн сонирхлыг харгалзах</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">Тайван, тохиромжтой орчин бүтээх</span>
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