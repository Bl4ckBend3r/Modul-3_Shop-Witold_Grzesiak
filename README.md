# Sklep Next.js

Projekt e-commerce zrealizowany w ramach modułu 3 kursu.  
Aplikacja jest zbudowana w oparciu o **Next.js 15**, **TailwindCSS**, **Prisma ORM** oraz **PostgreSQL (NeonDB)**.  
Wdrożenie zostało zrealizowane na platformie **Vercel**.

---

## Linki

- **Aplikacja produkcyjna (Vercel)**: [https://modul-3-shop-witold-grzesiak.vercel.app](https://modul-3-shop-witold-grzesiak.vercel.app)  
- **Repozytorium kodu źródłowego**: [https://github.com/Bl4ckBend3r/sklep-next](https://github.com/Bl4ckBend3r/sklep-next)

---

## Stos technologiczny

- [Next.js 15](https://nextjs.org/) – framework React do SSR i aplikacji fullstack  
- [Tailwind CSS](https://tailwindcss.com/) – narzędzie do stylowania  
- [Prisma ORM](https://www.prisma.io/) – ORM dla bazy danych PostgreSQL  
- [NeonDB](https://neon.tech/) – baza danych PostgreSQL w chmurze  
- [NextAuth.js](https://next-auth.js.org/) – autoryzacja i obsługa użytkowników  
- [Cloudinary](https://cloudinary.com/) – hosting obrazów produktów, marek i kategorii  

---

## Funkcjonalności

- Strona główna z karuzelą kategorii, rekomendacjami i markami  
- Lista produktów z filtrowaniem po kategoriach  
- Strona szczegółowa produktu  
- Koszyk (dodawanie/odejmowanie produktów, usuwanie, podsumowanie)  
- Proces checkout z wyborem adresu, płatności i metod dostawy  
- Powiadomienia (toasty)  
- Obsługa użytkowników i zamówień (NextAuth + Prisma)  

---

## Uruchomienie lokalne

### 1. Klonowanie repozytorium
```bash
git clone https://github.com/Bl4ckBend3r/sklep-next.git
cd sklep-next
```

### 2. Instalacja zależności
```bash
npm install
```

### 3. Zmienne środowiskowe
Utwórz plik `.env.local` na podstawie `.env.example` i uzupełnij:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret
AUTH_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
NEXT_PUBLIC_CLOUD_PLACEHOLDER_URL=...
```

### 4. Migracje i seed
```bash
npx prisma migrate dev
npx prisma db seed
```

### 5. Start serwera developerskiego
```bash
npm run dev
```
Aplikacja będzie dostępna pod adresem: [http://localhost:3000](http://localhost:3000)

---

## Struktura katalogów

- `src/app/` – główne strony Next.js  
- `src/ui/` – komponenty UI (Button, Checkbox, ProductCard, itp.)  
- `prisma/` – schema i seedy dla Prisma  
- `scripts/` – dodatkowe skrypty (upload obrazów do Cloudinary, listowanie produktów)  

---

## Deployment

Projekt został wdrożony na [Vercel](https://vercel.com/).  
Po każdej zmianie w branchu `master` uruchamiany jest automatyczny deploy.  
Baza danych hostowana jest w [NeonDB](https://neon.tech/) z connection pooling.

---

## Autor

Witold Grzesiak  
Projekt przygotowany w ramach kursu **DevStock – Moduł 3**.
