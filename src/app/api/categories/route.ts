
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const rows = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      image: true,      // w Twoim seederze to pole nazywa się `image`
    },
  });

  // Jeżeli frontend oczekuje `imageUrl`:
  const data = rows.map(c => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    imageUrl: c.image ?? null,
  }));

  return NextResponse.json(data);
}
