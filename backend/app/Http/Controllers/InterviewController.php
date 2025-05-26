<?php

namespace App\Http\Controllers;

use App\Models\Interview;
use App\Models\JobApplication;
use App\Models\Candidate;
use App\Http\Resources\InterviewResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class InterviewController extends Controller
{
    /**
     * Display a listing of the interviews.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Interview::with([
            'jobApplication', 
            'jobApplication.candidate',
            'jobApplication.jobListing',
            'jobApplication.jobListing.company',
        ]);
        
        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        // Filter by type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }
        
        // Filter by date range
        if ($request->has('start_date')) {
            $query->where('scheduled_at', '>=', $request->start_date);
        }
        
        if ($request->has('end_date')) {
            $query->where('scheduled_at', '<=', $request->end_date);
        }
        
        // Filter by interviewer
        if ($request->has('interviewer_id')) {
            $query->where('interviewer_id', $request->interviewer_id);
        }
        
        // Sort options
        if ($request->has('sort')) {
            switch ($request->sort) {
                case 'recent':
                    $query->orderBy('created_at', 'desc');
                    break;
                case 'upcoming':
                    $query->orderBy('scheduled_at', 'asc');
                    break;
                case 'past':
                    $query->orderBy('scheduled_at', 'desc');
                    break;
                default:
                    $query->orderBy('scheduled_at', 'asc');
            }
        } else {
            $query->orderBy('scheduled_at', 'asc');
        }
        
        $interviews = $query->paginate($request->per_page ?? 10);
        
        return response()->json([
            'status' => 'success',
            'data' => InterviewResource::collection($interviews)
        ]);
    }
    
    /**
     * Store a newly created interview.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'job_application_id' => 'required|exists:job_applications,id',
            'scheduled_at' => 'required|date|after:now',
            'duration_minutes' => 'required|integer|min:15|max:240',
            'type' => 'required|string|in:phone,video,in-person,technical,hr',
            'status' => 'nullable|string|in:scheduled,completed,cancelled,rescheduled',
            'notes' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'meeting_link' => 'nullable|string|max:255',
            'interviewer_id' => 'nullable|exists:users,id',
            'interviewer_name' => 'nullable|string|max:255',
        ]);
        
        $interview = Interview::create($request->all());
        
        // Load relationships
        $interview->load([
            'jobApplication', 
            'jobApplication.candidate',
            'jobApplication.jobListing',
            'jobApplication.jobListing.company',
        ]);
        
        // Update job application status
        $jobApplication = JobApplication::find($request->job_application_id);
        if ($jobApplication && $jobApplication->status === 'applied') {
            $jobApplication->update(['status' => 'interview_scheduled']);
        }
        
        return response()->json([
            'status' => 'success',
            'message' => 'Interview scheduled successfully',
            'data' => new InterviewResource($interview)
        ], 201);
    }
    
    /**
     * Display the specified interview.
     */
    public function show(Interview $interview): JsonResponse
    {
        $interview->load([
            'jobApplication', 
            'jobApplication.candidate',
            'jobApplication.candidate.user',
            'jobApplication.jobListing',
            'jobApplication.jobListing.company',
        ]);
        
        return response()->json([
            'status' => 'success',
            'data' => new InterviewResource($interview)
        ]);
    }
    
    /**
     * Update the specified interview.
     */
    public function update(Request $request, Interview $interview): JsonResponse
    {
        $request->validate([
            'scheduled_at' => 'sometimes|date|after:now',
            'duration_minutes' => 'sometimes|integer|min:15|max:240',
            'type' => 'sometimes|string|in:phone,video,in-person,technical,hr',
            'status' => 'sometimes|string|in:scheduled,completed,cancelled,rescheduled',
            'notes' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'meeting_link' => 'nullable|string|max:255',
            'interviewer_id' => 'nullable|exists:users,id',
            'interviewer_name' => 'nullable|string|max:255',
            'feedback' => 'nullable|string',
            'outcome' => 'nullable|string|in:passed,failed,pending',
        ]);
        
        $interview->update($request->all());
        
        // If status changed to completed, update the interview info
        if ($request->has('status') && $request->status === 'completed' && $interview->status !== 'completed') {
            $interview->update([
                'feedback' => $request->feedback ?? $interview->feedback,
                'outcome' => $request->outcome ?? 'pending',
            ]);
            
            // Update job application status based on outcome
            if ($request->has('outcome')) {
                $jobApplication = $interview->jobApplication;
                if ($jobApplication) {
                    if ($request->outcome === 'passed') {
                        $jobApplication->update(['status' => 'interview_passed']);
                    } elseif ($request->outcome === 'failed') {
                        $jobApplication->update(['status' => 'rejected']);
                    }
                }
            }
        }
        
        // If status changed to cancelled, add cancellation reason
        if ($request->has('status') && $request->status === 'cancelled') {
            $interview->update([
                'notes' => $request->notes ?? $interview->notes,
            ]);
        }
        
        // If status changed to rescheduled, update the scheduled_at time
        if ($request->has('status') && $request->status === 'rescheduled') {
            if (!$request->has('scheduled_at')) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'New scheduled date is required when rescheduling an interview'
                ], 422);
            }
        }
        
        return response()->json([
            'status' => 'success',
            'message' => 'Interview updated successfully',
            'data' => new InterviewResource($interview)
        ]);
    }
    
    /**
     * Remove the specified interview.
     */
    public function destroy(Interview $interview): JsonResponse
    {
        $interview->delete();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Interview deleted successfully'
        ]);
    }
    
    /**
     * Get interviews for a specific candidate
     */
    public function candidateInterviews(Candidate $candidate): JsonResponse
    {
        $interviews = $candidate->upcomingInterviews()
            ->with(['jobApplication', 'jobApplication.jobListing', 'jobApplication.jobListing.company'])
            ->orderBy('scheduled_at')
            ->get();
            
        return response()->json([
            'status' => 'success',
            'data' => InterviewResource::collection($interviews)
        ]);
    }
    
    /**
     * Add feedback to an interview
     */
    public function addFeedback(Request $request, Interview $interview): JsonResponse
    {
        $request->validate([
            'feedback' => 'required|string',
            'outcome' => 'required|string|in:passed,failed,pending',
        ]);
        
        $interview->update([
            'feedback' => $request->feedback,
            'outcome' => $request->outcome,
            'status' => 'completed',
        ]);
        
        // Update job application status based on outcome
        $jobApplication = $interview->jobApplication;
        if ($jobApplication) {
            if ($request->outcome === 'passed') {
                $jobApplication->update(['status' => 'interview_passed']);
            } elseif ($request->outcome === 'failed') {
                $jobApplication->update(['status' => 'rejected']);
            }
        }
        
        return response()->json([
            'status' => 'success',
            'message' => 'Interview feedback added successfully',
            'data' => new InterviewResource($interview)
        ]);
    }
    
    /**
     * Reschedule an interview
     */
    public function reschedule(Request $request, Interview $interview): JsonResponse
    {
        $request->validate([
            'scheduled_at' => 'required|date|after:now',
            'notes' => 'nullable|string',
        ]);
        
        $interview->update([
            'scheduled_at' => $request->scheduled_at,
            'status' => 'rescheduled',
            'notes' => $request->notes ? $interview->notes . "\n\nRescheduled: " . $request->notes : $interview->notes,
        ]);
        
        return response()->json([
            'status' => 'success',
            'message' => 'Interview rescheduled successfully',
            'data' => new InterviewResource($interview)
        ]);
    }
    
    /**
     * Cancel an interview
     */
    public function cancel(Request $request, Interview $interview): JsonResponse
    {
        $request->validate([
            'notes' => 'nullable|string',
        ]);
        
        $interview->update([
            'status' => 'cancelled',
            'notes' => $request->notes ? $interview->notes . "\n\nCancellation reason: " . $request->notes : $interview->notes,
        ]);
        
        return response()->json([
            'status' => 'success',
            'message' => 'Interview cancelled successfully',
            'data' => new InterviewResource($interview)
        ]);
    }
    
    /**
     * Get upcoming interviews for a calendar view
     */
    public function calendar(Request $request): JsonResponse
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);
        
        $startDate = Carbon::parse($request->start_date)->startOfDay();
        $endDate = Carbon::parse($request->end_date)->endOfDay();
        
        $interviews = Interview::whereBetween('scheduled_at', [$startDate, $endDate])
            ->with([
                'jobApplication', 
                'jobApplication.candidate',
                'jobApplication.candidate.user',
                'jobApplication.jobListing',
                'jobApplication.jobListing.company'
            ])
            ->get()
            ->map(function ($interview) {
                return [
                    'id' => $interview->id,
                    'title' => $interview->jobApplication->jobListing->title . ' - ' . 
                            $interview->jobApplication->candidate->user->name,
                    'start' => $interview->scheduled_at->format('Y-m-d\TH:i:s'),
                    'end' => $interview->scheduled_at->addMinutes($interview->duration_minutes)->format('Y-m-d\TH:i:s'),
                    'type' => $interview->type,
                    'status' => $interview->status,
                    'location' => $interview->location,
                    'meeting_link' => $interview->meeting_link,
                    'company' => $interview->jobApplication->jobListing->company->name,
                    'candidate' => $interview->jobApplication->candidate->user->name,
                    'job_title' => $interview->jobApplication->jobListing->title,
                };
            });
            
        return response()->json([
            'status' => 'success',
            'data' => $interviews
        ]);
    }
}