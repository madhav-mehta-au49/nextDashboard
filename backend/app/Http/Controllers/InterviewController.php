<?php

namespace App\Http\Controllers;

use App\Models\Interview;
use App\Models\JobApplication;
use App\Models\Candidate;
use App\Http\Resources\InterviewResource;
use App\Mail\InterviewScheduled;
use App\Mail\InterviewUpdated;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
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
            $query->where('interview_type', $request->type);
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
        
        // Filter by job application
        if ($request->has('job_application_id')) {
            $query->where('job_application_id', $request->job_application_id);
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
            'data' => InterviewResource::collection($interviews),
            'meta' => [
                'current_page' => $interviews->currentPage(),
                'last_page' => $interviews->lastPage(),
                'per_page' => $interviews->perPage(),
                'total' => $interviews->total(),
            ]
        ]);
    }
      /**
     * Store a newly created interview.
     */    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'job_application_id' => 'required|exists:job_applications,id',
            'interview_type' => 'required|string|in:phone,video,in-person,panel',
            'scheduled_at' => 'required|date|after:now',
            'duration_minutes' => 'required|integer|min:15|max:240',
            'location' => 'nullable|string|max:255',
            'meeting_link' => 'nullable|url|max:500',
            'interviewer_ids' => 'nullable|array',
            'interviewer_ids.*' => 'exists:users,id',
            'interview_notes' => 'nullable|string|max:2000',
            'candidate_notes' => 'nullable|string|max:1000',
            'internal_notes' => 'nullable|string|max:2000',
            'timezone' => 'nullable|string|max:50',
        ]);
          $interview = Interview::create(array_merge($validatedData, [
            'status' => 'scheduled',
            'timezone' => $request->timezone ?? 'UTC',
        ]));
        
        // Load relationships
        $interview->load([
            'jobApplication',
            'jobApplication.candidate',
            'jobApplication.jobListing',
            'jobApplication.jobListing.company',
        ]);
        
        // Update job application status
        $jobApplication = JobApplication::find($request->job_application_id);
        if ($jobApplication && $jobApplication->status === 'reviewing') {
            $jobApplication->update(['status' => 'interview_scheduled']);
        }
        
        // Send interview scheduled notification
        try {
            if ($interview->jobApplication && $interview->jobApplication->candidate && 
                $interview->jobApplication->candidate->user && $interview->jobApplication->candidate->user->email) {
                Mail::to($interview->jobApplication->candidate->user->email)
                    ->send(new InterviewScheduled($interview));
            }
        } catch (\Exception $e) {
            \Log::error('Failed to send interview scheduled notification', [
                'interview_id' => $interview->id,
                'error' => $e->getMessage()
            ]);
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
     */    public function update(Request $request, Interview $interview): JsonResponse
    {
        $validatedData = $request->validate([
            'interview_type' => 'sometimes|string|in:phone,video,in-person,panel',
            'scheduled_at' => 'sometimes|date|after:now',
            'duration_minutes' => 'sometimes|integer|min:15|max:240',
            'location' => 'nullable|string|max:255',
            'meeting_link' => 'nullable|url|max:500',
            'interviewer_ids' => 'nullable|array',
            'interviewer_ids.*' => 'exists:users,id',
            'interview_notes' => 'nullable|string|max:2000',
            'candidate_notes' => 'nullable|string|max:1000',
            'internal_notes' => 'nullable|string|max:2000',
            'status' => 'sometimes|string|in:scheduled,confirmed,completed,cancelled,rescheduled',
            'timezone' => 'nullable|string|max:50',
        ]);
          // Capture original values for change detection
        $originalScheduledAt = $interview->scheduled_at;
        $originalStatus = $interview->status;
        
        $interview->update($validatedData);
        
        // Determine change type for email notification
        $changeType = 'updated';
        if ($request->has('status')) {
            if ($request->status === 'cancelled') {
                $changeType = 'cancelled';
            } elseif ($request->status === 'rescheduled' || 
                     ($request->has('scheduled_at') && $originalScheduledAt !== $request->scheduled_at)) {
                $changeType = 'rescheduled';
            }
        } elseif ($request->has('scheduled_at') && $originalScheduledAt !== $request->scheduled_at) {
            $changeType = 'rescheduled';
        }
        
        // Send interview update notification
        try {
            if ($interview->jobApplication && $interview->jobApplication->candidate && 
                $interview->jobApplication->candidate->user && $interview->jobApplication->candidate->user->email) {
                Mail::to($interview->jobApplication->candidate->user->email)
                    ->send(new InterviewUpdated($interview, $changeType));
            }
        } catch (\Exception $e) {
            \Log::error('Failed to send interview update notification', [
                'interview_id' => $interview->id,
                'error' => $e->getMessage()
            ]);
        }
        
        // If status changed to completed, update the job application
        if ($request->has('status') && $request->status === 'completed') {
            $jobApplication = $interview->jobApplication;
            if ($jobApplication) {
                $jobApplication->update(['status' => 'interviewed']);
            }
        }
        
        // If status changed to cancelled, revert job application status
        if ($request->has('status') && $request->status === 'cancelled') {
            $jobApplication = $interview->jobApplication;
            if ($jobApplication && $jobApplication->status === 'interview_scheduled') {
                $jobApplication->update(['status' => 'reviewing']);
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
            ->get()            ->map(function ($interview) {
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
                ];
            });
            
        return response()->json([
            'status' => 'success',
            'data' => $interviews
        ]);
    }
}