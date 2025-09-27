import CategoryGrid from "@/ui/components/CategoryGrid";

type ApiCategory = {
  id: string | number;
  name: string;
  slug: string;
  image?: string | null;
};

async function getCategories(): Promise<ApiCategory[]> {
  const res = await fetch("/api/categories", { cache: "no-store" });
  if (!res.ok) throw new Error("Nie udało się pobrać kategorii");
  return (await res.json()).data;
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Kategorie</h1>

      <CategoryGrid categories={categories} />
    </main>
  );
}
