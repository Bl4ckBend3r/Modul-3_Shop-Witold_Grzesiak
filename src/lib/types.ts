export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image: string; 
};

export type Brand = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string; 
};

export type Product = {
  id: string;
  sku: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string; 
  category: { id: string; name: string; slug: string };
};
