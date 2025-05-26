import React, { useState } from 'react';
import { StarIcon, ThumbsUpIcon, ThumbsDownIcon, FlagIcon } from 'lucide-react';
import Image from 'next/image';

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

interface CompanyReviewsProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  ratingCounts: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  isAuthenticated: boolean;
  onAddReview: () => void;
}

export const CompanyReviews: React.FC<CompanyReviewsProps> = ({
  reviews,
  averageRating,
  totalReviews,
  ratingCounts,
  isAuthenticated,
  onAddReview
}) => {
  const [filter, setFilter] = useState('all');

  // Calculate rating percentages
  const ratingPercentages = {
    5: (ratingCounts[5] / totalReviews) * 100,
    4: (ratingCounts[4] / totalReviews) * 100,
    3: (ratingCounts[3] / totalReviews) * 100,
    2: (ratingCounts[2] / totalReviews) * 100,
    1: (ratingCounts[1] / totalReviews) * 100,
  };

  // Filter reviews
  const filteredReviews = filter === 'all'
    ? reviews
    : reviews.filter(review => {
      if (filter === 'positive') return review.rating >= 4;
      if (filter === 'neutral') return review.rating === 3;
      if (filter === 'negative') return review.rating <= 2;
      return true;
    });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4 flex items-center">
          <StarIcon className="mr-2 h-5 w-5 text-yellow-500" />
          Company Reviews
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Rating Summary */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`h-5 w-5 ${star <= Math.round(averageRating)
                        ? 'text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                      }`}
                    fill={star <= Math.round(averageRating) ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Based on {totalReviews} reviews
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center">
                  <div className="w-8 text-sm text-gray-600 dark:text-gray-400">
                    {rating} <StarIcon className="inline-block h-3 w-3 text-yellow-400" />
                  </div>
                  <div className="flex-1 h-2 mx-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{ width: `${ratingPercentages[rating]}%` }}
                    ></div>
                  </div>
                  <div className="w-8 text-xs text-gray-500 dark:text-gray-400 text-right">
                    {ratingCounts[rating]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Review CTA */}
          <div className="md:col-span-2 bg-teal-50 dark:bg-teal-900/30 rounded-lg p-6 flex flex-col justify-center">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Share your experience
            </h4>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Help others make informed decisions by sharing your experience with this company.
            </p>
            <button
              onClick={onAddReview}
              className={`px-4 py-2 rounded-md text-white font-medium ${isAuthenticated
                  ? 'bg-teal-600 hover:bg-teal-700'
                  : 'bg-gray-400 cursor-not-allowed'
                } transition-colors w-full md:w-auto self-start`}
              disabled={!isAuthenticated}
            >
              Write a Review
            </button>
            {!isAuthenticated && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Please sign in to write a review
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Review Filters */}
      <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-3 bg-gray-50 dark:bg-gray-700">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-sm rounded-full ${filter === 'all'
                ? 'bg-teal-100 dark:bg-teal-800 text-teal-800 dark:text-teal-100'
                : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200'
              } border border-gray-200 dark:border-gray-600`}
          >
            All Reviews
          </button>
          <button
            onClick={() => setFilter('positive')}
            className={`px-3 py-1 text-sm rounded-full ${filter === 'positive'
                ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100'
                : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200'
              } border border-gray-200 dark:border-gray-600`}
          >
            Positive
          </button>
          <button
            onClick={() => setFilter('neutral')}
            className={`px-3 py-1 text-sm rounded-full ${filter === 'neutral'
                ? 'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100'
                : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200'
              } border border-gray-200 dark:border-gray-600`}
          >
            Neutral
          </button>
          <button
            onClick={() => setFilter('negative')}
            className={`px-3 py-1 text-sm rounded-full ${filter === 'negative'
                ? 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100'
                : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200'
              } border border-gray-200 dark:border-gray-600`}
          >
            Negative
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {filteredReviews.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No reviews found matching your filter criteria.
            </p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  {!review.is_anonymous ? (
                    <>
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600 mr-3">
                        {review.user && review.user.avatar ? (
                          <Image
                            src={review.user.avatar}
                            alt={review.user.name}
                            width={40}
                            height={40}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          // fallback avatar or initials
                          <span className="flex items-center justify-center h-full w-full text-gray-500">
                            {review.user ? review.user.name[0] : "?"}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {review.user.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {review.relationship}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600 mr-3 flex items-center justify-center">
                        <svg className="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          Anonymous
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {review.relationship}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(review.created_at)}
                </div>
              </div>

              <div className="mb-2">
                <div className="flex items-center mb-1">
                  <div className="flex mr-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`h-4 w-4 ${star <= review.rating
                            ? 'text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                          }`}
                        fill={star <= review.rating ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {review.title}
                  </h4>
                </div>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {review.content}
                </p>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                    <ThumbsUpIcon className="h-4 w-4 mr-1" />
                    <span>Helpful ({review.helpful_count})</span>
                  </button>
                  <button className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                    <ThumbsDownIcon className="h-4 w-4 mr-1" />
                    <span>Not Helpful ({review.unhelpful_count})</span>
                  </button>
                </div>
                <button className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-red-500">
                  <FlagIcon className="h-4 w-4 mr-1" />
                  <span>Report</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
