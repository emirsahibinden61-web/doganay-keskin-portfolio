import { NextRequest, NextResponse } from 'next/server';
import { getSiteContent, saveSiteContent } from '@/lib/data-store';
import { SiteContent } from '@/lib/types';

export async function GET() {
  const content = getSiteContent();
  return NextResponse.json(content);
}

export async function POST(req: NextRequest) {
  try {
    const updatedContent: SiteContent = await req.json();
    saveSiteContent(updatedContent);
    return NextResponse.json({ success: true, message: 'İçerik başarıyla güncellendi', content: updatedContent });
  } catch (error) {
    console.error('Error saving content:', error);
    return NextResponse.json({ success: false, message: 'İçerik kaydedilirken hata oluştu' }, { status: 500 });
  }
}
