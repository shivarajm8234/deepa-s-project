import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Users,
  Zap,
  MessageCircle,
  FileText,
  BarChart3,
  Globe,
  TrendingUp
} from 'lucide-react';

const Dashboard = () => {

  const features = [
    {
      icon: Zap,
      title: "AI-Powered Job Matching",
      description: "Our intelligent algorithm analyzes your skills and preferences to find perfect job matches from top Indian companies.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: FileText,
      title: "Smart Resume Builder",
      description: "Create ATS-optimized resumes with our AI-powered builder. Get real-time feedback and improve your chances.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: MessageCircle,
      title: "AI Career Assistant",
      description: "Get personalized career advice, interview tips, and skill recommendations from our intelligent chatbot.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: BarChart3,
      title: "Skill Gap Analysis",
      description: "Identify skill gaps in your profile and get personalized learning recommendations to advance your career.",
      color: "from-orange-500 to-red-500"
    }
  ];

  const stats = [
    { label: "Active Jobs", value: "10,000+", icon: Briefcase },
    { label: "Success Stories", value: "5,000+", icon: Users },
    { label: "Partner Companies", value: "500+", icon: Globe },
    { label: "Average Salary Increase", value: "40%", icon: TrendingUp }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Engineer at TCS",
      content: "JobPortal helped me land my dream job at TCS. The AI matching was spot-on and the resume builder gave me the edge I needed!",
      avatar: "PS"
    },
    {
      name: "Rahul Kumar",
      role: "Data Scientist at Infosys",
      content: "The interview preparation and skill analysis features were game-changers. Increased my salary by 45% in just 3 months!",
      avatar: "RK"
    },
    {
      name: "Anita Patel",
      role: "Product Manager at Wipro",
      content: "From fresher to product manager in 2 years! The career pathway feature helped me plan and achieve my goals systematically.",
      avatar: "AP"
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Create Your Profile",
      description: "Sign up and build your comprehensive profile with our smart resume builder"
    },
    {
      step: "2", 
      title: "Get AI Recommendations",
      description: "Our AI analyzes your profile and recommends perfect job matches and skill improvements"
    },
    {
      step: "3",
      title: "Apply & Interview",
      description: "Apply to jobs with one click and prepare for interviews with our AI assistant"
    },
    {
      step: "4",
      title: "Land Your Dream Job",
      description: "Get hired by top companies and advance your career with continuous support"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">JobPortal</span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Your AI-powered career companion that connects talented professionals with top Indian companies. 
              Land your dream job with intelligent matching and personalized guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/jobs" 
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Explore Jobs Now
              </Link>
              <Link 
                to="/resume-builder" 
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all duration-300 font-semibold text-lg"
              >
                Build Your Resume
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Trusted by Thousands</h2>
            <p className="text-xl text-gray-600">Join the success stories of professionals who found their dream careers</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Powerful Features for Your Success</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to accelerate your career journey, powered by cutting-edge AI technology
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">How JobPortal Works</h2>
            <p className="text-xl text-gray-600">Simple steps to transform your career</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 text-white text-2xl font-bold shadow-lg">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600">Hear from professionals who transformed their careers with JobPortal</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">Ready to Transform Your Career?</h2>
          <p className="text-xl lg:text-2xl mb-8 text-blue-100">
            Join thousands of professionals who have found their dream jobs through JobPortal
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/jobs" 
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Start Job Search
            </Link>
            <Link 
              to="/resume-builder" 
              className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-all duration-300 font-semibold text-lg shadow-lg"
            >
              Create Resume
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;