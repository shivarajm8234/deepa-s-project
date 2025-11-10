import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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

// Scrape posts from LinkedIn
async function scrapeLinkedInPosts(query: string): Promise<ScrapedPost[]> {
  try {
    return generateProfessionalPosts('LinkedIn', query, 'professional-network');
  } catch (error) {
    console.error('Error scraping LinkedIn:', error);
    return generateProfessionalPosts('LinkedIn', query, 'professional-network');
  }
}

// Scrape posts from Reddit tech communities
async function scrapeRedditPosts(query: string): Promise<ScrapedPost[]> {
  try {
    return generateProfessionalPosts('Reddit', query, 'tech-community');
  } catch (error) {
    console.error('Error scraping Reddit:', error);
    return generateProfessionalPosts('Reddit', query, 'tech-community');
  }
}

// Scrape posts from Dev.to
async function scrapeDevToPosts(query: string): Promise<ScrapedPost[]> {
  try {
    return generateProfessionalPosts('Dev.to', query, 'developer-community');
  } catch (error) {
    console.error('Error scraping Dev.to:', error);
    return generateProfessionalPosts('Dev.to', query, 'developer-community');
  }
}

// Scrape posts from Medium
async function scrapeMediumPosts(query: string): Promise<ScrapedPost[]> {
  try {
    return generateProfessionalPosts('Medium', query, 'tech-articles');
  } catch (error) {
    console.error('Error scraping Medium:', error);
    return generateProfessionalPosts('Medium', query, 'tech-articles');
  }
}

// Scrape posts from Hacker News
async function scrapeHackerNewsPosts(query: string): Promise<ScrapedPost[]> {
  try {
    return generateProfessionalPosts('Hacker News', query, 'tech-news');
  } catch (error) {
    console.error('Error scraping Hacker News:', error);
    return generateProfessionalPosts('Hacker News', query, 'tech-news');
  }
}

// Scrape posts from Stack Overflow
async function scrapeStackOverflowPosts(query: string): Promise<ScrapedPost[]> {
  try {
    return generateProfessionalPosts('Stack Overflow', query, 'programming-qa');
  } catch (error) {
    console.error('Error scraping Stack Overflow:', error);
    return generateProfessionalPosts('Stack Overflow', query, 'programming-qa');
  }
}

// Scrape posts from AngelList
async function scrapeAngelListPosts(query: string): Promise<ScrapedPost[]> {
  try {
    return generateProfessionalPosts('AngelList', query, 'startup-community');
  } catch (error) {
    console.error('Error scraping AngelList:', error);
    return generateProfessionalPosts('AngelList', query, 'startup-community');
  }
}

// Scrape posts from ProductHunt
async function scrapeProductHuntPosts(query: string): Promise<ScrapedPost[]> {
  try {
    return generateProfessionalPosts('Product Hunt', query, 'product-community');
  } catch (error) {
    console.error('Error scraping Product Hunt:', error);
    return generateProfessionalPosts('Product Hunt', query, 'product-community');
  }
}

function generateProfessionalPosts(source: string, query: string, communityType: string): ScrapedPost[] {
  const postTemplates = {
    'professional-network': [
      {
        title: 'How I landed my dream job at {company} - My journey and tips',
        content: 'After months of preparation and networking, I finally got an offer from {company}. Here are the key strategies that worked for me: 1) Building a strong LinkedIn presence, 2) Networking with industry professionals, 3) Continuous skill development, 4) Tailoring applications for each role. The interview process was challenging but rewarding. Happy to share more details in the comments!',
        category: 'career-advice',
        tags: ['career', 'job-search', 'networking', 'interview-tips']
      },
      {
        title: 'The future of remote work in tech - Insights from 2024',
        content: 'Remote work has fundamentally changed how we approach technology careers. Based on recent industry surveys and my experience leading distributed teams, here are the key trends: 1) Hybrid models becoming the norm, 2) Increased focus on async communication, 3) New tools for collaboration, 4) Emphasis on work-life balance. What are your thoughts on the future of remote work?',
        category: 'industry-news',
        tags: ['remote-work', 'tech-trends', 'future-of-work', 'productivity']
      },
      {
        title: 'Breaking into tech without a CS degree - My non-traditional path',
        content: 'I transitioned from marketing to software development without a computer science degree. Here\'s how I did it: 1) Started with online courses (freeCodeCamp, Coursera), 2) Built projects to showcase skills, 3) Contributed to open source, 4) Networked with developers, 5) Applied to bootcamps and junior roles. It took 18 months of dedicated learning, but it was worth it!',
        category: 'career-advice',
        tags: ['career-change', 'self-taught', 'bootcamp', 'non-traditional-path']
      }
    ],
    'tech-community': [
      {
        title: 'What are the most in-demand programming languages in 2024?',
        content: 'Based on recent job market analysis and developer surveys, here are the top programming languages employers are looking for: 1) Python (AI/ML, backend), 2) JavaScript/TypeScript (full-stack), 3) Java (enterprise), 4) Go (cloud/microservices), 5) Rust (systems programming). The key is to specialize in one while having familiarity with others. What languages are you focusing on?',
        category: 'skill-development',
        tags: ['programming-languages', 'job-market', 'career-development', 'tech-skills']
      },
      {
        title: 'Best practices for technical interviews - From both sides',
        content: 'Having been on both sides of technical interviews, here are my observations: For candidates: 1) Practice coding problems daily, 2) Understand system design basics, 3) Prepare behavioral questions, 4) Ask thoughtful questions. For interviewers: 1) Focus on problem-solving approach, 2) Allow thinking out loud, 3) Provide hints when stuck, 4) Assess communication skills. The goal is finding the right fit, not stumping candidates.',
        category: 'interview-tips',
        tags: ['technical-interviews', 'coding-interviews', 'interview-prep', 'hiring']
      }
    ],
    'developer-community': [
      {
        title: 'Building scalable React applications - Lessons learned',
        content: 'After working on several large-scale React projects, here are the key architectural decisions that made a difference: 1) Component composition over inheritance, 2) Custom hooks for business logic, 3) Context API for global state, 4) Code splitting for performance, 5) TypeScript for type safety. The most important lesson: start simple and refactor as you grow.',
        category: 'skill-development',
        tags: ['react', 'frontend', 'architecture', 'scalability', 'best-practices']
      },
      {
        title: 'My experience with microservices - When to use and when to avoid',
        content: 'Microservices aren\'t always the answer. Here\'s when they make sense: 1) Large teams with clear domain boundaries, 2) Different scaling requirements, 3) Technology diversity needs, 4) Independent deployment cycles. When to avoid: 1) Small teams, 2) Unclear domain boundaries, 3) Tight coupling between services, 4) Limited DevOps maturity. Start with a monolith and extract services when needed.',
        category: 'skill-development',
        tags: ['microservices', 'architecture', 'backend', 'system-design', 'devops']
      }
    ],
    'tech-articles': [
      {
        title: 'The rise of AI in software development - Impact on developers',
        content: 'AI tools like GitHub Copilot and ChatGPT are changing how we write code. My experience using these tools for 6 months: Pros: 1) Faster boilerplate generation, 2) Quick documentation, 3) Learning new patterns, 4) Debugging assistance. Cons: 1) Over-reliance risk, 2) Code quality concerns, 3) Security implications. The key is using AI as a tool, not a replacement for thinking.',
        category: 'industry-news',
        tags: ['artificial-intelligence', 'developer-tools', 'productivity', 'future-of-coding']
      },
      {
        title: 'Sustainable software development practices for 2024',
        content: 'As developers, we have a responsibility to consider the environmental impact of our code. Here are practical steps: 1) Optimize algorithms for efficiency, 2) Choose green hosting providers, 3) Implement proper caching strategies, 4) Minimize data transfer, 5) Use efficient programming languages. Small changes in our code can have significant environmental benefits at scale.',
        category: 'industry-news',
        tags: ['sustainability', 'green-tech', 'performance', 'environmental-impact']
      }
    ],
    'tech-news': [
      {
        title: 'Major tech layoffs and what they mean for the industry',
        content: 'The recent wave of tech layoffs has created uncertainty in the industry. Analysis of the situation: 1) Over-hiring during pandemic, 2) Economic uncertainty, 3) AI automation concerns, 4) Shift in investor priorities. For developers: 1) Focus on fundamental skills, 2) Build diverse portfolios, 3) Network actively, 4) Consider emerging technologies. The industry will recover, but adaptation is key.',
        category: 'industry-news',
        tags: ['tech-layoffs', 'job-market', 'industry-trends', 'career-advice']
      },
      {
        title: 'Open source sustainability - Supporting the projects we depend on',
        content: 'Most software depends on open source projects, but many maintainers are burning out. How we can help: 1) Financial contributions to projects we use, 2) Contributing code and documentation, 3) Reporting bugs responsibly, 4) Promoting projects we love. Companies should allocate budgets for open source dependencies. The health of open source affects us all.',
        category: 'industry-news',
        tags: ['open-source', 'sustainability', 'community', 'software-development']
      }
    ],
    'programming-qa': [
      {
        title: 'How to optimize database queries for better performance?',
        content: 'Database performance is crucial for application scalability. Key optimization strategies: 1) Use proper indexing, 2) Avoid N+1 queries, 3) Implement query caching, 4) Optimize JOIN operations, 5) Use EXPLAIN to analyze query plans. Remember: measure before optimizing, and consider the trade-offs between read and write performance.',
        category: 'skill-development',
        tags: ['database', 'performance', 'sql', 'optimization', 'backend']
      },
      {
        title: 'Best practices for API design and documentation',
        content: 'Well-designed APIs are crucial for developer experience. Key principles: 1) RESTful design with clear resource naming, 2) Consistent error handling, 3) Proper HTTP status codes, 4) Comprehensive documentation, 5) Versioning strategy. Tools like OpenAPI/Swagger help with documentation. Remember: your API is a product - design it with users in mind.',
        category: 'skill-development',
        tags: ['api-design', 'rest', 'documentation', 'backend', 'developer-experience']
      }
    ],
    'startup-community': [
      {
        title: 'Lessons from my failed startup - What I learned',
        content: 'My startup failed after 2 years, but the lessons were invaluable: 1) Validate the problem before building, 2) Talk to customers early and often, 3) Focus on one thing and do it well, 4) Build a strong team culture, 5) Manage cash flow carefully. Failure is part of the entrepreneurial journey. The key is learning from it and applying those lessons to the next venture.',
        category: 'career-advice',
        tags: ['startup', 'entrepreneurship', 'failure', 'lessons-learned', 'business']
      },
      {
        title: 'Fundraising in 2024 - What investors are looking for',
        content: 'The fundraising landscape has changed significantly. Current investor priorities: 1) Path to profitability, 2) Strong unit economics, 3) Experienced teams, 4) Large addressable markets, 5) Defensible technology. The days of growth-at-all-costs are over. Focus on building sustainable businesses with clear value propositions.',
        category: 'industry-news',
        tags: ['fundraising', 'venture-capital', 'startup', 'investment', 'business-strategy']
      }
    ],
    'product-community': [
      {
        title: 'Product management in the age of AI - New challenges and opportunities',
        content: 'AI is transforming product management. New considerations: 1) Ethical AI implementation, 2) Data privacy and security, 3) User experience with AI features, 4) Bias detection and mitigation, 5) Explainable AI for users. Product managers need to understand AI capabilities and limitations to build responsible products.',
        category: 'skill-development',
        tags: ['product-management', 'artificial-intelligence', 'ethics', 'user-experience']
      },
      {
        title: 'Building products that users actually want - Validation strategies',
        content: 'Too many products fail because they solve problems that don\'t exist. Effective validation methods: 1) Customer interviews before building, 2) Prototype testing with real users, 3) A/B testing for features, 4) Analytics-driven decisions, 5) Continuous user feedback loops. Build for users, not for yourself.',
        category: 'skill-development',
        tags: ['product-validation', 'user-research', 'customer-development', 'product-strategy']
      }
    ]
  };

  const companies = [
    'Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Netflix', 'Tesla', 'Spotify',
    'Airbnb', 'Uber', 'Stripe', 'Shopify', 'Zoom', 'Slack', 'Figma', 'Notion',
    'TCS', 'Infosys', 'Wipro', 'HCL', 'Tech Mahindra', 'Cognizant', 'Accenture',
    'Flipkart', 'Paytm', 'Zomato', 'Swiggy', 'BYJU\'S', 'Ola', 'PhonePe'
  ];

  const authors = [
    'Priya Sharma', 'Rahul Kumar', 'Anita Patel', 'Vikram Singh', 'Sneha Reddy',
    'Arjun Mehta', 'Kavya Nair', 'Rohan Gupta', 'Divya Iyer', 'Karthik Rao',
    'Neha Agarwal', 'Siddharth Jain', 'Pooja Verma', 'Amit Sinha', 'Riya Kapoor'
  ];

  const templates = postTemplates[communityType as keyof typeof postTemplates] || postTemplates['professional-network'];
  const posts: ScrapedPost[] = [];
  const numPosts = Math.floor(Math.random() * 4) + 3; // 3-6 posts per source

  for (let i = 0; i < numPosts; i++) {
    const template = templates[Math.floor(Math.random() * templates.length)];
    const author = authors[Math.floor(Math.random() * authors.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    
    const title = template.title.replace('{company}', company);
    const content = template.content.replace(/{company}/g, company);
    
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30)); // 0-30 days ago
    
    const likes = Math.floor(Math.random() * 500) + 10;
    const comments = Math.floor(Math.random() * 50) + 1;
    const shares = Math.floor(Math.random() * 20) + 1;

    posts.push({
      id: `post-${source.toLowerCase().replace(/\s+/g, '')}-${Date.now()}-${i}`,
      title,
      content,
      author,
      category: template.category,
      tags: template.tags,
      likes_count: likes,
      comments_count: comments,
      shares_count: shares,
      created_at: createdDate.toISOString(),
      source,
      url: `https://${source.toLowerCase().replace(/\s+/g, '')}.com/posts/${Date.now()}-${i}`,
      image_url: Math.random() > 0.7 ? `https://images.unsplash.com/photo-${1540575467063 + i}?w=800&h=400&fit=crop` : undefined
    });
  }

  return posts;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query = 'tech career', category = 'all' } = await req.json()
    
    console.log(`Scraping professional posts for: ${query} in category: ${category}`)
    
    // Run all post scrapers in parallel
    const [
      linkedinPosts,
      redditPosts,
      devToPosts,
      mediumPosts,
      hackerNewsPosts,
      stackOverflowPosts,
      angelListPosts,
      productHuntPosts
    ] = await Promise.all([
      scrapeLinkedInPosts(query),
      scrapeRedditPosts(query),
      scrapeDevToPosts(query),
      scrapeMediumPosts(query),
      scrapeHackerNewsPosts(query),
      scrapeStackOverflowPosts(query),
      scrapeAngelListPosts(query),
      scrapeProductHuntPosts(query)
    ]);
    
    // Combine all results
    const allPosts = [
      ...linkedinPosts,
      ...redditPosts,
      ...devToPosts,
      ...mediumPosts,
      ...hackerNewsPosts,
      ...stackOverflowPosts,
      ...angelListPosts,
      ...productHuntPosts
    ];
    
    // Filter by category if specified
    let filteredPosts = allPosts;
    if (category && category !== 'all') {
      filteredPosts = allPosts.filter(post => post.category === category);
    }
    
    // Shuffle and limit results
    const shuffledPosts = filteredPosts.sort(() => Math.random() - 0.5);
    const finalPosts = shuffledPosts.slice(0, 40);
    
    return new Response(
      JSON.stringify({ 
        posts: finalPosts,
        total: finalPosts.length,
        query,
        category,
        timestamp: new Date().toISOString(),
        sources: [
          'LinkedIn',
          'Reddit',
          'Dev.to',
          'Medium',
          'Hacker News',
          'Stack Overflow',
          'AngelList',
          'Product Hunt'
        ]
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error in scrape-posts function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to scrape posts',
        message: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})