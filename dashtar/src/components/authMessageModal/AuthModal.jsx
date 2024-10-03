function AuthModal({ message, setUnAuthModal }) {
  return (
    <div
      className="flex flex-col p-2 items-center justify-center max-w-[80%]  md:max-w-[30%]
    max-h-[40%] overflow-auto bg-slate-300 dark:bg-gray-800 min-h-[5rem] rounded-lg relative"
    >
      <span
        className="absolute right-[0.5rem] top-[0.5rem] cursor-pointer text-[0.8rem]  dark:text-gray-400 text-gray-900 font-bold"
        onClick={() => setUnAuthModal(false)}
      >
        X
      </span>
      <span className="font-bold dark:text-gray-400 text-gray-900">
        Access Denied
      </span>
      <span className="font-light text-[0.9rem] dark:text-gray-400 text-gray-900">
        {message}
      </span>
    </div>
  );
}

export default AuthModal;
