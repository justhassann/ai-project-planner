import React, { useState } from 'react';
import { Target, Clock, Layers, Sparkles } from 'lucide-react';
import { PlanGenerationRequest } from '../types';

interface InputFormProps {
  onSubmit: (request: PlanGenerationRequest) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [goal, setGoal] = useState('');
  const [timeline, setTimeline] = useState('');
  const [detailLevel, setDetailLevel] = useState<'basic' | 'detailed' | 'comprehensive'>('detailed');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (goal.trim() && timeline.trim()) {
      onSubmit({ goal: goal.trim(), timeline: timeline.trim(), detailLevel });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          AI Project Planner
        </h1>
        <p className="text-gray-600 text-lg">
          Transform your ideas into actionable project plans in seconds
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
            <Target className="w-4 h-4 mr-2 text-blue-500" />
            What's your project goal?
          </label>
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g., Build a mobile app for tracking daily habits with user authentication and analytics dashboard"
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
            <Clock className="w-4 h-4 mr-2 text-green-500" />
            What's your target timeline?
          </label>
          <input
            type="text"
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            placeholder="e.g., 3 months, 6 weeks, 2 months"
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>

        <div>
          <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
            <Layers className="w-4 h-4 mr-2 text-purple-500" />
            Level of detail
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'basic', label: 'Basic', desc: 'High-level overview' },
              { value: 'detailed', label: 'Detailed', desc: 'Comprehensive breakdown' },
              { value: 'comprehensive', label: 'Comprehensive', desc: 'Complete roadmap' }
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setDetailLevel(option.value as any)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  detailLevel === option.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="font-semibold">{option.label}</div>
                <div className="text-xs mt-1 opacity-70">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !goal.trim() || !timeline.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Generating Plan...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Project Plan
            </div>
          )}
        </button>
      </form>
    </div>
  );
};