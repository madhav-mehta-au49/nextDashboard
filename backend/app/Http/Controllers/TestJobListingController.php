<?php

namespace App\Http\Controllers;

use App\Models\JobListing;
use App\Http\Requests\StoreJobListingRequest;
use App\Http\Requests\UpdateJobListingRequest;
use Illuminate\Http\JsonResponse;

class TestJobListingController extends Controller
{
    public function store(StoreJobListingRequest $request): JsonResponse
    {
        // Simplified logic
        try {
            $validatedData = $request->validated();
            $jobListing = JobListing::create($validatedData);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Job listing created successfully',
                'data' => $jobListing
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create job listing: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show(JobListing $jobListing): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => $jobListing
        ]);
    }

    public function update(UpdateJobListingRequest $request, JobListing $jobListing): JsonResponse
    {
        try {
            $inputData = $request->validated();
            $jobListing->update($inputData);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Job listing updated successfully',
                'data' => $jobListing
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update job listing: ' . $e->getMessage()
            ], 500);
        }
    }
}
