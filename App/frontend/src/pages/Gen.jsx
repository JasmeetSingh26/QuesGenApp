import React, { useState } from "react";
import axios from "axios"; // Missing axios import

export default function Gen() {
  const [context, setContext] = useState("");
  const [answers, setAnswers] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("http://localhost:4000/gen", {
        context,
        answers,
      });
      console.log(data);
      setLoading(false);
      setQuestions(data.questions);
      alert("Successful!");
    } catch (error) {
      alert("Error. Please try again.");
    }
  };

  return (
    <div>
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Generate Questions</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="context" className="block text-sm font-medium mb-2">
              Context
            </label>
            <textarea
              id="context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Enter the context here..."
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="4"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="answers" className="block text-sm font-medium mb-2">
              Answers (Write multiple by comma)
            </label>
            <textarea
              id="answers"
              value={answers}
              onChange={(e) => setAnswers(e.target.value)}
              placeholder="Enter the answers here..."
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="4"
            />
          </div>
          {loading && <p>Loading...</p>}
          {!loading && (
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
              Submit
            </button>
          )}
        </form>
      </div>
      <div className="mb-4 mt-5 ml-6">
        <label htmlFor="questions" className="block text-sm font-medium mb-2">
          Questions
        </label>
        {questions.map((question, index) => (
          <div key={index}>
            <p>
              <strong>Answer:</strong> {question.answer}
            </p>
            <p>
              <strong>Question:</strong> {question.question}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
