import Link from 'next/link'
import { 
  Heart, MessageCircle, Activity, GraduationCap, Shield, Globe, 
  Clock, Users, Star, CheckCircle, ArrowRight, Play, Zap,
  Award, TrendingUp, BookOpen, Phone, Pill
} from 'lucide-react'
import Navbar from '@/components/Navbar'

export default function Home() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-green-50">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-100 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-100 rounded-full opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* Floating Heart Animation */}
          <div className="flex justify-center mb-8 relative">
            <div className="relative">
              <Heart className="h-20 w-20 text-medical-600 animate-bounce" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-ping">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Main Heading with Typewriter Effect */}
          <div className="mb-6">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-4 animate-fade-in">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                Arogya Sahayak
              </span>
            </h1>
            <div className="h-2 w-32 bg-gradient-to-r from-blue-500 to-green-500 mx-auto rounded-full animate-slide-up"></div>
          </div>

          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed animate-fade-in">
            Your trusted <span className="font-semibold text-blue-600">AI-powered medical companion</span> for health analysis, 
            symptom checking, and medical education in <span className="font-semibold text-green-600">29+ Indian languages</span>
          </p>

          {/* Stats Counter Animation */}
          <div className="flex flex-wrap justify-center gap-8 mb-12 animate-fade-in">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">10K+</div>
              <div className="text-sm text-gray-600">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">29+</div>
              <div className="text-sm text-gray-600">Languages</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">24/7</div>
              <div className="text-sm text-gray-600">Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-1">99%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
          </div>

          {/* CTA Buttons with Hover Effects */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-up">
            <Link href="/dashboard" className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <span className="relative z-10 flex items-center justify-center">
                <Zap className="h-5 w-5 mr-2" />
                Start Your Health Journey
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            
            <Link href="/chat" className="group bg-white text-gray-800 font-semibold py-4 px-8 rounded-full text-lg border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center">
              <Play className="h-5 w-5 mr-2 text-blue-600" />
              Watch Demo
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500 animate-fade-in">
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-2 text-green-500" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center">
              <Award className="h-4 w-4 mr-2 text-blue-500" />
              <span>AI Certified</span>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-2 text-yellow-500" />
              <span>4.9/5 Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Comprehensive Healthcare <span className="text-blue-600">AI Solutions</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of healthcare with our advanced AI-powered tools designed for every health need
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Medical Chat */}
            <div className="group card hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-l-4 border-red-500">
              <div className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-red-100 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
                <MessageCircle className="h-12 w-12 text-red-600 mb-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Medical Report Analysis</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Upload and analyze your medical reports with AI-powered insights and explanations in your preferred language
              </p>
              <Link href="/chat" className="inline-flex items-center text-red-600 hover:text-red-700 font-medium group-hover:translate-x-2 transition-transform duration-300">
                Start Analysis <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>

            {/* Symptom Checker */}
            <div className="group card hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-l-4 border-green-500">
              <div className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-green-100 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
                <Activity className="h-12 w-12 text-green-600 mb-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">AI Symptom Checker</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Describe your symptoms and get detailed analysis with severity assessment and home remedies
              </p>
              <Link href="/symptom-checker" className="inline-flex items-center text-green-600 hover:text-green-700 font-medium group-hover:translate-x-2 transition-transform duration-300">
                Check Symptoms <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>

            {/* Student Corner */}
            <div className="group card hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-l-4 border-purple-500">
              <div className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-100 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
                <GraduationCap className="h-12 w-12 text-purple-600 mb-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Medical Student Hub</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                NEET UG/PG preparation, medical concepts, and exam-focused AI tutoring with mock tests
              </p>
              <Link href="/student" className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium group-hover:translate-x-2 transition-transform duration-300">
                Study Now <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>

            {/* Health Tracker */}
            <div className="group card hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-l-4 border-blue-500">
              <div className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
                <TrendingUp className="h-12 w-12 text-blue-600 mb-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Health Tracker</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Monitor BMI, blood pressure, glucose levels with AI-powered health insights and recommendations
              </p>
              <Link href="/health-tracker" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium group-hover:translate-x-2 transition-transform duration-300">
                Track Health <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>

            {/* Medicine Reminder */}
            <div className="group card hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-l-4 border-indigo-500">
              <div className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-100 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
                <Pill className="h-12 w-12 text-indigo-600 mb-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Medicine Reminder</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Never miss your medications with smart scheduling and timely notifications
              </p>
              <Link href="/medicine-reminder" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium group-hover:translate-x-2 transition-transform duration-300">
                Set Reminders <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>

            {/* Emergency Contacts */}
            <div className="group card hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-l-4 border-red-500">
              <div className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-red-100 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
                <Phone className="h-12 w-12 text-red-600 mb-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Emergency Contacts</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Quick access to emergency services and your trusted medical contacts
              </p>
              <Link href="/emergency" className="inline-flex items-center text-red-600 hover:text-red-700 font-medium group-hover:translate-x-2 transition-transform duration-300">
                View Contacts <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Language Support Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <Globe className="h-16 w-16 mx-auto mb-6 animate-spin" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Speak Your Language
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Get medical advice in Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, and 23+ other Indian languages
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
            {['हिंदी', 'বাংলা', 'தமிழ்', 'తెలుగు', 'मराठी', 'ગુજરાતી', 'ಕನ್ನಡ', 'മലയാളം', 'ਪੰਜਾਬੀ', 'ଓଡ଼ିଆ', 'অসমীয়া', 'اردو'].map((lang, index) => (
              <div key={index} className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-3 hover:bg-opacity-30 transition-all duration-300 hover:scale-105">
                <span className="font-semibold text-lg">{lang}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600">
              Trusted by thousands of users across India
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Priya Sharma",
                role: "Medical Student",
                content: "Arogya Sahayak helped me prepare for NEET PG with personalized AI tutoring. The multilingual support made complex topics easier to understand.",
                rating: 5
              },
              {
                name: "Rajesh Kumar",
                role: "Patient",
                content: "The symptom checker gave me peace of mind during the pandemic. Getting medical advice in Hindi made all the difference for my family.",
                rating: 5
              },
              {
                name: "Anita Patel",
                role: "Healthcare Worker",
                content: "The medical dictionary feature is incredibly comprehensive. It's become my go-to reference for medical terminology in Gujarati.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="card hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mb-6">
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Transform Your <span className="text-green-600">Health Journey?</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust Arogya Sahayak for their healthcare needs. Start your personalized health experience today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup" className="group bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center justify-center">
              <Users className="h-5 w-5 mr-2" />
              Join 10,000+ Users
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/dashboard" className="bg-white text-gray-800 font-semibold py-4 px-8 rounded-full text-lg border-2 border-gray-200 hover:border-green-300 transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center">
              <Play className="h-5 w-5 mr-2 text-green-600" />
              Explore Dashboard
            </Link>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            <CheckCircle className="h-4 w-4 inline mr-2 text-green-500" />
            Free to start • No credit card required • HIPAA compliant
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <Heart className="h-8 w-8 text-medical-400 mr-2" />
                <span className="text-xl font-bold">Arogya Sahayak</span>
              </div>
              <p className="text-gray-400 mb-4">
                Empowering healthcare through AI technology for a healthier India.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-900 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">in</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/chat" className="hover:text-white transition-colors">Medical Chat</Link></li>
                <li><Link href="/symptom-checker" className="hover:text-white transition-colors">Symptom Checker</Link></li>
                <li><Link href="/student" className="hover:text-white transition-colors">Student Corner</Link></li>
                <li><Link href="/health-tracker" className="hover:text-white transition-colors">Health Tracker</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/emergency" className="hover:text-white transition-colors">Emergency</Link></li>
                <li><Link href="/dictionary" className="hover:text-white transition-colors">Medical Dictionary</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Medical Disclaimer</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 mb-2">
              © 2024 Arogya Sahayak. All rights reserved.
            </p>
            <p className="text-sm text-gray-500">
              <Shield className="h-4 w-4 inline mr-1" />
              Always consult healthcare professionals for medical decisions. This AI provides information only.
            </p>
          </div>
        </div>
      </footer>


    </div>
  )
}