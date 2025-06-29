import { corsHeaders } from '../_shared/cors.ts';

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

interface GeneratePlanRequest {
  goal: string;
  timeline: string;
  detailLevel: 'basic' | 'detailed' | 'comprehensive';
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { goal, timeline, detailLevel }: GeneratePlanRequest = await req.json();

    if (!goal || !timeline) {
      return new Response(
        JSON.stringify({ error: 'Goal and timeline are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Gemini API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const systemPrompt = `You are an expert project manager and strategic planner. Your task is to create comprehensive, actionable project plans that break down complex goals into manageable phases and tasks.

Generate a detailed project plan as a JSON object with the following structure:
{
  "id": "unique-id",
  "goal": "user's goal",
  "timeline": "user's timeline",
  "totalEstimatedTime": "total estimated time",
  "phases": [
    {
      "id": "phase-id",
      "title": "Phase Title",
      "description": "Phase description",
      "estimatedDuration": "duration",
      "tasks": [
        {
          "id": "task-id",
          "title": "Task Title",
          "description": "Detailed task description",
          "estimatedTime": "time estimate",
          "priority": "high|medium|low",
          "dependencies": ["task-ids that must be completed first"]
        }
      ]
    }
  ],
  "createdAt": "current ISO date"
}

Guidelines:
- Create 3-6 logical phases depending on complexity
- Each phase should have 3-8 actionable tasks
- Tasks should be specific, measurable, and realistic
- Include time estimates that add up logically
- Assign realistic priorities based on dependencies and importance
- Consider the user's timeline when estimating durations
- Make descriptions clear and actionable
- Use professional project management terminology

Detail Level Guidelines:
- Basic: High-level phases with essential tasks only
- Detailed: Comprehensive breakdown with most necessary tasks
- Comprehensive: Complete roadmap with all possible tasks and considerations

Create a ${detailLevel} project plan for:
Goal: ${goal}
Timeline: ${timeline}

Return only the JSON object, no additional text or formatting.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: systemPrompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    const planText = data.candidates[0].content.parts[0].text;
    
    try {
      // Clean the response text to extract JSON
      const jsonMatch = planText.match(/\{[\s\S]*\}/);
      const cleanedText = jsonMatch ? jsonMatch[0] : planText;
      
      const plan = JSON.parse(cleanedText);
      
      // Validate the plan structure
      if (!plan.goal || !plan.phases || !Array.isArray(plan.phases)) {
        throw new Error('Invalid plan structure');
      }

      // Ensure required fields are present
      if (!plan.id) {
        plan.id = `plan-${Date.now()}`;
      }
      if (!plan.createdAt) {
        plan.createdAt = new Date().toISOString();
      }

      // Ensure all phases have IDs
      plan.phases.forEach((phase: any, index: number) => {
        if (!phase.id) {
          phase.id = `phase-${index + 1}`;
        }
        // Ensure all tasks have IDs
        phase.tasks.forEach((task: any, taskIndex: number) => {
          if (!task.id) {
            task.id = `task-${index + 1}-${taskIndex + 1}`;
          }
        });
      });

      return new Response(JSON.stringify(plan), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('Raw response:', planText);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to generate valid plan structure',
          details: 'The AI response could not be parsed as valid JSON'
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
  } catch (error) {
    console.error('Error generating plan:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate project plan',
        details: error.message || 'Unknown error occurred'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});