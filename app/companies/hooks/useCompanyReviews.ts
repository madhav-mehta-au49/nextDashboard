import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface Review {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  title: string;
  content: string;
  relationship: string;
  created_at: string;
  is_anonymous: boolean;
  helpful_count: number;
  unhelpful_count: number;
}

interface ReviewData {
  rating: number;
  title: string;
  content: string;
  relationship: string;
  is_anonymous: boolean;
}

export function useCompanyReviews(companyId: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [ratingCounts, setRatingCounts] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      
      console.log(`Fetching reviews for company: ${companyId}`);
      
      try {
        const response = await axios.get(`${API_URL}/companies/${companyId}/reviews`);
        console.log("Reviews API Response:", response);
        
        if (response.data && response.data.status === 'success') {
          const reviewsData = response.data.data;
          
          // Handle both array and pagination object formats
          const reviewsList = Array.isArray(reviewsData) 
            ? reviewsData 
            : (reviewsData.data || []);
            
          setReviews(reviewsList);
          
          // Calculate average rating
          if (reviewsList.length > 0) {
            const sum = reviewsList.reduce((acc, review) => acc + review.rating, 0);
            setAverageRating(sum / reviewsList.length);
            
            // Count reviews by rating (1-5)
            const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
            reviewsList.forEach(review => {
              counts[review.rating] = (counts[review.rating] || 0) + 1;
            });
            setRatingCounts(counts);
            
            setTotalReviews(reviewsList.length);
          }
        } else {
          console.error("API returned unsuccessfully:", response);
          setError('Failed to fetch reviews');
        }
      } catch (apiError) {
        console.error("Error fetching reviews:", apiError);
        // Don't set error for 404 (no reviews yet)
        if (apiError.response?.status !== 404) {
          setError(`Failed to fetch reviews: ${apiError.message || 'Unknown error'}`);
        } else {
          // If 404, just set empty reviews
          setReviews([]);
          setTotalReviews(0);
        }
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Error in fetchReviews:', err);
      setError('An unexpected error occurred while fetching reviews');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [companyId]);

  const submitReview = async (reviewData: ReviewData) => {
    try {
      await axios.post(
        `${API_URL}/companies/${companyId}/reviews`, 
        reviewData
      );
      
      // Refresh reviews after submission
      await fetchReviews();
      setShowReviewForm(false);
    } catch (err) {
      console.error('Error submitting review:', err);
      throw err;
    }
  };

  const markReviewHelpful = async (reviewId: string, isHelpful: boolean) => {
    try {
      await axios.post(
        `${API_URL}/reviews/${reviewId}/feedback`,
        { is_helpful: isHelpful }
      );
      
      // Update the review in the local state
      setReviews(prevReviews => 
        prevReviews.map(review => {
          if (review.id === reviewId) {
            return {
              ...review,
              helpful_count: isHelpful 
                ? review.helpful_count + 1 
                : review.helpful_count,
              unhelpful_count: !isHelpful 
                ? review.unhelpful_count + 1 
                : review.unhelpful_count
            };
          }
          return review;
        })
      );
    } catch (err) {
      console.error('Error marking review as helpful:', err);
      throw err;
    }
  };

  const reportReview = async (reviewId: string, reason: string) => {
    try {
      await axios.post(
        `${API_URL}/reviews/${reviewId}/report`,
        { reason }
      );
    } catch (err) {
      console.error('Error reporting review:', err);
      throw err;
    }
  };

  return {
    reviews,
    averageRating,
    totalReviews,
    ratingCounts,
    isLoading,
    error,
    showReviewForm,
    setShowReviewForm,
    submitReview,
    markReviewHelpful,
    reportReview
  };
}