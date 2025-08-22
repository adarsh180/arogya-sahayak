'use client'

import { useState } from 'react'
import { Heart, TrendingUp, Activity, Scale, Droplets, Thermometer, Plus, Calendar } from 'lucide-react'
import Navbar from '@/components/Navbar'

export default function HealthTracker() {
  const [activeTab, setActiveTab] = useState('overview')

  const healthMetrics = [
    {
      id: 'bmi',
      name: 'BMI',
      value: '22.5',
      unit: 'kg/m²',
      status: 'Normal',
      icon: Scale,
      color: 'text-green-400',
      bgColor: 'bg-green-900/20',
      borderColor: 'border-green-700/40'
    },
    {
      id: 'bp',
      name: 'Blood Pressure',
      value: '120/80',
      unit: 'mmHg',
      status: 'Normal',
      icon: Heart,
      color: 'text-medical-400',
      bgColor: 'bg-medical-900/20',
      borderColor: 'border-medical-700/40'
    },
    {
      id: 'glucose',
      name: 'Blood Glucose',
      value: '95',
      unit: 'mg/dL',
      status: 'Normal',
      icon: Droplets,
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/20',
      borderColor: 'border-blue-700/40'
    },
    {
      id: 'temp',
      name: 'Body Temperature',
      value: '98.6',
      unit: '°F',
      status: 'Normal',
      icon: Thermometer,
      color: 'text-orange-400',
      bgColor: 'bg-orange-900/20',
      borderColor: 'border-orange-700/40'
    }
  ]

  return (
    <div className="min-h-screen bg-neutral-950">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-100 mb-2">Health Tracker</h1>
              <p className="text-neutral-400">Monitor your vital health metrics and track progress over time</p>
            </div>
            <button className="btn-primary flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Add Reading</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-neutral-900/50 p-1 rounded-2xl backdrop-blur-xl border border-neutral-800/40">
            {[
              { id: 'overview', name: 'Overview', icon: Activity },
              { id: 'trends', name: 'Trends', icon: TrendingUp },
              { id: 'history', name: 'History', icon: Calendar }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Health Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {healthMetrics.map((metric) => (
                <div
                  key={metric.id}
                  className={`card-interactive ${metric.bgColor} ${metric.borderColor} border`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${metric.bgColor} rounded-2xl flex items-center justify-center`}>
                      <metric.icon className={`h-6 w-6 ${metric.color}`} />
                    </div>
                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${metric.bgColor} ${metric.color}`}>
                      {metric.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-100 mb-2">{metric.name}</h3>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-neutral-100">{metric.value}</span>
                    <span className="text-neutral-400 text-sm">{metric.unit}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-xl font-semibold text-neutral-100 mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex items-center space-x-3 p-4 bg-neutral-800/60 hover:bg-neutral-700/60 rounded-2xl transition-all duration-200 text-left">
                  <div className="w-10 h-10 bg-medical-900/30 rounded-xl flex items-center justify-center">
                    <Heart className="h-5 w-5 text-medical-400" />
                  </div>
                  <div>
                    <div className="font-medium text-neutral-100">Record BP</div>
                    <div className="text-sm text-neutral-400">Blood pressure reading</div>
                  </div>
                </button>
                
                <button className="flex items-center space-x-3 p-4 bg-neutral-800/60 hover:bg-neutral-700/60 rounded-2xl transition-all duration-200 text-left">
                  <div className="w-10 h-10 bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <Droplets className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-neutral-100">Log Glucose</div>
                    <div className="text-sm text-neutral-400">Blood sugar level</div>
                  </div>
                </button>
                
                <button className="flex items-center space-x-3 p-4 bg-neutral-800/60 hover:bg-neutral-700/60 rounded-2xl transition-all duration-200 text-left">
                  <div className="w-10 h-10 bg-green-900/30 rounded-xl flex items-center justify-center">
                    <Scale className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium text-neutral-100">Update Weight</div>
                    <div className="text-sm text-neutral-400">Body weight tracking</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Health Tips */}
            <div className="card">
              <h3 className="text-xl font-semibold text-neutral-100 mb-6">Today's Health Tips</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-neutral-800/40 rounded-2xl">
                  <div className="w-8 h-8 bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Heart className="h-4 w-4 text-primary-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-100 mb-1">Stay Hydrated</h4>
                    <p className="text-neutral-400 text-sm">Drink at least 8 glasses of water daily to maintain optimal health.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-4 bg-neutral-800/40 rounded-2xl">
                  <div className="w-8 h-8 bg-medical-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Activity className="h-4 w-4 text-medical-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-100 mb-1">Regular Exercise</h4>
                    <p className="text-neutral-400 text-sm">Aim for 30 minutes of moderate exercise daily for cardiovascular health.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === 'trends' && (
          <div className="card text-center py-20">
            <TrendingUp className="h-16 w-16 text-neutral-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-100 mb-2">Trends Coming Soon</h3>
            <p className="text-neutral-400">Visual charts and trend analysis will be available here.</p>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="card text-center py-20">
            <Calendar className="h-16 w-16 text-neutral-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-100 mb-2">History Coming Soon</h3>
            <p className="text-neutral-400">Your complete health history will be displayed here.</p>
          </div>
        )}
      </div>
    </div>
  )
}