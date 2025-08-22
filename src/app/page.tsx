import { getBrands, getCategories, getRandomRecommendations } from "@/lib/api";
import CategoryCarousel from "@/ui/CategoryCarousel";
import CategoryTile from "@/ui/CategoryTile";
import Slider from "@/ui/Slider";
import ProductCard from "@/ui/cards/ProductCard";
import BrandCard from "@/ui/cards/BrandCard";
import CategoryGrid from "@/ui/components/CategoryGrid";

export default async function HomePage() {
  const [categories, recs, brands] = await Promise.all([
    getCategories(),
    getRandomRecommendations(6),
    getBrands(),
  ]);

  return (
    <main className="bg-[#1A1A1A] text-white">
      <div className="mx-auto max-w-[1440px] px-[40px] pb-[80px] flex flex-col items-start gap-[100px]">
        {/* Carousel */}
        <section className="w-full max-w-[1360px] flex flex-col items-center gap-6">
          <CategoryCarousel categories={categories} />
        </section>

        {/* Category */}
        <section className="w-full max-w-[1360px] flex flex-col gap-8">
          <h2 className="text-[28px] leading-[40px] font-medium tracking-[-0.01em] text-[#FCFCFC]">
            Category
          </h2>

          {categories.length === 0 ? (
            <div className="text-sm text-neutral-400">
              Brak kategorii do wyświetlenia. Sprawdź backend / endpoint{" "}
              <code>/categories</code>.
            </div>
          ) : (
            <CategoryGrid categories={categories} />
          )}
        </section>

        {/* Recommendation */}
        <section className="w-full max-w-[1360px] flex flex-col gap-8">
          <div className="flex items-center">
            <h2 className="flex-1 text-[28px] leading-[40px] font-medium tracking-[-0.01em] text-[#FCFCFC]">
              Recomendation
            </h2>
          </div>

          {recs.length === 0 ? (
            <div className="text-sm text-neutral-400">
              Brak rekomendacji. Sprawdź{" "}
              <code>/products/recommendations?limit=6</code>.
            </div>
          ) : (
            <Slider>
              {recs.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </Slider>
          )}
        </section>

        {/* Brand */}
        <section className="w-full max-w-[1360px] flex flex-col gap-8">
          <div className="flex items-center">
            <h2 className="flex-1 text-[28px] leading-[40px] font-medium tracking-[-0.01em] text-[#FCFCFC]">
              Brand
            </h2>
          </div>

          {brands.length === 0 ? (
            <div className="text-sm text-neutral-400">
              Brak marek do wyświetlenia. Sprawdź endpoint <code>/brands</code>.
            </div>
          ) : (
            <Slider itemWidth={220} gap={32}>
              {brands.map((b) => (
                <BrandCard key={b.id} brand={b} />
              ))}
            </Slider>
          )}
        </section>
      </div>
    </main>
  );
}
