"use client";

import clsx from "clsx";
import { Search, Star } from "lucide-react";
import { useState } from "react";

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  content: string;
  helpful: number;
  notHelpful: number;
  images?: string[];
}

interface ReviewSectionProps {
  overallRating: number;
  totalReviews: number;
  ratingDistribution: Record<number, number>;
  reviews: Review[];
}

const ReviewSection = ({
  overallRating = 4.8,
  totalReviews = 1106,
  ratingDistribution = {
    5: 960,
    4: 132,
    3: 10,
    2: 1,
    1: 3,
  },
  reviews = [],
}: ReviewSectionProps) => {
  const [sortBy, setSortBy] = useState("most_recent");
  const [searchQuery, setSearchQuery] = useState("");

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={clsx(
              "h-5 w-5",
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-200",
            )}
          />
        ))}
      </div>
    );
  };

  const calculatePercentage = (count: number) => {
    return (count / totalReviews) * 100;
  };

  return (
    <div className="col-span-full mx-auto w-full max-w-7xl px-4 py-8">
      {/* Header Section */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Customer Reviews</h2>
          <div className="mt-2 flex items-center">
            <span className="mr-2 text-4xl font-bold">{overallRating}</span>
            {renderStars(overallRating)}
            <span className="ml-2 text-gray-600">
              Based on {totalReviews} Reviews
            </span>
          </div>
        </div>
        <div className="space-x-4">
          <button className="rounded-md border border-gray-300 px-6 py-2 hover:bg-gray-50">
            Ask a Question
          </button>
          <button className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
            Write a Review
          </button>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="mb-8">
        {[5, 4, 3, 2, 1].map((rating) => (
          <div key={rating} className="mb-2 flex items-center">
            <div className="flex w-24 items-center">{renderStars(rating)}</div>
            <div className="mx-4 flex-1">
              <div className="h-4 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full bg-yellow-400"
                  style={{
                    width: `${calculatePercentage(ratingDistribution[rating] ?? 0)}%`,
                  }}
                />
              </div>
            </div>
            <div className="w-16 text-right text-gray-600">
              ({ratingDistribution[rating] ?? 0})
            </div>
          </div>
        ))}
      </div>

      {/* Search and Sort Controls */}
      <div className="mb-6 flex items-center justify-between">
        <div className="relative max-w-lg flex-1">
          <input
            type="text"
            placeholder="Search reviews..."
            className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
        </div>
        <select
          className="ml-4 rounded-md border border-gray-300 px-4 py-2"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort reviews by"
        >
          <option value="most_recent">Most Recent</option>
          <option value="highest_rated">Highest Rated</option>
          <option value="lowest_rated">Lowest Rated</option>
          <option value="most_helpful">Most Helpful</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  {renderStars(review.rating)}
                  <span className="ml-2 font-medium">{review.author}</span>
                </div>
                <div className="mt-1 text-sm text-gray-500">{review.date}</div>
              </div>
            </div>
            <p className="mt-4 text-gray-700">{review.content}</p>
            {review.images && review.images.length > 0 && (
              <div className="mt-4 flex space-x-2">
                {review.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Review image ${index + 1}`}
                    className="h-20 w-20 rounded object-cover"
                  />
                ))}
              </div>
            )}
            <div className="mt-4 flex items-center space-x-4">
              <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                <span>Helpful ({review.helpful})</span>
              </button>
              <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                <span>Not Helpful ({review.notHelpful})</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;
