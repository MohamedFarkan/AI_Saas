import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
//import { dummyPublishedCreationData } from "../assets/assets";
import { Heart } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useUser();
  const { isDark } = useOutletContext();
  const { getToken } = useAuth();

  const fetchCreations = async () => {
    try {
      const { data } = await axios.get("/api/user/get-published-creations", {
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

  const imageLikeToggle = async (id) => {
    try {
      const { data } = await axios.post(
        "/api/user/toggle-like-creation",
        { id },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchCreations();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCreations();
    }
  }, [user]);

  return !loading ? (
    <div
      className={`flex-1 h-full flex flex-col gap-4 p-6 ${
        isDark ? "bg-[#1e1e1e] text-gray-200" : ""
      }`}>
      <h1 className="text-2xl font-semibold">Creations</h1>

      <div
        className={`h-full w-full rounded-xl overflow-y-scroll ${
          isDark ? "bg-[#2a2a2a]" : "bg-white"
        }`}>
        {creations.map((creation, index) => (
          <div
            key={index}
            className="relative group inline-block pl-3 pt-3 w-full sm:max-w-1/2 lg:max-w-1/3">
            <img
              src={creation.content}
              className="w-full h-full object-cover rounded-lg"
              alt=""
            />
            <div className="absolute bottom-0 top-0 right-0 left-3 flex gap-2 items-end justify-end group-hover:justify-between p-3 group-hover:bg-gradient-to-b from-transparent to-black/80 text-white rounded-lg">
              <p className="text-sm hidden group-hover:block">
                {creation.prompt}
              </p>
              <div className="flex gap-1 items-center">
                <p>{creation.likes.length}</p>
                <Heart
                  onClick={() => imageLikeToggle(creation.id)}
                  className={`min-w-5 h-5 hover:scale-110 cursor-pointer ${
                    creation.likes.includes(user.id)
                      ? "fill-red-500 text-red-600"
                      : "text-white"
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    // <div className="flex justify-center items-center h-full">
    //   <span className="w-10 h-10 my-1 rounded-full border-3 border-primary border-t-transparent animate-spin"></span>
    // </div>
    <div
      className={`flex-1 h-full flex flex-col gap-4 p-6 ${
        isDark ? "bg-[#1e1e1e] text-gray-200" : ""
      }`}>
      <h1 className="text-2xl font-semibold">Creations</h1>

      <div
        className={`h-full w-full rounded-xl overflow-y-scroll grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${
          isDark ? "bg-[#2a2a2a]" : "bg-white"
        } p-4`}>
        {[...Array(6)].map((_, index) => (
          <div key={index} className="w-full">
            <Skeleton
              height={220}
              baseColor={isDark ? "#374151" : "#e0e0e0"}
              highlightColor={isDark ? "#4b5563" : "#f5f5f5"}
              style={{ borderRadius: "0.5rem" }}
            />
            <Skeleton
              height={16}
              width={`60%`}
              baseColor={isDark ? "#374151" : "#e0e0e0"}
              highlightColor={isDark ? "#4b5563" : "#f5f5f5"}
              style={{ marginTop: "0.5rem" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;
