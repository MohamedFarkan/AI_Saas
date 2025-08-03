import { Scissors, Sparkles } from "lucide-react";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveObject = () => {
  const [input, setInput] = useState("");
  const [object, setObject] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const { isDark } = useOutletContext();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (object.split(" ").length > 1) {
        setLoading(false);
        return toast.error("Please enter only one object name");
      }

      const formData = new FormData();
      formData.append("image", input);
      formData.append("object", object);

      const { data } = await axios.post(
        "/api/ai/remove-image-object",
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
          <Sparkles className="w-6 text-[#FFB75E]" />
          <h1 className="text-xl font-semibold">Object Remover</h1>
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

        <p className="mt-6 text-sm font-medium">
          Describe the object to remove
        </p>
        <textarea
          rows={4}
          onChange={(e) => setObject(e.target.value)}
          value={object}
          className={`w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border ${
            isDark
              ? "bg-[#1e1e1e] text-gray-200 border-gray-600"
              : "border-gray-300"
          }`}
          placeholder="e.g, watch or spoon, Only single object name..."
          required
        />

        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#FFB75E] to-[#ED8F03] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg hover:from-[#e69d3d] hover:to-[#d87c00]">
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Scissors className="w-5" />
          )}
          Remove Object
        </button>
      </form>

      {/* Right col */}
      <div
        className={`w-full max-w-lg p-4 rounded-lg flex flex-col border min-h-96 ${
          isDark ? "bg-[#2a2a2a] border-gray-700" : "bg-white border-gray-200"
        }`}>
        <div className="flex items-center gap-3">
          <Scissors className="w-5 h-5 text-[#FFB75E]" />
          <h1 className="text-xl font-semibold">Processed image</h1>
        </div>
        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div
              className={`text-sm flex flex-col items-center gap-5 ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}>
              <Scissors className="w-9 h-9" />
              <p>Upload an image and click 'Remove Object' to begin</p>
            </div>
          </div>
        ) : (
          <img src={content} alt="image" className="mt-3 w-full h-full" />
        )}
      </div>
    </div>
  );
};

export default RemoveObject;
