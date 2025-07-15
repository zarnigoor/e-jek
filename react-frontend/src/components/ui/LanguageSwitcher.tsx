import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FiGlobe, FiChevronDown } from 'react-icons/fi';

const languages = {
  uz: { nativeName: "O'zbekcha" },
  ru: { nativeName: 'Русский' },
};

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = i18n.language;

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <FiGlobe className="w-5 h-5 mr-2 text-gray-500" />
        <span className="uppercase">{currentLanguage}</span>
        <FiChevronDown className="w-5 h-5 ml-2 -mr-1 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full w-full mb-2 bg-white border border-gray-200 rounded-md shadow-lg">
          <ul className="py-1">
            {Object.keys(languages).map((lng) => (
              <li key={lng}>
                <button
                  onClick={() => changeLanguage(lng)}
                  className={`flex items-center w-full px-4 py-2 text-sm text-left ${
                    currentLanguage === lng ? 'font-bold text-blue-600' : 'text-gray-700'
                  } hover:bg-gray-100`}
                >
                  {languages[lng as keyof typeof languages].nativeName}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
