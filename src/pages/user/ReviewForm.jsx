import React, { useState } from 'react';
import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs'
const ReviewForm = ({ productId, onClose, onSubmitSuccess, handleSubmit }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [hover, setHover] = useState(0);

  const reviewData={
    review,
    rating,
  }

  const handleStarClick = (index) => {
    setRating((prev) => (prev === index + 1 ? index + 0.5 : index + 1));
    

  };






  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Write a Review</h2>
        <form onSubmit={(e)=>handleSubmit(e,reviewData)}>
          <div className="flex flex-col items-center mb-4">
            <p className="text-sm text-gray-600 mb-2">Click on the stars to rate</p>
            <div className="flex mt-1 gap-1 text-[#FF9E3A] text-xs">
              {Array(5)
                .fill("_")
                .map((_, index) => (
                  <div
                    key={index}
                    onClick={() => handleStarClick(index)}
                    className={`cursor-pointer ${
                      index < rating ? "text-[#FF9E3A]" : "text-slate-500"
                    } text-sm md:text-xs`}
                  >
                    {index < rating ? (
                      index === Math.floor(rating) && rating % 1 !== 0 ? (
                        <BsStarHalf />
                      ) : (
                        <BsStarFill />
                      )
                    ) : (
                      <BsStar />
                    )}
                  </div>
                ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Your rating: {rating > 0 ? `${rating}/5` : "Not rated yet"}
            </p>
          </div>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Write your review"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
            rows="4"
            required
          />
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              disabled={rating === 0}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;

