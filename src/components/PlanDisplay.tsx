import React, { useState } from 'react';
import { CheckCircle2, Circle, Clock, AlertTriangle, Copy, ExternalLink, Trello } from 'lucide-react';
import { ProjectPlan, ProjectTask } from '../types';

interface PlanDisplayProps {
  plan: ProjectPlan;
  onExportToTrello: () => void;
  isExporting: boolean;
}

export const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan, onExportToTrello, isExporting }) => {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  const toggleTask = (taskId: string) => {
    const newCompleted = new Set(completedTasks);
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId);
    } else {
      newCompleted.add(taskId);
    }
    setCompletedTasks(newCompleted);
  };

  const copyToClipboard = async () => {
    const planText = `${plan.goal}\n\nTimeline: ${plan.timeline}\nEstimated Time: ${plan.totalEstimatedTime}\n\n${plan.phases.map(phase => 
      `${phase.title}\n${phase.description}\nDuration: ${phase.estimatedDuration}\n\nTasks:\n${phase.tasks.map(task => 
        `• ${task.title}\n  ${task.description}\n  Time: ${task.estimatedTime}\n  Priority: ${task.priority.toUpperCase()}`
      ).join('\n\n')}`
    ).join('\n\n---\n\n')}`;

    try {
      await navigator.clipboard.writeText(planText);
      setCopiedToClipboard(true);
      setTimeout(() => setCopiedToClipboard(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="w-3 h-3" />;
      case 'medium': return <Clock className="w-3 h-3" />;
      case 'low': return <Circle className="w-3 h-3" />;
      default: return <Circle className="w-3 h-3" />;
    }
  };

  const completedCount = completedTasks.size;
  const totalTasks = plan.phases.reduce((acc, phase) => acc + phase.tasks.length, 0);
  const progress = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">{plan.goal}</h2>
        <div className="flex flex-wrap gap-4 text-sm opacity-90">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            Timeline: {plan.timeline}
          </div>
          <div className="flex items-center">
            <AlertTriangle className="w-4 h-4 mr-1" />
            Est. Time: {plan.totalEstimatedTime}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Progress: {completedCount}/{totalTasks} tasks</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={copyToClipboard}
            className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
          >
            <Copy className="w-4 h-4 mr-2" />
            {copiedToClipboard ? 'Copied!' : 'Copy Plan'}
          </button>
          
          <button
            onClick={onExportToTrello}
            disabled={isExporting}
            className="flex items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Exporting...
              </>
            ) : (
              <>
                <Trello className="w-4 h-4 mr-2" />
                🚀 Export to Trello
              </>
            )}
          </button>
        </div>
      </div>

      {/* Phases */}
      <div className="p-6 space-y-6">
        {plan.phases.map((phase, phaseIndex) => (
          <div key={phase.id} className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Phase {phaseIndex + 1}: {phase.title}
              </h3>
              <p className="text-gray-600 text-sm mb-2">{phase.description}</p>
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="w-3 h-3 mr-1" />
                Duration: {phase.estimatedDuration}
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              {phase.tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md ${
                    completedTasks.has(task.id) 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => toggleTask(task.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {completedTasks.has(task.id) ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    
                    <div className="flex-grow min-w-0">
                      <h4 className={`font-semibold ${
                        completedTasks.has(task.id) ? 'text-green-800 line-through' : 'text-gray-900'
                      }`}>
                        {task.title}
                      </h4>
                      <p className={`text-sm mt-1 ${
                        completedTasks.has(task.id) ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {task.description}
                      </p>
                      
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                          {getPriorityIcon(task.priority)}
                          <span className="ml-1 capitalize">{task.priority}</span>
                        </span>
                        
                        <span className="inline-flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {task.estimatedTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};