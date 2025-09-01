import { useState } from "react";

const Accordion = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-light-gray rounded-xl overflow-hidden transition-all duration-300 hover:border-accent-orange/30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full cursor-pointer px-6 py-4 bg-white text-dark-blue font-medium text-left flex justify-between items-center hover:bg-light-gray/50 transition-colors"
      >
        <span>{title}</span>
        <span
          className={`transform transition-transform text-accent-orange ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-40 px-6 py-4" : "max-h-0"
        } bg-white text-dark-blue/80`}
      >
        {content}
      </div>
    </div>
  );
};

export default Accordion;
