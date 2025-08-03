import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import { useAuth } from "@clerk/clerk-react";
import { Clipboard, Check, Hash, Sparkles } from "lucide-react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitles = () => {
  const { isDark } = useOutletContext();

  const blogCategories = [
    "General",
    "Technology",
    "Business",
    "Health",
    "Lifestyle",
    "Education",
    "Travel",
    "Food",
  ];

  const [selectedCategory, setSelectedCategory] = useState("General");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);

  const { getToken } = useAuth();

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Title copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Generate 5 engaging blog title ideas for the keyword "${input}" in the category "${selectedCategory}". The titles should be clear, concise, and click-worthy. Include a mix of informative and creative styles. Return only the titles as a list.`;

      const { data } = await axios.post(
        "/api/ai/generate-blog-title",
        { prompt },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );
      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      //console.log(error);
    }
    setLoading(false);
  };

  const bgColor = isDark ? "bg-gray-800" : "bg-white";
  const borderColor = isDark ? "border-gray-700" : "border-gray-200";
  const textColor = isDark ? "text-gray-300" : "text-slate-700";
  const subTextColor = isDark ? "text-gray-400" : "text-gray-500";
  const inputStyle = isDark
    ? "bg-gray-700 text-gray-100 border-gray-600"
    : "bg-white text-black border-gray-300";

  return (
    <div
      className={`h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 ${textColor}`}>
      {/* Left col */}
      <form
        onSubmit={onSubmitHandler}
        className={`w-full max-w-lg p-4 rounded-lg border ${bgColor} ${borderColor}`}>
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#8E37EB]" />
          <h1 className="text-xl font-semibold">Title Generator</h1>
        </div>
        <p className="mt-6 text-sm font-medium">Keyword</p>
        <input
          type="text"
          onChange={(e) => setInput(e.target.value)}
          value={input}
          className={`w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border ${inputStyle}`}
          placeholder="e.g., How to Boost Productivity with AI Tools..."
          required
        />

        <p className="mt-4 text-sm font-medium">Category</p>

        <div className="mt-3 flex gap-3 flex-wrap sm:max-w-9/11">
          {blogCategories.map((item) => (
            <span
              key={item}
              onClick={() => setSelectedCategory(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer transition-all duration-200 ${
                selectedCategory === item
                  ? "bg-purple-50 text-purple-700 border-purple-300"
                  : isDark
                  ? "text-gray-400 border-gray-600 hover:bg-gray-700 hover:text-gray-200 hover:scale-105"
                  : "text-gray-500 border-gray-300 hover:bg-gray-100 hover:text-gray-700 hover:scale-105"
              }`}>
              {item}
            </span>
          ))}
        </div>

        <br />
        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#C341F6] to-[#8E37EB] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg hover:from-[#b035e9] hover:to-[#7d2dd5]">
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Hash className="w-5" />
          )}
          Generate title
        </button>
      </form>

      {/* Right col */}
      <div
        className={`w-full max-w-lg p-4 rounded-lg flex flex-col border min-h-96 ${bgColor} ${borderColor}`}>
        <div className="flex items-center gap-3">
          <Hash className="w-5 h-5 text-[#8E37Eb]" />
          <h1 className="text-xl font-semibold">Generated titles</h1>
        </div>
        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div
              className={`text-sm flex flex-col items-center gap-5 ${subTextColor}`}>
              <Hash className="w-9 h-9" />
              <p>
                Enter an inspiring topic and click 'Generate title' to begin
              </p>
            </div>
          </div>
        ) : (
          // <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600">
          //   <div className="reset-tw">
          //     <Markdown>{content}</Markdown>
          //   </div>
          // </div>
          <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600 relative">
            <button
              onClick={handleCopy}
              className="absolute top-1 right-3 p-2 bg-purple-600 text-white rounded-full shadow-md hover:bg-purple-700 transition-all duration-200 flex items-center justify-center"
              title="Copy to clipboard">
              {copied ? (
                <Check className="w-4 h-4 text-white" />
              ) : (
                <Clipboard className="w-4 h-4 text-white" />
              )}
            </button>

            <div className="reset-tw mt-8">
              <Markdown>{content}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogTitles;
