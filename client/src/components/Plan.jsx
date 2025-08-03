import { PricingTable } from "@clerk/clerk-react";

const Plan = () => {
  return (
    <div className="max-w-2xl mx-auto z-20 my-30 -mt-7">
      <div className="text-center">
        <h2 className="text-slate-700 text-[42px] font-semibold">
          Choose your plan
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          Start your journey absolutely free, and unlock powerful premium
          features as you grow — scale your content, creativity, and business
          with flexible plans designed to evolve with your goals.
        </p>
      </div>
      <div className="mt-14 max-sm:mx-8">
        <PricingTable />
      </div>
    </div>
  );
};
export default Plan;
