# Book Recommendation System

Хүүхдийн номын санал болон уншлагын зөвлөгөө өгөх систем

## Онцлогууд

- 📚 Номын санал (насны бүлгээр ангилсан)
- 💡 Уншлагын зөвлөгөө
- 🧠 Хүүхдийн хөгжлийн мэдээлэл
- 📁 Материал, зөвлөмжүүд
- 👨‍💼 Админ удирдлагын систем
- 🔐 Эрхийн удирдлага (Super Admin, Admin)

## Технологи

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- React Router
- Lucide React (icons)

### Backend
- Node.js
- Express.js
- Supabase (PostgreSQL)
- JWT Authentication
- bcryptjs

## Суулгах заавар

### 1. Суpabase тохиргоо

1. [Supabase](https://supabase.com) дээр бүртгүүлж шинэ төсөл үүсгэнэ үү
2. Database migrations-ыг ажиллуулна уу:
   ```bash
   # supabase/migrations/ дотор байгаа файлуудыг Supabase SQL Editor дээр ажиллуулна уу
   ```

### 2. Environment Variables

`.env` файл үүсгэж дараах мэдээллийг оруулна уу:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret_key
```

### 3. Dependencies суулгах

```bash
npm install
```

### 4. Серверийг эхлүүлэх

```bash
# Frontend (port 5173)
npm run dev

# Backend (port 5000)
npm run server

# Эсвэл development mode
npm run dev:server
```

## Админ нэвтрэх

Анхны админ хэрэглэгчид:

- **Super Admin**: superadmin@example.com / admin123
- **Admin**: admin@example.com / admin123

## API Endpoints

### Authentication
- `POST /api/auth/login` - Нэвтрэх
- `GET /api/auth/profile` - Профайл авах
- `PUT /api/auth/profile` - Профайл засах
- `PUT /api/auth/change-password` - Нууц үг солих

### Books
- `GET /api/books` - Номнуудын жагсаалт
- `POST /api/books` - Шинэ ном нэмэх
- `PUT /api/books/:id` - Ном засах
- `DELETE /api/books/:id` - Ном устгах
- `PATCH /api/books/:id/toggle-status` - Номын статус солих

### Categories
- `GET /api/categories` - Ангиллын жагсаалт
- `POST /api/categories` - Шинэ ангилал нэмэх
- `PUT /api/categories/:id` - Ангилал засах
- `DELETE /api/categories/:id` - Ангилал устгах

### Public API (Authentication шаардлагагүй)
- `GET /api/public/books` - Нийтэд зориулсан номнуудын жагсаалт
- `GET /api/public/categories` - Нийтэд зориулсан ангиллын жагсаалт
- `GET /api/public/development-areas` - Хөгжлийн чиглэлүүд
- `GET /api/public/reading-tips` - Уншлагын зөвлөгөөнүүд
- `GET /api/public/resources` - Материалууд

## Эрхийн удирдлага

### Super Admin
- Бүх админуудыг удирдах
- Бүх контентыг удирдах
- Системийн тохиргоо

### Admin
- Номнууд удирдах
- Ангиллууд удирдах
- Контент удирдах

## Хөгжүүлэлт

```bash
# Frontend development
npm run dev

# Backend development with auto-reload
npm run dev:server

# Build for production
npm run build

# Lint code
npm run lint
```

## Deployment

1. Frontend-ыг build хийнэ үү:
   ```bash
   npm run build
   ```

2. Backend серверийг deploy хийнэ үү (Heroku, Railway, гэх мэт)

3. Environment variables-ыг production дээр тохируулна уу

## Лиценз

MIT License