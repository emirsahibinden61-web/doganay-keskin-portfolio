import { getSiteContent, getPortfolioItems } from '@/lib/data-store';
import HomeClient from '@/components/home/HomeClient';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const content = getSiteContent();
  const portfolio = getPortfolioItems();

  return (
    <HomeClient
      initialContent={content}
      initialPortfolio={portfolio}
    />
  );
}
