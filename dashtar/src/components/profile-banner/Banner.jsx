import React, { useContext } from "react";

import Sample from "../../assets/img/sample.jpg";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import { AdminContext } from "@/context/AdminContext";
import img from "../../assets/img/no-image.jpeg"


export default function Banner() {
  const { currency } = useUtilsFunction();
  // const img =
  //   "`https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png`";
  const { state } = useContext(AdminContext);
  const { userInfo } = state;

  return (
    <div className="w-full gap-4 flex md:flex-row flex-col md:items-start items-center pt-3 pb-0 -mb-6">
      <div className="h-[20rem] md:w-[70%] w-full">
        <div className="h-[70%] relative w-full">
          <img
            src={userInfo.store_coverImg || img}
            className="w-full object-cover h-full rounded-xl"
          />
          <img
            src={userInfo.store_profileImg || img}
            className="md:w-[7rem] md:h-[7rem] w-[6rem] h-[6rem] absolute md:-bottom-[3.5rem] -bottom-[3.5rem] bg-white
              left-[1.5rem] border-emerald-500 border-[2px] rounded-lg object-cover"
          />
          <span className="flex items-center font-bold absolute md:left-[10rem] left-[9rem] py-2 text-[1.3rem] dark:text-gray-400 text-gray-700 ">
            {userInfo.store_name}
          </span>
        </div>
      </div>
      <div className="md:w-[30%] w-full md:h-[20rem] h-[13rem] mb-[3rem] md:mb-0">
        <div className="md:h-[70%] h-[100%] rounded-xl px-3 py-4 bg-emerald-500 w-full flex flex-col items-start justify-between">
          <label className="font-bold text-[1.5rem] text-white -mb-6">
            Wallet Balance
          </label>

          <label className="font-bold text-[1.4rem] text-white">
            {currency}15, 900
          </label>
          <div className="flex flex-col w-full gap-3">
            <button className="btn btn-sm h-[2.5rem] md:w-[100%] w-[70%] bg-white text-emerald-500 rounded-full border-none hover:bg-white">
              <span className="font-light">Total Balance: </span> 17,490
            </button>
            <button className="btn btn-sm h-[2.5rem] md:w-[80%] w-[40%] bg-orange-400 text-white rounded-full border-none hover:bg-orange-300">
              <span className="font-bold text-[1.3rem]">Withdraw</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
