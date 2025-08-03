import { Edit, Edit2, Sparkles } from "lucide-react";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import { Clipboard, Check } from "lucide-react"; // add Check icon

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const WriteArticle = () => {
  const { isDark } = useOutletContext();

  const articleLength = [
    { length: 800, text: "Short (500-800 words)" },
    { length: 1200, text: "Medium (800-1200 words)" },
    { length: 1600, text: "Long (1200+ words)" },
  ];

  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);

  const { getToken } = useAuth();

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Article copied to clipboard!");
    setTimeout(() => setCopied(false), 2000); // reset after 2 seconds
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Write a detailed and engaging article on the topic: "${input}". The article should be approximately ${selectedLength.length} words and follow a logical structure with an introduction, key points with headings, and a conclusion. Make the tone informative yet accessible to a general audience.`;

      const { data } = await axios.post(
        "/api/ai/generate-article",
        { prompt, length: selectedLength.length },
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
    }
    setLoading(false);
  };

  const bgColor = isDark ? "bg-gray-800" : "bg-white";
  const borderColor = isDark ? "border-gray-700" : "border-gray-200";
  const textColor = isDark ? "text-gray-300" : "text-slate-700";
  const subTextColor = isDark ? "text-gray-400" : "text-gray-500";
  const inputBg = isDark
    ? "bg-gray-700 text-gray-100 border-gray-600"
    : "bg-white text-black border-gray-300";

  return (
    <div
      className={`h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 ${textColor}`}>
      {/* left col */}
      <form
        onSubmit={onSubmitHandler}
        className={`w-full max-w-lg p-4 rounded-lg border ${bgColor} ${borderColor}`}>
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Article Configuration</h1>
        </div>
        <p className="mt-6 text-sm font-medium">Article Topic</p>
        <input
          type="text"
          onChange={(e) => setInput(e.target.value)}
          value={input}
          className={`w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border ${inputBg}`}
          placeholder="e.g., How to Boost Productivity with AI Tools..."
          required
        />

        <p className="mt-4 text-sm font-medium">Article Length</p>

        <div className="mt-3 flex gap-3 flex-wrap sm:max-w-9/11">
          {articleLength.map((item, index) => (
            <span
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer transition-all duration-200
                ${
                  selectedLength.text === item.text
                    ? "bg-blue-50 text-blue-700 border-blue-300"
                    : isDark
                    ? "text-gray-400 border-gray-600 hover:bg-gray-700 hover:text-gray-200 hover:scale-105"
                    : "text-gray-500 border-gray-300 hover:bg-gray-100 hover:text-gray-700 hover:scale-105"
                }`}
              key={index}
              onClick={() => setSelectedLength(item)}>
              {item.text}
            </span>
          ))}
        </div>

        <br />
        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#226BFF] to-[#65ADFF] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg hover:from-[#1c5ae6] hover:to-[#4b9cff]">
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Edit2 className="w-5" />
          )}
          Generate article
        </button>
      </form>

      {/* Right col */}
      <div
        className={`w-full max-w-lg p-4 rounded-lg flex flex-col border min-h-96 max-h-[600px] ${bgColor} ${borderColor}`}>
        <div className="flex items-center gap-3">
          <Edit className="w-5 h-5 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Generated article</h1>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div
              className={`text-sm flex flex-col items-center gap-5 ${subTextColor}`}>
              <Edit className="w-9 h-9" />
              <p>
                Enter an inspiring topic and click 'Generate Article' to begin
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
              className="absolute top-3 right-3 p-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-all duration-200 flex items-center justify-center"
              title="Copy to clipboard">
              {copied ? (
                <Check className="w-4 h-4 text-white" />
              ) : (
                <Clipboard className="w-4 h-4 text-white" />
              )}
            </button>

            <div className="reset-tw mt-8">
              {" "}
              {/* push content down to avoid overlap */}
              <Markdown>{content}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WriteArticle;
