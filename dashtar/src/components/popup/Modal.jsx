// Modal.js
import React, { useEffect, useState } from "react";
import "./Modal.css";
import { Switch } from "antd";
import { ArrowDown2, ArrowUp2 } from "iconsax-react";

const Modal = ({ isOpen, onClose, selectedTime, setSelectedTime, saveTime }) => {
  if (!isOpen) return null;

  const [toggle, setToggle] = useState(false);

const handleToggle = () => { 
    setToggle(!toggle);
}
  
  useEffect(() => { 
setSelectedTime(selectedTime);
  }, [selectedTime])

  const incrementHours = () => {
    setSelectedTime((prevTime) => {
      const newHours = (prevTime.hours % 12) + 1;
      return {...prevTime, hours: newHours}
  })
}

  const decrementHours = () => {
    setSelectedTime((prevTime) => {
      const newHours = prevTime.hours === 1 ? 12 : prevTime.hours - 1;
    return { ...prevTime, hours: newHours };
    })
  };

   const incrementMinutes = () => {
    setSelectedTime((prevTime) => {
      const newMinutes = (prevTime.minutes % 59) + 1;
      return {...prevTime, minutes: newMinutes}
    })
     
}

  const decrementMinutes = () => {
    setSelectedTime((prevTime) => {
      const newMinutes = prevTime.minutes === 0 ? 59 : prevTime.minutes - 1;
    return { ...prevTime, minutes: newMinutes };
    })
  };
   
  
  
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 className="text-[19px] font-bold text-gray-500">Sat, 27 May</h2>
        <div className="flex items-center justify-start gap-5">
          <h3 className="text-[19px] font-semibold text-gray-800">
            Coming Online
          </h3>
          {/* TOGGLE SWITCH */}
          <button
            onClick={() => setToggle(!toggle)}
            className={` toggle ${toggle ? "active" : ""}`}
          >
            <div className="thumb"></div>
          </button>
          {/*END OF TOGGLE SWITCH */}
        </div>
        <div className="flex items-start justify-start flex-col gap-3">
          <p className={`text-gray-400 text-[16px] font-semibold  `}>
            Set Closing Time
          </p>
          <div className="flex items-center justify-between w-full flex-col md:flex-row gap-6 pr-5">
            {/* TIMER PICKER */}
            <div
              className={`${
                toggle ? "opacity-[1]" : "opacity-[0.5]"
              } flex items-center justify-center gap-5`}
            >
              <div className="flex items-center justify-center gap-3 w-full">
                <div className=" w-10 flex items-center justify-center flex-col p-3 h-24">
                  <button
                    disabled={toggle ? false : true}
                    onClick={incrementHours}
                  >
                    <ArrowUp2 size="32" color="#FF8A65" />
                  </button>
                  <h1 className="text-[20px] bg-slate-200 p-3 rounded-xl font-bold text-gray-800">
                    {selectedTime.hours < 10
                      ? `0${selectedTime.hours}`
                      : `${selectedTime.hours}`}
                  </h1>
                  <button
                    disabled={toggle ? false : true}
                    onClick={decrementHours}
                  >
                    <ArrowDown2 size="32" color="#FF8A65" />
                  </button>
                </div>
                <div className="seperator">
                  <h1 className="text-[28px] p-0 font-bold text-gray-800">:</h1>
                </div>
                <div className="w-10 flex items-center justify-center flex-col p-1 h-24">
                  <button
                    disabled={toggle ? false : true}
                    onClick={incrementMinutes}
                  >
                    <ArrowUp2 size="32" color="#FF8A65" />
                  </button>
                  <h1 className="text-[20px] bg-slate-200 p-3 rounded-xl font-bold text-gray-800">
                    {selectedTime.minutes < 10
                      ? `0${selectedTime.minutes}`
                      : `${selectedTime.minutes}`}
                  </h1>
                  <button
                    disabled={toggle ? false : true}
                    onClick={decrementMinutes}
                  >
                    <ArrowDown2 size="32" color="#FF8A65" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-center p-3 bg-slate-200 rounded-xl">
                <button
                  disabled={toggle ? false : true}
                  className="flex items-center justify-center  "
                  onClick={() => {
                    setSelectedTime((prevTime) => {
                      const newDayPart =
                        prevTime.dayPart === "AM" ? "PM" : "AM";
                      return { ...prevTime, dayPart: newDayPart };
                    });
                  }}
                >
                  <h1 className="text-[18px] font-semibold text-gray-800">
                    {selectedTime.dayPart}
                  </h1>
                  {/* rotate-icon */}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <button
                disabled={toggle ? false : true}
                className={` border-none outline-none w-28 h-10 rounded-full bg-[#3bb77e] disabled:bg-[#aeebcf] text-[17px] font-semibold text-white `}
                onClick={saveTime}
              >
                Save
              </button>
              <button
                className="border-none outline-none w-28 h-10 rounded-full -mr-5 bg-[#ec961f] text-[17px] font-semibold text-white"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
