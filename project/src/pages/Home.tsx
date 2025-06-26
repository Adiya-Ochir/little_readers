import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Star, TrendingUp, ArrowRight } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'Уншлагын зөвлөгөө',
      description: 'Хүүхдэд ном уншиж өгөх арга барил, техник, зөвлөгөөнүүд',
      link: '/reading-tips'
    },
    {
      icon: TrendingUp,
      title: 'Хүүхдийн хөгжил',
      description: 'Насны онцлог, хөгжлийн шат, сэтгэхүйн өөрчлөлтийн талаар',
      link: '/development'
    },
    {
      icon: Star,
      title: 'Номын санал',
      description: 'Насны бүлэг тус бүрт тохирсон сонгомол номнуудын жагсаалт',
      link: '/books'
    },
    {
      icon: Users,
      title: 'Материал',
      description: 'Эцэг эхчүүдэд зориулсан хэрэгтэй материал, зөвлөмж',
      link: '/resources'
    }
  ];

  return (
    <div className="gradient-bg">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            Хүүхдийн уншлагын 
            <span className="text-primary-600"> соёлыг </span>
            хөгжүүлье
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Хүүхдэд ном уншиж өгөх арга барил, хөгжлийн шатны онцлог, 
            тохирсон номнуудын санал зөвлөмжийг нэг дор олж авах боломжтой платформ
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/reading-tips" className="btn-primary">
              Уншлагын зөвлөгөө үзэх
            </Link>
            <Link to="/books" className="btn-secondary">
              Номын санал авах
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title">Бидний үйлчилгээ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Link key={index} to={feature.link} className="group">
                <div className="card p-6 h-full hover:scale-105 transition-transform duration-300">
                  <feature.icon className="h-12 w-12 text-primary-500 mb-4 group-hover:text-primary-600 transition-colors" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-primary-500 group-hover:text-primary-600 transition-colors">
                    <span className="text-sm font-medium">Дэлгэрэнгүй</span>
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title">Уншлагын ач холбогдол</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">85%</div>
              <p className="text-gray-600">Хүүхдийн тархины хөгжил 5 нас хүртэл дуусдаг</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">20 мин</div>
              <p className="text-gray-600">Өдөрт хүүхдэд ном уншиж өгөх хангалттай хугацаа</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">1000+</div>
              <p className="text-gray-600">Үг сонсох нь хүүхдийн хэлний хөгжилд тусалдаг</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Хүүхдийнхээ уншлагын аялалыг эхлүүлээрэй
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Өнөөдрөөс эхлэн хүүхдэдээ ном уншиж өгч, тэдний хөгжилд хувь нэмэр оруулаарай
          </p>
          <Link to="/reading-tips" className="btn-primary">
            Эхлэх
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;