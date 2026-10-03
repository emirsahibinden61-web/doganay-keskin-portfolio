import { NextRequest, NextResponse } from 'next/server';
import { getPortfolioItems, savePortfolioItems } from '@/lib/data-store';
import { PortfolioItem } from '@/lib/types';

export async function GET() {
  const items = getPortfolioItems();
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  try {
    const itemData: PortfolioItem = await req.json();
    const items = getPortfolioItems();

    const existingIndex = items.findIndex((i) => i.id === itemData.id);
    if (existingIndex >= 0) {
      items[existingIndex] = itemData;
    } else {
      // New item, prepend to top
      items.unshift(itemData);
    }

    savePortfolioItems(items);
    return NextResponse.json({ success: true, message: 'Çalışma başarıyla kaydedildi', items });
  } catch (error) {
    console.error('Error saving portfolio item:', error);
    return NextResponse.json({ success: false, message: 'Çalışma kaydedilemedi' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID belirtilmedi' }, { status: 400 });
    }

    let items = getPortfolioItems();
    items = items.filter((i) => i.id !== id);
    savePortfolioItems(items);

    return NextResponse.json({ success: true, message: 'Çalışma silindi', items });
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    return NextResponse.json({ success: false, message: 'Çalışma silinirken hata oluştu' }, { status: 500 });
  }
}
