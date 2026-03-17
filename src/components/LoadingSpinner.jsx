import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[--color-cinema-gold]"></div>
    </div>
  );
};

export const SkeletonMovieCard = () => {
  return (
    <div className="bg-[--color-cinema-gray] rounded-lg overflow-hidden animate-pulse aspect-[2/3] w-full">
      <div className="h-full w-full bg-white/5"></div>
    </div>
  );
};

export default LoadingSpinner;
