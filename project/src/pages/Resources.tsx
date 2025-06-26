import React, { useState, useEffect } from 'react';
import { Download, ExternalLink, FileText, Video, Headphones, Image } from 'lucide-react';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/public/resources');
      const data = await response.json();
      setResources(data.resources || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
      // Fallback to static data if API fails
      setResources([
        {
          id: 1,
          title: 'Уншлагын хуваарийн загвар',
          type: 'template',
          description: 'Долоо хоног бүрийн уншлагын хуваарь гаргахад туслах загвар',
          download_url: '#',
          category: 'planning'
        },
        {
          id: 2,
          title: 'Хүүхдийн хөгжлийн шалгуур',
          type: 'guide',
          description: 'Насны бүлэг тус бүрийн хөгжлийн шалгуур үзүүлэлтүүд',
          download_url: '#',
          category: 'development'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'template':
      case 'guide':
        return FileText;
      case 'audio':
        return Headphones;
      case 'video':
        return Video;
      case 'image':
        return Image;
      case 'list':
        return ExternalLink;
      default:
        return FileText;
    }
  };

  const categories = [
    { id: 'planning', name: 'Төлөвлөлт', color: 'primary' },
    { id: 'development', name: 'Хөгжил', color: 'secondary' },
    { id: 'techniques', name: 'Арга техник', color: 'primary' },
    { id: 'shopping', name: 'Худалдан авалт', color: 'secondary' },
    { id: 'environment', name: 'Орчин', color: 'primary' }
  ];

  const tips = [
    {
      title: 'Гэрийн номын сан бүтээх',
      description: 'Хүүхдэдээ зориулсан номын сан бүтээж, уншлагын орчинг бэлтгэх арга замууд',
      points: [
        'Хүүхдийн гарт хүрэх газар номыг байрлуулах',
        'Өнгө аястай, сонирхолтой номыг сонгох',
        'Тогтмол шинэ ном нэмж байх',
        'Хүүхдийг ном сонгоход оролцуулах'
      ]
    },
    {
      title: 'Уншлагын дадал үүсгэх',
      description: 'Хүүхдэд уншлагын тогтмол дадал үүсгэх практик зөвлөгөөнүүд',
      points: [
        'Өдөр бүр тогтсон цагт уншах',
        'Уншлагыг шагнал болгон ашиглах',
        'Өөрөө жишээ үзүүлэх',
        'Уншсан номын талаар ярилцах'
      ]
    },
    {
      title: 'Технологи ашиглах',
      description: 'Орчин үеийн технологийг уншлагад хэрхэн ашиглах талаар',
      points: [
        'Аудио номыг сонсох',
        'Интерактив номын апп ашиглах',
        'Е-ном, цахим номын сан ашиглах',
        'Уншлагын тоглоом, дасгал хийх'
      ]
    }
  ];

  const getCategoryName = (category) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.name : category;
  };

  if (loading) {
    return (
      <div className="gradient-bg min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="gradient-bg min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Материал ба зөвлөмж
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Эцэг эхчүүдэд зориулсан хэрэгтэй материал, загвар, зөвлөмжүүд
          </p>
        </div>

        {/* Categories */}
        <section className="mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`bg-${category.color}-100 text-${category.color}-700 px-4 py-2 rounded-full text-sm font-medium`}
              >
                {category.name}
              </div>
            ))}
          </div>
        </section>

        {/* Resources Grid */}
        <section className="mb-20">
          <h2 className="section-title">Татаж авах материалууд</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((resource) => {
              const IconComponent = getIcon(resource.type);
              return (
                <div key={resource.id} className="card p-6 group hover:scale-105 transition-transform duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <IconComponent className="h-8 w-8 text-primary-500" />
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {getCategoryName(resource.category)}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors">
                    {resource.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {resource.description}
                  </p>
                  
                  <button className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
                    <Download className="h-4 w-4 mr-2" />
                    Татаж авах
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Tips Section */}
        <section className="mb-20">
          <h2 className="section-title">Практик зөвлөгөөнүүд</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {tips.map((tip, index) => (
              <div key={index} className="card p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {tip.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {tip.description}
                </p>
                <ul className="space-y-2">
                  {tip.points.map((point, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start">
                      <span className="text-primary-500 mr-2">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Түгээмэл асуултууд
          </h2>
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Хэдэн настай хүүхдэд ном уншиж эхлэх вэ?
              </h3>
              <p className="text-gray-600">
                Хүүхэд төрсөн цагаасаа эхлэн ном уншиж өгч болно. Жирэмсэн үед ч гэсэн 
                хүүхэд дуу авиаг сонсдог тул энэ үеэс эхлэж болно.
              </p>
            </div>
            
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Хүүхэд анхаарал хандуулахгүй байвал яах вэ?
              </h3>
              <p className="text-gray-600">
                Энэ нь хэвийн үзэгдэл. Хүүхдийг албадахгүйгээр, өөр цагт дахин оролдоно уу. 
                Интерактив байдлаар уншиж, хүүхдийг оролцуулахыг хичээнэ үү.
              </p>
            </div>
            
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Өдөрт хэр удаан ном уншиж өгөх хэрэгтэй вэ?
              </h3>
              <p className="text-gray-600">
                Хүүхдийн наснаас хамаарна. Бага насны хүүхдэд 5-10 минут, том хүүхдэд 
                15-30 минут хангалттай. Чанар нь хугацаанаас чухал.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Ижил номыг дахин дахин уншиж өгөх нь зөв үү?
              </h3>
              <p className="text-gray-600">
                Тийм ээ, энэ нь маш сайн. Хүүхэд дуртай номоо дахин дахин сонсох дуртай байдаг. 
                Энэ нь тэдний хэл, ойлголтыг хөгжүүлэхэд тусалдаг.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Resources;