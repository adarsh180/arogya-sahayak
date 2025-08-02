import Link from 'next/link'
import { 
  Heart, MessageCircle, Activity, GraduationCap, Shield, Globe, 
  Clock, Users, Star, CheckCircle, ArrowRight, Play, Zap,
  Award, TrendingUp, BookOpen, Phone, Pill
} from 'lucide-react'
import Navbar from '@/components/Navbar'

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-900 theme-transition overflow-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-white to-medical-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 overflow-hidden theme-transition">
        {/* Enhanced Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-20 animate-pulse blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-green-200 to-blue-200 rounded-full opacity-20 animate-pulse blur-3xl" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full opacity-15 animate-pulse blur-3xl" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-300 rounded-full opacity-10 animate-bounce" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-green-300 rounded-full opacity-10 animate-bounce" style={{animationDelay: '1.5s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* Enhanced Floating Heart Animation */}
          <div className="flex justify-center mb-12 relative">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-400 rounded-full blur-2xl opacity-30 animate-pulse group-hover:opacity-50 transition-opacity duration-300"></div>
              <div className="relative p-6 bg-gradient-to-r from-red-100 to-pink-100 rounded-full">
                <Heart className="h-24 w-24 text-red-600 animate-bounce" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center animate-ping shadow-lg">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              </div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            </div>
          </div>

          {/* Enhanced Main Heading */}
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black text-gray-900 dark:text-gray-100 mb-6 animate-fade-in">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent hover:from-purple-600 hover:via-blue-600 hover:to-green-600 transition-all duration-1000">
                Arogya Sahayak
              </span>
            </h1>
            <div className="flex justify-center mb-4">
              <div className="h-2 lg:h-3 w-32 lg:w-48 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 mx-auto rounded-full animate-slide-up shadow-lg">
                <div className="h-full bg-gradient-to-r from-white/30 to-transparent rounded-full animate-pulse"></div>
              </div>
            </div>
            <p className="text-lg lg:text-xl text-gray-500 dark:text-gray-400 font-medium animate-fade-in" style={{animationDelay: '0.5s'}}>
              🇮🇳 India's Most Advanced AI Medical Assistant
            </p>
          </div>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-6 lg:mb-8 max-w-4xl mx-auto leading-relaxed animate-fade-in px-4">
            Your trusted <span className="font-semibold text-blue-600">AI-powered medical companion</span> for health analysis, 
            medical education, and health management in <span className="font-semibold text-green-600">29+ Indian languages</span>
          </p>

          {/* Enhanced Stats Counter Animation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 mb-16 animate-fade-in" style={{animationDelay: '0.8s'}}>
            <div className="text-center group">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-200/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="text-4xl font-black text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">10K+</div>
                <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Happy Users</div>
                <div className="w-8 h-1 bg-blue-500 mx-auto mt-2 rounded-full"></div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-200/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="text-4xl font-black text-green-600 mb-2 group-hover:scale-110 transition-transform duration-300">29+</div>
                <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Languages</div>
                <div className="w-8 h-1 bg-green-500 mx-auto mt-2 rounded-full"></div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-200/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="text-4xl font-black text-purple-600 mb-2 group-hover:scale-110 transition-transform duration-300">24/7</div>
                <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Available</div>
                <div className="w-8 h-1 bg-purple-500 mx-auto mt-2 rounded-full"></div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-red-200/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="text-4xl font-black text-red-600 mb-2 group-hover:scale-110 transition-transform duration-300">99%</div>
                <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Accuracy</div>
                <div className="w-8 h-1 bg-red-500 mx-auto mt-2 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-slide-up" style={{animationDelay: '1s'}}>
            <Link href="/dashboard" className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white font-bold py-5 px-10 rounded-2xl text-xl transition-all duration-500 hover:scale-110 hover:shadow-2xl transform hover:rotate-1">
              <span className="relative z-10 flex items-center justify-center">
                <Zap className="h-6 w-6 mr-3 group-hover:animate-pulse" />
                Start Your Health Journey
                <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
            </Link>
            
            <Link href="/chat" className="group bg-white/90 backdrop-blur-sm text-gray-800 font-bold py-5 px-10 rounded-2xl text-xl border-2 border-gray-300 hover:border-blue-400 transition-all duration-500 hover:scale-110 hover:shadow-2xl flex items-center justify-center transform hover:-rotate-1">
              <Play className="h-6 w-6 mr-3 text-blue-600 group-hover:animate-pulse" />
              Try AI Assistant
              <div className="ml-3 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </Link>
          </div>

          {/* Enhanced Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 animate-fade-in" style={{animationDelay: '1.2s'}}>
            <div className="flex items-center bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-green-200/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Shield className="h-5 w-5 mr-3 text-green-500" />
              <span className="font-semibold text-gray-700">HIPAA Compliant</span>
            </div>
            <div className="flex items-center bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Award className="h-5 w-5 mr-3 text-blue-500" />
              <span className="font-semibold text-gray-700">AI Certified</span>
            </div>
            <div className="flex items-center bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-yellow-200/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Star className="h-5 w-5 mr-3 text-yellow-500 fill-current" />
              <span className="font-semibold text-gray-700">4.9/5 Rating</span>
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
                <a 
                  href="https://www.linkedin.com/in/adarsh-tiwari-6a41a6217/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.instagram.com/adarsh_tiwari180?igsh=eDNyenh1Znp1cnBl" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/chat" className="hover:text-white transition-colors">Medical Chat</Link></li>
                <li><Link href="/student" className="hover:text-white transition-colors">Student Corner</Link></li>
                <li><Link href="/health-tracker" className="hover:text-white transition-colors">Health Tracker</Link></li>
                <li><Link href="/medicine-reminder" className="hover:text-white transition-colors">Medicine Reminder</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/emergency" className="hover:text-white transition-colors">Emergency</Link></li>
                <li><Link href="/dictionary" className="hover:text-white transition-colors">Medical Dictionary</Link></li>
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/help" className="hover:text-white transition-colors">Medical Disclaimer</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 mb-2">
              © 2024 Arogya Sahayak. All rights reserved. Created by <strong>Adarsh Tiwari</strong> on 10/12/2024.
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