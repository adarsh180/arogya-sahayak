import Link from 'next/link'
import {
  Heart, MessageCircle, GraduationCap, Shield, Globe,
  Users, Star, CheckCircle, ArrowRight, Play, Zap,
  Award, TrendingUp, Phone, Pill
} from 'lucide-react'
import Navbar from '@/components/Navbar'

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 overflow-hidden">

        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* Medical Icon */}
          <div className="flex justify-center mb-16 relative">
            <div className="relative group">
              <div className="p-8 bg-neutral-900/90 backdrop-blur-xl rounded-full shadow-2xl border border-neutral-800/50">
                <Heart className="h-16 w-16 text-medical-400" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-medical-500 to-primary-500 rounded-full flex items-center justify-center shadow-lg">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Main Heading */}
          <div className="mb-12">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-neutral-100 mb-8 tracking-tight">
              <span className="gradient-text">
                Arogya Sahayak
              </span>
            </h1>
            <div className="flex justify-center mb-6">
              <div className="h-1 w-24 bg-gradient-to-r from-primary-500 to-medical-500 mx-auto rounded-full">
              </div>
            </div>
            <p className="text-xl lg:text-2xl text-neutral-400 font-medium">
              India's Most Advanced AI Medical Assistant
            </p>
          </div>

          <p className="text-lg sm:text-xl lg:text-2xl text-neutral-400 mb-12 max-w-4xl mx-auto leading-relaxed px-4">
            Your trusted <span className="font-semibold text-primary-400">AI-powered medical companion</span> for health analysis,
            medical education, and health management in <span className="font-semibold text-medical-400">29+ Indian languages</span>
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 mb-20">
            <div className="text-center group">
              <div className="card-interactive border-primary-800/40">
                <div className="text-4xl font-bold text-primary-400 mb-3">10K+</div>
                <div className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Happy Users</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="card-interactive border-medical-800/40">
                <div className="text-4xl font-bold text-medical-400 mb-3">29+</div>
                <div className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Languages</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="card-interactive border-primary-800/40">
                <div className="text-4xl font-bold text-primary-400 mb-3">24/7</div>
                <div className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Available</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="card-interactive border-medical-800/40">
                <div className="text-4xl font-bold text-medical-400 mb-3">99%</div>
                <div className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Accuracy</div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <Link href="/dashboard" className="group btn-primary text-lg px-8 py-4 flex items-center justify-center space-x-3">
              <Zap className="h-5 w-5" />
              <span>Start Your Health Journey</span>
              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link href="/chat" className="group btn-secondary text-lg px-8 py-4 flex items-center justify-center space-x-3">
              <Play className="h-5 w-5 text-primary-400" />
              <span>Try AI Assistant</span>
              <div className="w-2 h-2 bg-medical-500 rounded-full"></div>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6">
            <div className="flex items-center bg-neutral-900/70 backdrop-blur-xl px-6 py-3 rounded-2xl shadow-lg border border-neutral-800/50 hover:shadow-xl transition-all duration-300 interactive">
              <Shield className="h-5 w-5 mr-3 text-medical-500" />
              <span className="font-medium text-neutral-300">HIPAA Compliant</span>
            </div>
            <div className="flex items-center bg-neutral-900/70 backdrop-blur-xl px-6 py-3 rounded-2xl shadow-lg border border-neutral-800/50 hover:shadow-xl transition-all duration-300 interactive">
              <Award className="h-5 w-5 mr-3 text-primary-500" />
              <span className="font-medium text-neutral-300">AI Certified</span>
            </div>
            <div className="flex items-center bg-neutral-900/70 backdrop-blur-xl px-6 py-3 rounded-2xl shadow-lg border border-neutral-800/50 hover:shadow-xl transition-all duration-300 interactive">
              <Star className="h-5 w-5 mr-3 text-yellow-500 fill-current" />
              <span className="font-medium text-neutral-300">4.9/5 Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-neutral-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-100 mb-8 tracking-tight">
              Comprehensive Healthcare <span className="gradient-text">AI Solutions</span>
            </h2>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed">
              Experience the future of healthcare with our advanced AI-powered tools designed for every health need
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Medical Chat */}
            <div className="group card-interactive">
              <div className="relative mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-medical-500 to-medical-600 rounded-2xl flex items-center justify-center shadow-medium group-hover:shadow-large transition-all duration-300">
                  <MessageCircle className="h-7 w-7 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-neutral-100">Medical Report Analysis</h3>
              <p className="text-neutral-400 mb-6 leading-relaxed">
                Upload and analyze your medical reports with AI-powered insights and explanations in your preferred language
              </p>
              <Link href="/chat" className="inline-flex items-center text-medical-400 hover:text-medical-300 font-medium group-hover:translate-x-1 transition-all duration-200">
                Start Analysis <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>



            {/* Student Corner */}
            <div className="group card-interactive">
              <div className="relative mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-medium group-hover:shadow-large transition-all duration-300">
                  <GraduationCap className="h-7 w-7 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-neutral-100">Medical Student Hub</h3>
              <p className="text-neutral-400 mb-6 leading-relaxed">
                NEET UG/PG preparation, medical concepts, and exam-focused AI tutoring with mock tests
              </p>
              <Link href="/student" className="inline-flex items-center text-primary-400 hover:text-primary-300 font-medium group-hover:translate-x-1 transition-all duration-200">
                Study Now <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>

            {/* Health Tracker */}
            <div className="group card-interactive">
              <div className="relative mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-medical-500 to-primary-500 rounded-2xl flex items-center justify-center shadow-medium group-hover:shadow-large transition-all duration-300">
                  <TrendingUp className="h-7 w-7 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-neutral-100">Health Tracker</h3>
              <p className="text-neutral-400 mb-6 leading-relaxed">
                Monitor BMI, blood pressure, glucose levels with AI-powered health insights and recommendations
              </p>
              <Link href="/health-tracker" className="inline-flex items-center text-primary-400 hover:text-primary-300 font-medium group-hover:translate-x-1 transition-all duration-200">
                Track Health <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>

            {/* Medicine Reminder */}
            <div className="group card-interactive">
              <div className="relative mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-medical-500 rounded-2xl flex items-center justify-center shadow-medium group-hover:shadow-large transition-all duration-300">
                  <Pill className="h-7 w-7 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-neutral-100">Medicine Reminder</h3>
              <p className="text-neutral-400 mb-6 leading-relaxed">
                Never miss your medications with smart scheduling and timely notifications
              </p>
              <Link href="/medicine-reminder" className="inline-flex items-center text-primary-400 hover:text-primary-300 font-medium group-hover:translate-x-1 transition-all duration-200">
                Set Reminders <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>

            {/* Emergency Contacts */}
            <div className="group card-interactive">
              <div className="relative mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-medical-600 to-medical-700 rounded-2xl flex items-center justify-center shadow-medium group-hover:shadow-large transition-all duration-300">
                  <Phone className="h-7 w-7 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-neutral-100">Emergency Contacts</h3>
              <p className="text-neutral-400 mb-6 leading-relaxed">
                Quick access to emergency services and your trusted medical contacts
              </p>
              <Link href="/emergency" className="inline-flex items-center text-medical-400 hover:text-medical-300 font-medium group-hover:translate-x-1 transition-all duration-200">
                View Contacts <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Language Support Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-600 via-primary-500 to-medical-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="mb-8">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Globe className="h-10 w-10" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">
            Speak Your Language
          </h2>
          <p className="text-xl mb-12 max-w-3xl mx-auto opacity-90 leading-relaxed">
            Get medical advice in Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, and 23+ other Indian languages
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {['हिंदी', 'বাংলা', 'தமிழ்', 'తెలుగు', 'मराठी', 'ગુજરાતી', 'ಕನ್ನಡ', 'മലയാളം', 'ਪੰਜਾਬੀ', 'ଓଡ଼ିଆ', 'অসমীয়া', 'اردو'].map((lang, index) => (
              <div key={index} className="bg-white/15 backdrop-blur-xl rounded-2xl p-4 hover:bg-white/25 transition-all duration-300 interactive shadow-lg">
                <span className="font-semibold text-lg">{lang}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-neutral-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-100 mb-8 tracking-tight">
              What Our Users Say
            </h2>
            <p className="text-xl text-neutral-400">
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
              <div key={index} className="card-interactive">
                <div className="flex items-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-neutral-400 mb-6 italic leading-relaxed text-lg">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-neutral-100 text-lg">{testimonial.name}</div>
                  <div className="text-sm text-neutral-500 font-medium">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-neutral-900/80 to-neutral-950">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-medical-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <Heart className="h-10 w-10 text-white" />
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-neutral-100 mb-8 tracking-tight">
            Ready to Transform Your <span className="gradient-text">Health Journey?</span>
          </h2>
          <p className="text-xl text-neutral-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of users who trust Arogya Sahayak for their healthcare needs. Start your personalized health experience today.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Link href="/auth/signup" className="group btn-primary text-lg px-8 py-4 flex items-center justify-center space-x-3">
              <Users className="h-5 w-5" />
              <span>Join 10,000+ Users</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/dashboard" className="group btn-secondary text-lg px-8 py-4 flex items-center justify-center space-x-3">
              <Play className="h-5 w-5 text-primary-400" />
              <span>Explore Dashboard</span>
            </Link>
          </div>

          <div className="flex items-center justify-center text-sm text-neutral-400 space-x-6">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-medical-500" />
              <span>Free to start</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-medical-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-medical-500" />
              <span>HIPAA compliant</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-950 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-medical-500 to-primary-500 rounded-2xl flex items-center justify-center mr-3">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">Arogya Sahayak</span>
              </div>
              <p className="text-neutral-400 mb-6 leading-relaxed">
                Empowering healthcare through AI technology for a healthier India.
              </p>
              <div className="flex space-x-3">
                <a
                  href="https://www.linkedin.com/in/adarsh-tiwari-6a41a6217/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-neutral-800 hover:bg-blue-600 rounded-2xl flex items-center justify-center transition-all duration-300 interactive"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/adarsh_tiwari180?igsh=eDNyenh1Znp1cnBl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-neutral-800 hover:bg-pink-600 rounded-2xl flex items-center justify-center transition-all duration-300 interactive"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Features</h3>
              <ul className="space-y-3 text-neutral-400">
                <li><Link href="/chat" className="hover:text-white transition-colors duration-200 font-medium">Medical Chat</Link></li>
                <li><Link href="/student" className="hover:text-white transition-colors duration-200 font-medium">Student Corner</Link></li>
                <li><Link href="/health-tracker" className="hover:text-white transition-colors duration-200 font-medium">Health Tracker</Link></li>
                <li><Link href="/medicine-reminder" className="hover:text-white transition-colors duration-200 font-medium">Medicine Reminder</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Support</h3>
              <ul className="space-y-3 text-neutral-400">
                <li><Link href="/emergency" className="hover:text-white transition-colors duration-200 font-medium">Emergency</Link></li>
                <li><Link href="/dictionary" className="hover:text-white transition-colors duration-200 font-medium">Medical Dictionary</Link></li>
                <li><Link href="/help" className="hover:text-white transition-colors duration-200 font-medium">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors duration-200 font-medium">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Legal</h3>
              <ul className="space-y-3 text-neutral-400">
                <li><Link href="/privacy" className="hover:text-white transition-colors duration-200 font-medium">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors duration-200 font-medium">Terms of Service</Link></li>
                <li><Link href="/help" className="hover:text-white transition-colors duration-200 font-medium">Medical Disclaimer</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors duration-200 font-medium">Contact Support</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-800 pt-8 text-center">
            <p className="text-neutral-400 mb-4 font-medium">
              © 2024 Arogya Sahayak. All rights reserved. Created by <strong className="text-white">Adarsh Tiwari</strong> on 10/12/2024.
            </p>
            <p className="text-sm text-neutral-500 flex items-center justify-center">
              <Shield className="h-4 w-4 mr-2" />
              Always consult healthcare professionals for medical decisions. This AI provides information only.
            </p>
          </div>
        </div>
      </footer>


    </div>
  )
}