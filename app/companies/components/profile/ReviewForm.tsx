import React, { useState } from 'react';
import { StarIcon, XIcon } from 'lucide-react';

interface ReviewFormProps {
  companyId: string;
  companyName: string;
  onSubmit: (reviewData: {
    rating: number;
    title: string;
    content: string;
    relationship: string;
    is_anonymous: boolean;
  }) => Promise<void>;
  onCancel: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
    companyId,
    companyName,
    onSubmit,
    onCancel
  }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [relationship, setRelationship] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      // Validate form
      if (rating === 0) {
        setError('Please select a rating');
        return;
      }
      
      if (!title.trim()) {
        setError('Please enter a review title');
        return;
      }
      
      if (!content.trim()) {
        setError('Please enter review content');
        return;
      }
      
      if (!relationship) {
        setError('Please select your relationship with the company');
        return;
      }
      
      try {
        setIsSubmitting(true);
        setError('');
        
        await onSubmit({
          rating,
          title,
          content,
          relationship,
          is_anonymous: isAnonymous
        });
        
        // Form will be closed by parent component on successful submission
      } catch (err) {
        setError('Failed to submit review. Please try again.');
        setIsSubmitting(false);
      }
    };
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Review {companyName}
            </h3>
            <button 
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <XIcon className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-200 rounded-md">
                {error}
              </div>
            )}
            
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Overall Rating
              </label>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 focus:outline-none"
                  >
                    <StarIcon 
                      className={`h-8 w-8 ${
                        star <= (hoverRating || rating) 
                          ? 'text-yellow-400' 
                          : 'text-gray-300 dark:text-gray-600'
                      }`} 
                      fill={star <= (hoverRating || rating) ? 'currentColor' : 'none'}
                    />
                  </button>
                ))}
                <span className="ml-2 text-gray-600 dark:text-gray-400">
                  {rating > 0 ? (
                    rating === 1 ? 'Poor' :
                    rating === 2 ? 'Below Average' :
                    rating === 3 ? 'Average' :
                    rating === 4 ? 'Good' :
                    'Excellent'
                  ) : 'Select a rating'}
                </span>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 dark:text-gray-300 mb-2">
                Review Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summarize your experience"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                maxLength={100}
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="content" className="block text-gray-700 dark:text-gray-300 mb-2">
                Review Details
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your experience working at or with this company"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-32"
                maxLength={2000}
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {2000 - content.length} characters remaining
              </p>
            </div>
            
            <div className="mb-4">
              <label htmlFor="relationship" className="block text-gray-700 dark:text-gray-300 mb-2">
                Your Relationship with the Company
              </label>
              <select
                id="relationship"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select your relationship</option>
                <option value="Current Employee">Current Employee</option>
                <option value="Former Employee">Former Employee</option>
                <option value="Interviewed">Interviewed</option>
                <option value="Contractor">Contractor</option>
                <option value="Client">Client</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  Post anonymously
                </span>
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-6">
                Your name and profile will not be displayed with your review
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  