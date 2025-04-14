import { useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";
import axios from "axios";
import { motion } from "framer-motion";
import { FaRobot, FaCode, FaUpload, FaSpinner } from "react-icons/fa";

function App() {
  const [code, setCode] = useState(`def sum():  \n  return a + b \n`);
  const [review, setReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    prism.highlightAll();
  }, []);

  async function reviewCode() {
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/ai/get-review/", { code });
      setReview(response.data);
    } catch (error) {
      setReview("Error: Could not get review. Please try again.");
    }
    setIsLoading(false);
  }

  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCode(e.target.result);
      };
      reader.readAsText(file);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full text-center py-8 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg"
      >
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
            <FaRobot className="text-5xl" />
            CodeMedic
          </h1>
          <p className="text-xl text-blue-100">Your AI-powered code doctor</p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Code Editor Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-800 rounded-xl shadow-xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FaCode className="text-blue-400" />
                Your Code
              </h2>
              <div className="relative">
                <input
                  type="file"
                  accept=".js, .py, .css, .cpp, .cs, .ts, .html, .json, .java"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer transition-colors"
                >
                  <FaUpload />
                  Upload File
                </label>
              </div>
            </div>
            
            {fileName && (
              <p className="text-sm text-gray-400 mb-2">File: {fileName}</p>
            )}

            <div className="border border-gray-600 rounded-lg overflow-hidden">
              <Editor
                value={code}
                onValueChange={(code) => setCode(code)}
                highlight={(code) => prism.highlight(code, prism.languages.javascript, "javascript")}
                padding={10}
                style={{
                  fontFamily: "Fira Code, monospace",
                  fontSize: 16,
                  backgroundColor: "#1a1a1a",
                  minHeight: "300px",
                }}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={reviewCode}
              disabled={isLoading}
              className="w-full mt-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-500 hover:to-blue-600 rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <FaRobot />
                  Review Code
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Review Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gray-800 rounded-xl shadow-xl p-6 border border-gray-700"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaRobot className="text-purple-400" />
              AI Review
            </h2>
            <div className="prose prose-invert max-w-none">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <FaSpinner className="animate-spin text-4xl text-blue-500" />
                </div>
              ) : (
                <Markdown
                  rehypePlugins={[rehypeHighlight]}
                  className="text-gray-300"
                >
                  {review || "Your code review will appear here..."}
                </Markdown>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default App;
