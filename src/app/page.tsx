import { getBrands, getCategories, getRandomRecommendations } from "@/lib/api";
import Slider from "@/ui/Slider";
import ProductCard from "@/ui/cards/ProductCard";
import BrandCard from "@/ui/cards/BrandCard";
import CategoryGrid from "@/ui/components/CategoryGrid";
import Carousel from "@/ui/Carousel";

export const dynamic = "force-dynamic";


const slides = [
  {
    id: 1,
    title: "Mouse",
    description: "Discover our wide range of computer mice.",
    ctaHref: "/products?category=mouse",
    ctaLabel: "Explore Mouse",
    imageUrl:
      "https://res.cloudinary.com/damzxycku/image/upload/v1755823736/products/rexus-kierra-x16.png",
    imageAlt: "Computer Mouse",
  },
  {
    id: 2,
    title: "Keyboard",
    description: "Find the perfect keyboard for your needs.",
    ctaHref: "/products?category=keyboard",
    ctaLabel: "Explore Keyboard",
    imageUrl:
      "https://res.cloudinary.com/damzxycku/image/upload/v1755723009/products/razer-huntsman-elite.png",
    imageAlt: "Mechanical Keyboard",
  },
  {
    id: 3,
    title: "Headset",
    description: "Experience immersive sound with our headsets.",
    ctaHref: "/products?category=headset",
    ctaLabel: "Explore Headset",
    imageUrl:
      "https://res.cloudinary.com/damzxycku/image/upload/v1755722999/products/jbl-tune-500.png",
    imageAlt: "Gaming Headset",
  },
];

export default async function HomePage() {
  const [categories, recs, brands] = await Promise.all([
    getCategories(),
    getRandomRecommendations(6),
    getBrands(),
  ]);

  return (
    <main className="w-full overflow-x-clip bg-[#1A1A1A] text-white">
      <div className="w-full flex justify-center">
        <div
          id="prodPaddin"
          className="
            w-full max-w-[1440px] mx-auto
            flex flex-col items-start
            px-4 sm:px-6 md:px-10
            pb-12 sm:pb-16 md:pb-20
            gap-12 sm:gap-16 md:gap-20 lg:gap-24
          "
        >
          {/* Carousel */}
          <section className="w-full">
            <div className="mb-4 sm:mb-6 flex items-center">
              <h2 className="flex-1 text-[clamp(1.25rem,2vw,1.75rem)] leading-[clamp(1.75rem,2.6vw,2.5rem)] font-medium tracking-[-0.01em] text-[#FCFCFC]">
                Category
              </h2>
            </div>

            {categories.length === 0 ? (
              <div className="text-sm text-neutral-400">
                Brak kategorii do wyświetlenia. Sprawdź backend / endpoint{" "}
                <code>/categories</code>.
              </div>
            ) : (
              <Slider>
                {categories.map((c) => (
                  <CategoryGrid key={c.id} categories={[c]} />
                ))}
              </Slider>
            )}
          </section>

          {/* Recommendation */}
          <section className="w-full">
            <div className="mb-4 sm:mb-6 flex items-center">
              <h2 className="flex-1 text-[clamp(1.25rem,2vw,1.75rem)] leading-[clamp(1.75rem,2.6vw,2.5rem)] font-medium tracking-[-0.01em] text-[#FCFCFC]">
                Recommendation
              </h2>
            </div>

            {recs.length === 0 ? (
              <div className="text-sm text-neutral-400">
                Brak rekomendacji do wyświetlenia. Sprawdź endpoint{" "}
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
          <section className="w-full">
            <div className="mb-4 sm:mb-6 flex items-center">
              <h2 className="flex-1 text-[clamp(1.25rem,2vw,1.75rem)] leading-[clamp(1.75rem,2.6vw,2.5rem)] font-medium tracking-[-0.01em] text-[#FCFCFC]">
                Brand
              </h2>
            </div>

            {brands.length === 0 ? (
              <div className="text-sm text-neutral-400">
                Brak marek do wyświetlenia. Sprawdź endpoint{" "}
                <code>/brands</code>.
              </div>
            ) : (
              <Slider>
                {brands.map((b) => (
                  <BrandCard key={b.id} brand={b} />
                ))}
              </Slider>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

