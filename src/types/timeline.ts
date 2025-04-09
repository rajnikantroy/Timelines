export interface TimelineEvent {
  id: string;
  section: string;
  date: string;
  title: string;
  description: string;
  metrics?: {
    films?: number;
    awards?: number;
    boxOffice?: number;
    criticalRating?: number;
    audienceRating?: number;
    opportunities?: number;
    leads?: number;
    quotes?: number;
    successfulOrders?: number;
    failedOrders?: number;
    revenue?: number;
  };
  status?: string;
  accountType?: string;
  videos?: Array<{
    title: string;
    url: string;
    thumbnail?: string;
    description?: string;
  }>;
  links?: Array<{
    title: string;
    url: string;
  }>;
  articles?: Array<{
    title: string;
    url: string;
    source: string;
    description: string;
  }>;
  // B2B specific fields
  commercialModeMetrics?: {
    // Commercial mode metrics
    earlyFilms?: number;
    criticalAcclaim?: string;
    boxOffice?: string | {
      domestic?: string;
      international?: string;
      total?: string;
    };
    awards?: {
      nominations?: number;
      wins?: number;
      categories?: string[];
      oscarNominations?: number;
      goldenGlobeWins?: number;
      criticAwards?: number;
    };
  };
  details?: {
    [key: string]: any;
  };
}

export interface SearchResult {
  events: TimelineEvent[];
  suggestions: string[];
} 