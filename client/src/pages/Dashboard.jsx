import { useEffect, useState } from "react";
//import { dummyCreationData } from "../assets/assets";
import { Gem, WandSparkles } from "lucide-react";
import { Protect, useAuth } from "@clerk/clerk-react";
import CreationItem from "../components/CreationItem";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
// import { useDarkMode } from "../hooks/useDarkMode";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Dashboard = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);

  const { getToken } = useAuth();
  const { isDark } = useOutletContext();

  const getDashboardData = async () => {
    try {
      const { data } = await axios.get("/api/user/get-user-creations", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setCreations(data.creations);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  //extra work
  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete("/api/user/delete-creation", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
        data: { id },
      });

      if (data.success) {
        setCreations((prev) => prev.filter((item) => item.id !== id));
        return Promise.resolve();
      } else {
        toast.error(data.message);
        return Promise.reject(new Error(data.message));
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete");
      return Promise.reject(error);
    }
  };

  // Define styles or classes based on isDark
  const bgColor = isDark ? "#1F2937" : "white"; // dark:bg-gray-800
  const textColor = isDark ? "text-gray-300" : "text-gray-600";
  const borderColor = isDark ? "border-gray-700" : "border-gray-200";

  return (
    <div
      className={`h-full overflow-y-scroll p-6`}
      style={{ backgroundColor: isDark ? "#111827" : "#F4F7FB" }}>
      <div className="flex justify-start gap-4 flex-wrap">
        {loading ? (
          <>
            {/* Skeleton for Total Creations card */}
            <div
              className="w-72 p-4 px-6 rounded-xl"
              style={{ backgroundColor: bgColor }}>
              <Skeleton
                height={20}
                width={100}
                baseColor={isDark ? "#374151" : "#e0e0e0"}
              />
              <Skeleton
                height={32}
                width={60}
                baseColor={isDark ? "#374151" : "#e0e0e0"}
                className="mt-2"
              />
            </div>

            {/* Skeleton for Active Plan card */}
            <div
              className="w-72 p-4 px-6 rounded-xl"
              style={{ backgroundColor: bgColor }}>
              <Skeleton
                height={20}
                width={100}
                baseColor={isDark ? "#374151" : "#e0e0e0"}
              />
              <Skeleton
                height={32}
                width={80}
                baseColor={isDark ? "#374151" : "#e0e0e0"}
                className="mt-2"
              />
            </div>
          </>
        ) : (
          <>
            {/* Total creations card */}
            <div
              className={`flex justify-between items-center w-72 p-4 px-6 rounded-xl border ${borderColor}`}
              style={{ backgroundColor: bgColor }}>
              <div className={textColor}>
                <p className="text-sm">Total Creations</p>
                <h2 className="text-xl font-semibold">{creations.length}</h2>
              </div>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] text-white flex justify-center items-center">
                <WandSparkles className="w-5 text-white" />
              </div>
            </div>

            {/* Active plan card */}
            <div
              className={`flex justify-between items-center w-72 p-4 px-6 rounded-xl border ${borderColor}`}
              style={{ backgroundColor: bgColor }}>
              <div className={textColor}>
                <p className="text-sm">Active Plan</p>
                <h2 className="text-xl font-semibold">
                  <Protect plan="premium" fallback="Free">
                    Premium
                  </Protect>
                </h2>
              </div>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF61C5] to-[#0BB0D7] text-white flex justify-center items-center">
                <Gem className="w-5 text-white" />
              </div>
            </div>
          </>
        )}
      </div>

      {loading ? (
        <div className="space-y-6 mt-6">
          <div className="mt-6 space-y-4">
            <Skeleton
              height={24}
              width={160}
              baseColor={isDark ? "#374151" : "#e0e0e0"}
              highlightColor={isDark ? "#4b5563" : "#f5f5f5"}
            />
            {[...Array(5)].map((_, i) => (
              <div key={i}>
                <Skeleton
                  height={70}
                  baseColor={isDark ? "#374151" : "#e0e0e0"}
                  highlightColor={isDark ? "#4b5563" : "#f5f5f5"}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          className={`${isDark ? "text-gray-300" : "text-gray-900"} space-y-3`}>
          <p className="mt-6 mb-4 ">Recent Creations</p>
          {creations.map((item) => (
            <CreationItem
              key={item.id}
              item={item}
              isDark={isDark}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default Dashboard;
