import React from "react";
import { FaBookOpen, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const CourseCard = ({ 
  id,
  title = "Course Title", 
  description = "Course description goes here.", 
  thumbnailUrl, 
  progress, // Prop for progress percentage (0-100)
  isDarkTheme = false // ✅ NEW PROP for theme control
}) => {
  
  const coursePath = id ? `/student/coursedetails/${id}` : '#';
  const progressPercent = progress !== undefined ? Math.round(progress) : null;

  // --- Theme Class Definitions ---
  
  // Base card styling
  const cardClasses = isDarkTheme
    ? "bg-slate-800 border-slate-700 shadow-xl hover:shadow-2xl"
    : "bg-white border-gray-300 shadow-md hover:shadow-xl";

  // Text color styling
  const titleColor = isDarkTheme ? "text-white" : "text-black";
  const descriptionColor = isDarkTheme ? "text-gray-400" : "text-gray-600";

  // Placeholder background styling
  const placeholderBg = isDarkTheme ? "bg-slate-700" : "bg-blue-100";
  const placeholderIconColor = isDarkTheme ? "text-blue-400" : "text-blue-600";

  // Progress bar styling
  const progressBarTrackBg = isDarkTheme ? "bg-gray-700" : "bg-gray-200";
  const progressTextColor = isDarkTheme ? "text-teal-400" : "text-green-700";
  const progressBarFillBg = isDarkTheme ? "bg-teal-500" : "bg-green-600";
  
  // Action button styling
  const buttonBg = isDarkTheme ? "bg-blue-600 hover:bg-blue-500" : "bg-blue-600 hover:bg-blue-700";
  // --- END Theme Class Definitions ---

  return (
    <Link 
      to={coursePath} 
      className={`block border rounded-2xl transition cursor-pointer font-sans overflow-hidden ${cardClasses}`}
    >
      
      {/* Thumbnail / Image Section */}
      <div className="h-32 bg-gray-200 overflow-hidden">
        {thumbnailUrl ? (
          <img 
            src={thumbnailUrl} 
            alt={`Thumbnail for ${title}`} 
            className="w-full h-full object-cover transition duration-300 hover:scale-105"
          />
        ) : (
          <div className={`w-full h-full flex justify-center items-center ${placeholderBg}`}>
            <FaBookOpen className={`${placeholderIconColor} text-3xl`} />
          </div>
        )}
      </div>

      <div className="p-5">
        {/* Title */}
        <h3 className={`text-xl font-semibold line-clamp-2 ${titleColor}`}>{title}</h3>

        {/* Description */}
        <p className={`mt-1 text-sm line-clamp-2 ${descriptionColor}`}>{description}</p>

        {/* Progress Bar (Visible only for enrolled courses) */}
        {progressPercent !== null && (
          <div className="mt-4">
              <div className="flex justify-between mb-1 text-xs font-medium">
                  <span className={progressTextColor}>Progress</span>
                  <span className={progressTextColor}>{progressPercent}%</span>
              </div>
              <div className={`w-full ${progressBarTrackBg} rounded-full h-2`}>
                  <div 
                      className={`${progressBarFillBg} h-2 rounded-full`} 
                      style={{ width: `${progressPercent}%` }}
                  ></div>
              </div>
          </div>
        )}

        {/* Button */}
        <div 
          className={`mt-4 flex items-center gap-2 ${buttonBg} text-white px-4 py-1.5 rounded-xl transition text-sm w-fit`}
        >
          {progressPercent !== null ? "Continue" : "View Course"}
          <FaArrowRight size={14} />
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;