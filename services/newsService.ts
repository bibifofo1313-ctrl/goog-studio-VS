
import { NewsArticle } from '../types';

const API_URL = '/api/news';

const MOCK_NEWS: NewsArticle[] = [
  {
    title: "EU 2026 ESG Reporting Standards Finalized for SMEs",
    description: "New regulations set to take effect in January 2026 aim to simplify carbon reporting for small and medium enterprises across the Eurozone.",
    url: "https://ec.europa.eu/commission/index_en",
    source: { name: "ESG Global News" },
    publishedAt: new Date().toISOString()
  },
  {
    title: "New Tax Credits for Electric Fleet Transition Announced",
    description: "Federal incentives for commercial EV adoption have been expanded, offering up to 30% offset for companies transitioning by Q4 2026.",
    url: "https://www.reuters.com/business/sustainable-business/",
    source: { name: "Business Insider" },
    publishedAt: new Date().toISOString()
  },
  {
    title: "Circular Economy Initiatives Drive 15% ROI for Industrial Firms",
    description: "A recent study shows that waste reduction and material reuse programs are delivering significant bottom-line growth ahead of regulation deadlines.",
    url: "https://www.bloomberg.com/sustainability",
    source: { name: "Sustainability Review" },
    publishedAt: new Date().toISOString()
  }
];

export const fetchSustainabilityNews = async (): Promise<NewsArticle[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      console.warn('News API responded with error status, using high-quality mock data.');
      return MOCK_NEWS;
    }
    const data = await response.json();
    
    if (!data.articles || data.articles.length === 0) {
      return MOCK_NEWS;
    }
    
    return data.articles;
  } catch (error) {
    console.error('Network error fetching sustainability news:', error);
    return MOCK_NEWS;
  }
};
