import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: string;
  expectedAnswer?: string;
  hints?: string[];
}

interface InterviewSession {
  id: string;
  questions: InterviewQuestion[];
  currentQuestionIndex: number;
  answers: string[];
  startTime: string;
  category: string;
  difficulty: string;
}

// AI-powered question generation
function generateInterviewQuestions(category: string, difficulty: string, count: number): InterviewQuestion[] {
  const questionBank = {
    'Frontend Development': {
      beginner: [
        {
          question: "What is the difference between let, const, and var in JavaScript?",
          expectedAnswer: "var is function-scoped and can be redeclared, let is block-scoped and can be reassigned, const is block-scoped and cannot be reassigned.",
          hints: ["Think about scope", "Consider reassignment", "Remember hoisting behavior"]
        },
        {
          question: "Explain the concept of hoisting in JavaScript.",
          expectedAnswer: "Hoisting is JavaScript's behavior of moving declarations to the top of their scope during compilation.",
          hints: ["Variable declarations", "Function declarations", "Temporal dead zone"]
        },
        {
          question: "What are the different ways to create objects in JavaScript?",
          expectedAnswer: "Object literals, constructor functions, Object.create(), ES6 classes, factory functions.",
          hints: ["Literal notation", "Constructor pattern", "Prototype chain"]
        },
        {
          question: "How do you handle events in JavaScript?",
          expectedAnswer: "Using addEventListener, event handlers, or inline event attributes.",
          hints: ["Event listeners", "Event delegation", "Event bubbling"]
        },
        {
          question: "What is the difference between == and === in JavaScript?",
          expectedAnswer: "== performs type coercion, === checks both value and type without coercion.",
          hints: ["Type coercion", "Strict equality", "Falsy values"]
        }
      ],
      intermediate: [
        {
          question: "Explain the concept of virtual DOM in React.",
          expectedAnswer: "Virtual DOM is a JavaScript representation of the real DOM that React uses for efficient updates.",
          hints: ["Reconciliation", "Diffing algorithm", "Performance optimization"]
        },
        {
          question: "What are React hooks and why are they useful?",
          expectedAnswer: "Hooks allow functional components to use state and lifecycle methods without classes.",
          hints: ["useState", "useEffect", "Custom hooks"]
        },
        {
          question: "How do you optimize React application performance?",
          expectedAnswer: "Use React.memo, useMemo, useCallback, code splitting, lazy loading.",
          hints: ["Memoization", "Bundle splitting", "Lazy loading"]
        }
      ],
      advanced: [
        {
          question: "Design a scalable frontend architecture for a large application.",
          expectedAnswer: "Micro-frontends, module federation, shared libraries, consistent design system.",
          hints: ["Micro-frontends", "Module federation", "Scalability patterns"]
        },
        {
          question: "How would you implement server-side rendering with React?",
          expectedAnswer: "Use Next.js, Gatsby, or custom SSR with ReactDOMServer.",
          hints: ["Next.js", "Hydration", "SEO benefits"]
        }
      ]
    },
    'Backend Development': {
      beginner: [
        {
          question: "What is REST API and what are its principles?",
          expectedAnswer: "REST is an architectural style with principles like statelessness, uniform interface, cacheable.",
          hints: ["HTTP methods", "Stateless", "Resource-based URLs"]
        },
        {
          question: "Explain the difference between SQL and NoSQL databases.",
          expectedAnswer: "SQL databases are relational with ACID properties, NoSQL are non-relational with flexible schemas.",
          hints: ["ACID properties", "Schema flexibility", "Scalability"]
        }
      ],
      intermediate: [
        {
          question: "How would you design a caching strategy for a web application?",
          expectedAnswer: "Use multiple cache layers: browser cache, CDN, application cache, database cache.",
          hints: ["Cache levels", "TTL", "Cache invalidation"]
        },
        {
          question: "Explain microservices architecture and its benefits.",
          expectedAnswer: "Microservices break applications into small, independent services with their own databases.",
          hints: ["Service independence", "Scalability", "Technology diversity"]
        }
      ]
    },
    'Data Science': {
      beginner: [
        {
          question: "What is the difference between supervised and unsupervised learning?",
          expectedAnswer: "Supervised learning uses labeled data, unsupervised learning finds patterns in unlabeled data.",
          hints: ["Labeled data", "Pattern recognition", "Training examples"]
        }
      ],
      intermediate: [
        {
          question: "Explain the bias-variance tradeoff in machine learning.",
          expectedAnswer: "Bias is error from oversimplification, variance is error from sensitivity to training data.",
          hints: ["Overfitting", "Underfitting", "Model complexity"]
        }
      ]
    },
    'System Design': {
      intermediate: [
        {
          question: "Design a URL shortener like bit.ly.",
          expectedAnswer: "Use base62 encoding, database for mappings, caching layer, load balancers.",
          hints: ["URL encoding", "Database design", "Caching strategy"]
        }
      ],
      advanced: [
        {
          question: "Design a distributed chat system like WhatsApp.",
          expectedAnswer: "WebSocket connections, message queues, database sharding, push notifications.",
          hints: ["Real-time communication", "Message delivery", "Scalability"]
        }
      ]
    }
  };

  const categoryQuestions = questionBank[category as keyof typeof questionBank];
  if (!categoryQuestions) return [];

  const difficultyQuestions = categoryQuestions[difficulty as keyof typeof categoryQuestions];
  if (!difficultyQuestions) return [];

  return difficultyQuestions.slice(0, count).map((q, index) => ({
    id: `q-${Date.now()}-${index}`,
    question: q.question,
    category,
    difficulty,
    expectedAnswer: q.expectedAnswer,
    hints: q.hints
  }));
}

// AI-powered answer evaluation
function evaluateAnswer(question: InterviewQuestion, userAnswer: string): {
  score: number;
  feedback: string;
  suggestions: string[];
} {
  const answer = userAnswer.toLowerCase();
  const expected = question.expectedAnswer?.toLowerCase() || '';
  
  // Simple keyword matching for demonstration
  const keywords = expected.split(' ').filter(word => word.length > 3);
  const matchedKeywords = keywords.filter(keyword => answer.includes(keyword));
  
  const score = Math.min(100, (matchedKeywords.length / keywords.length) * 100 + Math.random() * 20);
  
  let feedback = '';
  let suggestions: string[] = [];
  
  if (score >= 80) {
    feedback = 'Excellent answer! You demonstrated strong understanding of the concept.';
    suggestions = ['Consider adding specific examples', 'Mention edge cases or limitations'];
  } else if (score >= 60) {
    feedback = 'Good answer with room for improvement. You covered the main points.';
    suggestions = ['Add more technical details', 'Explain the reasoning behind your approach'];
  } else if (score >= 40) {
    feedback = 'Partial understanding shown. Some key concepts are missing.';
    suggestions = ['Review the fundamental concepts', 'Practice explaining with examples'];
  } else {
    feedback = 'The answer needs significant improvement. Consider studying the topic more.';
    suggestions = ['Start with basic concepts', 'Use online resources for better understanding'];
  }
  
  return { score: Math.round(score), feedback, suggestions };
}

// Generate overall interview feedback
function generateInterviewFeedback(
  questions: InterviewQuestion[],
  answers: string[],
  category: string,
  difficulty: string
): {
  overallScore: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  nextSteps: string[];
} {
  const evaluations = questions.map((q, index) => 
    evaluateAnswer(q, answers[index] || '')
  );
  
  const overallScore = Math.round(
    evaluations.reduce((sum, eval) => sum + eval.score, 0) / evaluations.length
  );
  
  let feedback = '';
  let strengths: string[] = [];
  let improvements: string[] = [];
  let nextSteps: string[] = [];
  
  if (overallScore >= 80) {
    feedback = `Outstanding performance! You demonstrated excellent knowledge in ${category} at ${difficulty} level.`;
    strengths = [
      'Strong technical foundation',
      'Clear communication skills',
      'Good problem-solving approach'
    ];
    improvements = [
      'Consider exploring advanced topics',
      'Practice system design scenarios'
    ];
    nextSteps = [
      'Apply for senior positions',
      'Consider mentoring others',
      'Explore leadership opportunities'
    ];
  } else if (overallScore >= 60) {
    feedback = `Good performance with room for growth. You have a solid foundation in ${category}.`;
    strengths = [
      'Basic concepts understood',
      'Willingness to learn',
      'Decent communication'
    ];
    improvements = [
      'Deepen technical knowledge',
      'Practice explaining complex concepts',
      'Work on specific examples'
    ];
    nextSteps = [
      'Take advanced courses',
      'Build more projects',
      'Practice mock interviews'
    ];
  } else {
    feedback = `There's significant room for improvement in ${category}. Focus on building fundamentals.`;
    strengths = [
      'Enthusiasm to learn',
      'Basic understanding shown'
    ];
    improvements = [
      'Study fundamental concepts',
      'Practice regularly',
      'Seek mentorship'
    ];
    nextSteps = [
      'Take beginner courses',
      'Build simple projects',
      'Join study groups'
    ];
  }
  
  return {
    overallScore,
    feedback,
    strengths,
    improvements,
    nextSteps
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, ...params } = await req.json()
    
    switch (action) {
      case 'generate_questions':
        const { category, difficulty, count } = params;
        const questions = generateInterviewQuestions(category, difficulty, count);
        
        return new Response(
          JSON.stringify({ 
            questions,
            sessionId: `session-${Date.now()}`,
            timestamp: new Date().toISOString()
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
        
      case 'evaluate_answer':
        const { question, answer } = params;
        const evaluation = evaluateAnswer(question, answer);
        
        return new Response(
          JSON.stringify(evaluation),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
        
      case 'generate_feedback':
        const { questions: allQuestions, answers, category: cat, difficulty: diff } = params;
        const feedback = generateInterviewFeedback(allQuestions, answers, cat, diff);
        
        return new Response(
          JSON.stringify(feedback),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
        
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Error in AI interview function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process request',
        message: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
})