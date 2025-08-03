import { Eraser, Sparkles } from "lucide-react";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveBackground = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const { isDark } = useOutletContext();

  const downloadImage = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "processed-image.png";
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

      const formData = new FormData();
      formData.append("image", input);

      const { data } = await axios.post(
        "/api/ai/remove-image-background",
        formData,
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
          <Sparkles className="w-6 text-[#00BFA5]" />
          <h1 className="text-xl font-semibold">Image Background Remover</h1>
        </div>

        <p className="mt-6 text-sm font-medium">Upload image</p>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setInput(e.target.files[0])}
          className={`w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border ${
            isDark
              ? "bg-[#1e1e1e] text-gray-300 border-gray-600"
              : "text-gray-600 border-gray-300"
          } cursor-pointer`}
          required
        />

        <p
          className={`text-xs font-light mt-1 ${
            isDark ? "text-gray-500" : "text-gray-500"
          }`}>
          Supports JPG, PNG, and other image formats
        </p>

        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00BFA5] to-[#00E5FF] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg hover:from-[#00A893] hover:to-[#00CFFF]">
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Eraser className="w-5" />
          )}
          Remove Background
        </button>
      </form>

      {/* Right col */}
      <div
        className={`w-full max-w-lg p-4 rounded-lg flex flex-col border min-h-96 ${
          isDark ? "bg-[#2a2a2a] border-gray-700" : "bg-white border-gray-200"
        }`}>
        <div className="flex items-center gap-3">
          <Eraser className="w-5 h-5 text-[#00BFA5]" />
          <h1 className="text-xl font-semibold">Processed image</h1>
        </div>
        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div
              className={`text-sm flex flex-col items-center gap-5 ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}>
              <Eraser className="w-9 h-9" />
              <p>Upload an image and click 'Remove Background' to begin</p>
            </div>
          </div>
        ) : (
          <>
            <img src={content} alt="image" className="mt-3 w-full h-full" />
            <button
              onClick={() => downloadImage(content)}
              className="mt-4 w-full bg-gradient-to-r from-[#00BFA5] to-[#00E5FF] text-white py-2 rounded-lg hover:from-[#00A893] hover:to-[#00CFFF] transition">
              Download Image
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default RemoveBackground;
