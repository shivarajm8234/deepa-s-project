interface ScrapedEvent {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  duration_minutes: number;
  location: string;
  event_type: 'virtual' | 'in-person' | 'hybrid';
  max_attendees?: number;
  current_attendees: number;
  organizer: string;
  tags: string[];
  image_url?: string;
  registration_link?: string;
  source: string;
  price?: string;
  category: string;
}

class EventScrapingService {
  private baseUrl: string;
  private cache: Map<string, { data: ScrapedEvent[], timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 60 * 60 * 1000; // 1 hour

  constructor() {
    this.baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;
  }

  private getCacheKey(query: string, location: string): string {
    return `${query.toLowerCase()}-${location.toLowerCase()}`;
  }

  private isValidCache(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  async scrapeEvents(query: string = 'tech events', location: string = 'India'): Promise<{
    events: ScrapedEvent[];
    total: number;
    query: string;
    location: string;
    timestamp: string;
    sources: string[];
  }> {
    const cacheKey = this.getCacheKey(query, location);
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && this.isValidCache(cached.timestamp)) {
      console.log('Returning cached events');
      return {
        events: cached.data,
        total: cached.data.length,
        query,
        location,
        timestamp: new Date(cached.timestamp).toISOString(),
        sources: ['Cache']
      };
    }

    try {
      console.log(`Fetching fresh event data for: ${query} in ${location}`);
      
      const response = await fetch(`${this.baseUrl}/scrape-events`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, location }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.message || 'Failed to scrape events');
      }

      // Cache the results
      this.cache.set(cacheKey, {
        data: data.events,
        timestamp: Date.now()
      });

      console.log(`Successfully scraped ${data.events.length} events`);
      
      return data;
    } catch (error) {
      console.error('Error scraping events:', error);
      
      // Return fallback events
      const fallbackEvents = this.generateFallbackEvents(query, location);
      return {
        events: fallbackEvents,
        total: fallbackEvents.length,
        query,
        location,
        timestamp: new Date().toISOString(),
        sources: ['Fallback']
      };
    }
  }

  private generateFallbackEvents(query: string, location: string): ScrapedEvent[] {
    const fallbackEvents: ScrapedEvent[] = [
      {
        id: 'fallback-1',
        title: 'AI & Machine Learning Summit 2024',
        description: 'Join industry leaders for insights into the future of AI and ML technologies.',
        event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        event_time: '10:00',
        duration_minutes: 480,
        location: 'Bangalore, India',
        event_type: 'hybrid',
        max_attendees: 500,
        current_attendees: 234,
        organizer: 'AI Community India',
        tags: ['ai', 'machine-learning', 'tech', 'bangalore'],
        image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop',
        registration_link: 'https://example.com/ai-summit',
        source: 'Fallback',
        price: '₹2000',
        category: 'Artificial Intelligence'
      },
      {
        id: 'fallback-2',
        title: 'React.js Developer Meetup',
        description: 'Monthly meetup for React developers to share knowledge and network.',
        event_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        event_time: '18:30',
        duration_minutes: 120,
        location: 'Virtual Event',
        event_type: 'virtual',
        max_attendees: 200,
        current_attendees: 156,
        organizer: 'ReactJS India',
        tags: ['react', 'javascript', 'frontend', 'virtual'],
        image_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
        registration_link: 'https://example.com/react-meetup',
        source: 'Fallback',
        price: 'Free',
        category: 'Frontend Development'
      }
    ];

    return fallbackEvents;
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const eventScrapingService = new EventScrapingService();