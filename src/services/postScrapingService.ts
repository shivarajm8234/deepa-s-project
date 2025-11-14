interface ScrapedPost {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at: string;
  source: string;
  url: string;
  image_url?: string;
}

class PostScrapingService {
  private baseUrl: string;
  private cache: Map<string, { data: ScrapedPost[], timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  constructor() {
    this.baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;
  }

  private getCacheKey(query: string, category: string): string {
    return `${query.toLowerCase()}-${category.toLowerCase()}`;
  }

  private isValidCache(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  async scrapePosts(query: string = 'tech career', category: string = 'all'): Promise<{
    posts: ScrapedPost[];
    total: number;
    query: string;
    category: string;
    timestamp: string;
    sources: string[];
  }> {
    const cacheKey = this.getCacheKey(query, category);
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && this.isValidCache(cached.timestamp)) {
      console.log('Returning cached posts');
      return {
        posts: cached.data,
        total: cached.data.length,
        query,
        category,
        timestamp: new Date(cached.timestamp).toISOString(),
        sources: ['Cache']
      };
    }

    try {
      console.log(`Fetching fresh post data for: ${query} in category: ${category}`);
      
      const response = await fetch(`${this.baseUrl}/scrape-posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, category }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.message || 'Failed to scrape posts');
      }

      // Cache the results
      this.cache.set(cacheKey, {
        data: data.posts,
        timestamp: Date.now()
      });

      console.log(`Successfully scraped ${data.posts.length} posts`);
      
      return data;
    } catch (error) {
      console.error('Error scraping posts:', error);
      
      // Return fallback posts
      const fallbackPosts = this.generateFallbackPosts(query, category);
      return {
        posts: fallbackPosts,
        total: fallbackPosts.length,
        query,
        category,
        timestamp: new Date().toISOString(),
        sources: ['Fallback']
      };
    }
  }

  private generateFallbackPosts(query: string, category: string): ScrapedPost[] {
    const fallbackPosts: ScrapedPost[] = [
      {
        id: 'fallback-1',
        title: 'How I landed my dream job at Google - My journey and tips',
        content: 'After months of preparation and networking, I finally got an offer from Google. Here are the key strategies that worked for me: building a strong LinkedIn presence, networking with industry professionals, continuous skill development, and tailoring applications for each role.',
        author: 'Priya Sharma',
        category: 'career-advice',
        tags: ['career', 'job-search', 'networking', 'interview-tips'],
        likes_count: 234,
        comments_count: 45,
        shares_count: 12,
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        source: 'LinkedIn',
        url: 'https://linkedin.com/posts/fallback-1',
        image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop'
      },
      {
        id: 'fallback-2',
        title: 'The future of remote work in tech - Insights from 2024',
        content: 'Remote work has fundamentally changed how we approach technology careers. Based on recent industry surveys and my experience leading distributed teams, here are the key trends: hybrid models becoming the norm, increased focus on async communication, and new tools for collaboration.',
        author: 'Rahul Kumar',
        category: 'industry-news',
        tags: ['remote-work', 'tech-trends', 'future-of-work', 'productivity'],
        likes_count: 189,
        comments_count: 32,
        shares_count: 8,
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        source: 'Medium',
        url: 'https://medium.com/posts/fallback-2'
      },
      {
        id: 'fallback-3',
        title: 'Breaking into tech without a CS degree - My non-traditional path',
        content: 'I transitioned from marketing to software development without a computer science degree. Here\'s how I did it: started with online courses, built projects to showcase skills, contributed to open source, networked with developers, and applied to bootcamps and junior roles.',
        author: 'Anita Patel',
        category: 'career-advice',
        tags: ['career-change', 'self-taught', 'bootcamp', 'non-traditional-path'],
        likes_count: 156,
        comments_count: 28,
        shares_count: 15,
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        source: 'Dev.to',
        url: 'https://dev.to/posts/fallback-3'
      }
    ];

    if (category && category !== 'all') {
      return fallbackPosts.filter(post => post.category === category);
    }

    return fallbackPosts;
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const postScrapingService = new PostScrapingService();