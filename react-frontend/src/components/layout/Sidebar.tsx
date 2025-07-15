import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  FiBarChart2,
  FiFileText,
  FiUsers,
  FiPlusSquare,
  FiLogOut,
  FiUser,
  FiMenu,
  FiArrowLeft,
} from "react-icons/fi";
import LanguageSwitcher from "../ui/LanguageSwitcher";
import { useTranslation } from "react-i18next"; // useTranslation import qilingan

interface SidebarProps {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  isMobile: boolean;
}

const Sidebar = ({ isOpen, setOpen, isMobile }: SidebarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation(); // t funksiyasini olish

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const links =
    user?.role === "admin"
      ? [
          {
            path: "/admin/stats",
            icon: <FiBarChart2 size={20} />,
            label: t("sidebar_stats"), // Tarjima
          },
          {
            path: "/admin/applications",
            icon: <FiFileText size={20} />,
            label: t("sidebar_applications"), // Tarjima
          },
          {
            path: "/admin/users",
            icon: <FiUsers size={20} />,
            label: t("sidebar_users"), // Tarjima
          },
          {
            path: "/admin/create-user",
            icon: <FiPlusSquare size={20} />,
            label: t("sidebar_createUser"), // Tarjima
          },
        ]
      : [
          {
            path: "/user/submit-application",
            icon: <FiPlusSquare size={20} />,
            label: t("sidebar_submitApplication"), // Tarjima
          },
          {
            path: "/user/my-applications",
            icon: <FiFileText size={20} />,
            label: t("sidebar_myApplications"), // Tarjima
          },
        ];

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden ${
          isOpen && isMobile ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside
        className={`z-30 h-full bg-dark-card shadow-lg flex flex-col transition-all duration-300 ease-in-out
          ${isOpen ? "w-64" : "w-20"} relative
        `}
      >
        <div
          className={`flex items-center p-4 border-b border-borderColor h-[69px] flex-shrink-0 ${!isOpen ? "justify-center" : "justify-between"}`}
        >
          {isOpen && (
            <h1 className="text-xl font-bold text-primary">{t("mahalla_title")}</h1> // Tarjima
          )}
          <button
            onClick={() => setOpen(!isOpen)}
            className="text-darkText focus:outline-none"
          >
            {isOpen ? <FiArrowLeft size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        <div
          className={`p-4 border-b border-borderColor ${!isOpen ? "hidden" : "block"}`}
        >
          <div className="flex items-center">
            <FiUser className="w-5 h-5 text-darkText" />
            <span className="ml-3 text-sm font-semibold text-darkText">
              {user?.login}
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => isMobile && setOpen(false)}
              className={({ isActive }) =>
                `flex items-center py-3 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 px-4 ${
                  isActive
                    ? "bg-primary shadow-lg text-white"
                    : "text-darkText hover:bg-dark-hover"
                }`
              }
              title={link.label}
            >
              {isOpen ? (
                <div className="flex items-center">
                  {link.icon}
                  <span className="ml-3">
                    {link.label}
                  </span>
                </div>
              ) : (
                link.icon
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          {isOpen && <LanguageSwitcher />}
        </div>

        <div
          className={`p-4 border-t border-borderColor ${!isOpen ? "flex justify-center" : ""}`}
        >
          <button
            onClick={handleLogout}
            className={`flex items-center w-full py-3 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 text-danger hover:bg-red-500 hover:text-white px-4`}
            title={t("sidebar_logout")} // Tarjima
          >
            <FiLogOut size={20} />
            {isOpen && <span className="ml-3">{t("sidebar_logout")}</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
