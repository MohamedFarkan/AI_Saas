import { Image, Sparkles } from "lucide-react";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenerateImages = () => {
  const { isDark } = useOutletContext();

  const imageStyle = [
    "Realistic",
    "Gibly style",
    "Anime style",
    "Cartoon style",
    "Fantasy style",
    "Realistic type",
    "3D style",
    "Portrait style",
  ];

  const [selectedStyle, setSelectedStyle] = useState("Realistic");
  const [input, setInput] = useState("");
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const downloadImage = async (url) => {
    try {
      const response = await fetch(url, { mode: "cors" });
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "generated-image.png";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download image.");
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      //const prompt = `Generate an image of ${input} in the style ${selectedStyle}`;
      const prompt = `Create a visually stunning, high-quality image of "${input}" in a "${selectedStyle}" style. Focus on strong composition, relevant lighting, and stylistic consistency.`;

      const { data } = await axios.post(
        "/api/ai/generate-image",
        { prompt, publish },
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

  return (
    <div
      className={`h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 ${
        isDark ? "bg-[#1e1e1e] text-gray-200" : "text-slate-700"
      }`}>
      {/* left col */}
      <form
        onSubmit={onSubmitHandler}
        className={`w-full max-w-lg p-4 rounded-lg border ${
          isDark ? "bg-[#2a2a2a] border-gray-700" : "bg-white border-gray-200"
        }`}>
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#FF3D3D]" />
          <h1 className="text-xl font-semibold">Image Generator</h1>
        </div>
        <p className="mt-6 text-sm font-medium">Describe Your Image</p>
        <textarea
          rows={4}
          onChange={(e) => setInput(e.target.value)}
          value={input}
          className={`w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border ${
            isDark
              ? "bg-[#1e1e1e] text-gray-100 border-gray-600"
              : "border-gray-300"
          }`}
          placeholder="Describe your image here..."
          required
        />

        <p className="mt-4 text-sm font-medium">Style</p>

        <div className="mt-3 flex gap-3 flex-wrap sm:max-w-9/11">
          {imageStyle.map((item) => (
            <span
              key={item}
              onClick={() => setSelectedStyle(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer transition-all duration-200 ${
                selectedStyle === item
                  ? "bg-orange-50 text-orange-700 border-orange-300"
                  : isDark
                  ? "text-gray-300 border-gray-600 hover:bg-gray-800 hover:text-white"
                  : "text-gray-500 border-gray-300 hover:bg-gray-100 hover:text-gray-700"
              }`}>
              {item}
            </span>
          ))}
        </div>

        <div className="my-6 flex items-center gap-2">
          <label className="relative cursor-pointer">
            <input
              type="checkbox"
              onChange={(e) => setPublish(e.target.checked)}
              checked={publish}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-orange-500 transition"></div>
            <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4"></span>
          </label>
          <p
            className={`text-sm transition-colors duration-200 ${
              publish
                ? isDark
                  ? "text-gray-200 font-medium"
                  : "text-gray-600 font-medium"
                : "text-gray-400"
            }`}>
            Make this image public
          </p>
        </div>

        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#FF3D3D] to-[#FF6B81] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg hover:from-[#FF5A5A] hover:to-[#FFC8A2]">
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Image className="w-5" />
          )}
          Generate Image
        </button>
      </form>

      {/* Right col */}
      <div
        className={`w-full max-w-lg p-4 rounded-lg flex flex-col border min-h-96 ${
          isDark ? "bg-[#2a2a2a] border-gray-700" : "bg-white border-gray-200"
        }`}>
        <div className="flex items-center gap-3">
          <Image className="w-5 h-5 text-[#FF3D3D]" />
          <h1 className="text-xl font-semibold">Generated image</h1>
        </div>
        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div
              className={`text-sm flex flex-col items-center gap-5 ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}>
              <Image className="w-9 h-9" />
              <p>Describe your image and click 'Generate Image' to begin</p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full">
            <img src={content} alt="image" className="w-full h-full" />
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => downloadImage(content)}
                className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-2 rounded-lg transition-all">
                Download Image
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default GenerateImages;
