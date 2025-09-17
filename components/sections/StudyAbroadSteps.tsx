"use client";

import React from 'react';
import { useState, useEffect } from "react";
import { CheckCircle, Circle, ArrowRight } from "lucide-react";

interface StudyAbroadStep {
  stepId: number;
  title: string;
  description: string;
  color?: string;
  bgColor?: string;
  textColor?: string;
  icon?: string;
}

interface StudyAbroadStepsProps {
  steps?: StudyAbroadStep[];
}

export default function StudyAbroadSteps({ steps: propSteps }: StudyAbroadStepsProps) {
  const [activeStep, setActiveStep] = useState(1);
  const [steps, setSteps] = useState<StudyAbroadStep[]>(propSteps || []);
  const [loading, setLoading] = useState(!propSteps);

  useEffect(() => {
    if (!propSteps) {
      fetchSteps();
    }
  }, [propSteps]);

  const fetchSteps = async () => {
    try {
      const response = await fetch('/api/admin/study-abroad-steps');
      if (response.ok) {
        const data = await response.json();
        setSteps(data.studyAbroadSteps || []);
      }
    } catch (error) {
      console.error('Failed to fetch study abroad steps:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="relative py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200/30 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-pink-200/30 rounded-full blur-lg"></div>
      </div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
            Study Abroad in Just 5 Steps
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our streamlined process makes your study abroad journey simple and stress-free
          </p>
        </div>
        
        {/* Progress line */}
        <div className="relative mb-16">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-brand-200 via-yellow-200 to-green-200 rounded-full transform -translate-y-1/2"></div>
          <div className="relative flex justify-between">
            {steps.map((step, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(step.stepId)}
                className={`relative z-10 w-12 h-12 rounded-full border-4 border-white shadow-lg transition-all duration-300 hover:scale-110 ${
                  activeStep >= step.stepId 
                    ? `bg-gradient-to-r ${step.color || 'from-blue-500 to-purple-500'}` 
                    : 'bg-gray-200'
                }`}
              >
                {activeStep >= step.stepId ? (
                  <CheckCircle className="w-6 h-6 text-white mx-auto" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-400 mx-auto" />
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Step cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-2 ${
                activeStep === step.stepId
                  ? `${step.bgColor || 'bg-blue-50'} border-current ${step.textColor || 'text-blue-600'} shadow-lg scale-105`
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setActiveStep(step.stepId)}
            >
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full mb-4 ${
                activeStep === step.stepId 
                  ? `bg-gradient-to-r ${step.color || 'from-blue-500 to-purple-500'} text-white` 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                <span className="font-bold">{step.stepId}</span>
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${
                activeStep === step.stepId ? step.textColor || 'text-blue-600' : 'text-gray-900'
              }`}>
                {step.title}
              </h3>
              <p className={`text-sm ${
                activeStep === step.stepId ? 'text-gray-700' : 'text-gray-600'
              }`}>
                {step.description}
              </p>
              
              {activeStep === step.stepId && (
                <div className="absolute -top-2 -right-2">
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${step.color || 'from-blue-500 to-purple-500'} flex items-center justify-center`}>
                    <ArrowRight className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}