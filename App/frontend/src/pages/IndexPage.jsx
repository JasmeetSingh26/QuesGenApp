import { Link } from "react-router-dom";
import React from 'react';


function IndexPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-0 mb-12">
      <div className="flex flex-col md:flex-row items-center justify-between mt-12 mb-12">
        <div className="w-full md:w-1/2 text-left">
          <h1 className="text-4xl font-bold mb-4">QuesGen</h1>
          <p className="text-gray-600 text-lg  max-w-lg">
            QuesGen is a cutting-edge application that generates high-quality 
            multiple-choice questions (MCQs) from any given text. Designed for 
            educators, students, and content creators, it simplifies the process 
            of creating engaging quizzes and assessments with just a few clicks.
          </p>
        </div>

        <div className="w-full md:w-1/2 flex justify-center pl-2">
          <img
            src="https://i.pinimg.com/736x/d0/80/56/d0805620dd988a1ffc1b4c58e233d19a.jpg"
            alt="QuesGen Illustration"
            className="rounded-lg shadow-md"
          />
        </div>
      </div>

      <div className="bg-gray-100 py-12 px-6 rounded-lg shadow-md text-center">
        <h2 className="text-3xl font-semibold mb-4">
          Ready to try out QuesGen?
        </h2>
        <p className="text-gray-600 text-lg mb-6">
          Experience the power of automated question generation. Click below to 
          start exploring the app and generate your own MCQs today!
        </p>
        <Link
          to="/generate"
          className="bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Try the App
        </Link>
      </div>
    </div>
  );
}

export default IndexPage;
