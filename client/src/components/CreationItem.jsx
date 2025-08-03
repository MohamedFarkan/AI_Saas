import { useState } from "react";
import Markdown from "react-markdown";
import { Trash2, Copy } from "lucide-react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const CreationItem = ({ item, isDark, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation(); // prevent expand toggle

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: "Deleting...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        await onDelete(item.id); // assuming onDelete returns a Promise
        Swal.fire("Deleted!", "Your creation has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error", error.message || "Failed to delete.", "error");
      }
    }
  };

  const handleCopy = (e) => {
    e.stopPropagation(); // prevent expand toggle
    navigator.clipboard.writeText(item.content);
    toast.success("Content copied to clipboard");
  };
  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className={`p-4 max-w-5xl text-sm border rounded-lg cursor-pointer transition-colors duration-300
        ${
          isDark
            ? "bg-gray-800 border-gray-700 text-gray-300"
            : "bg-white border-gray-200 text-gray-900"
        }`}>
      <div className="flex justify-between items-center gap-4">
        <div>
          <h2>{item.prompt}</h2>
          <p className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>
            {item.type} -{" "}
            {new Date(item.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Buttons container */}
        <div className="flex items-center gap-2">
          <button
            className={`px-4 py-1 rounded-full border ${
              isDark
                ? "bg-gray-700 border-gray-600 text-gray-300"
                : "bg-[#EFF6FF] border-[#BFDBFE] text-[#1E40AF]"
            }`}>
            {item.type}
          </button>

          {/* Copy icon button */}
          <button
            onClick={handleCopy}
            className="cursor-pointer p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
            aria-label="Copy content">
            <Copy size={16} />
          </button>

          {/* Delete icon button */}
          <button
            onClick={handleDelete}
            className="cursor-pointer p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition"
            aria-label="Delete creation">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {expanded && (
        <div>
          {item.type === "image" ? (
            <div>
              <img
                src={item.content}
                alt="image"
                className="mt-3 w-full max-w-md rounded"
              />
            </div>
          ) : (
            <div
              className={`mt-3 w-full overflow-y-scroll text-sm ${
                isDark ? "text-gray-300" : "text-slate-700"
              }`}>
              <div className="reset-tw">
                <Markdown>{item.content}</Markdown>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreationItem;
