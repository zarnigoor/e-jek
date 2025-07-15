import { useState, useEffect } from "react";
import api from "../../services/api";
import Spinner from "../../components/ui/Spinner";
import toast from "react-hot-toast";
import Modal from "../../components/ui/Modal";
import { FiEye, FiDownload } from "react-icons/fi";
import { useTranslation } from "react-i18next";

interface Application {
  _id: string;
  userId: {
    login: string;
    name?: string;
    dom: number;
    uy: number;
  };
  mutaxassislik: string;
  muammoTavsifi: string;
  status: string;
  createdAt: string;
  navbatRaqami?: number;
}

const ApplicationsList = () => {
  const { t } = useTranslation();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const handleExportPdf = async () => {
    try {
      toast.loading(t("exporting_applications"), { id: "exporting" });
      const response = await api.get("/admin/applications/export-pdf", {
        responseType: "blob", // Important for handling binary data
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "applications.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success(t("export_success"), { id: "exporting" });
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error(t("export_error"), { id: "exporting" });
    }
  };

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(
          `/admin/applications?status=${statusFilter}&sortBy=${sortBy}`,
        );
        setApplications(data);
      } catch (error) {
        toast.error(t("all_applications_toast_load_error"));
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [statusFilter, sortBy, t]);

  const openDescriptionModal = (app: Application) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ochiq":
        return "bg-yellow-500 text-white";
      case "bajarildi":
        return "bg-green-500 text-white";
      case "amalga_oshirilmadi":
        return "bg-red-500 text-white";
      case "bekor_qilingan":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const getStatusName = (status: string) => {
    const key = `status_${status.replace("_", "")}`;
    return t(key);
  };

  const getSpecialtyName = (specialty: string) => {
    const key = `specialty_${specialty.replace("-", "_")}`;
    return t(key);
  };

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-darkText">{t("all_applications_title")}</h1>
        <button
          onClick={handleExportPdf}
          className="px-6 py-2 text-white transition-all duration-200 ease-in-out transform rounded-md shadow-md bg-primary hover:bg-primaryDark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex items-center gap-2 hover:scale-105 active:scale-95"
        >
          <FiDownload size={18} />
          {t("export_to_pdf")}
        </button>
      </div>

      <div className="flex flex-col gap-4 mb-4 md:flex-row">
        <select
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full px-4 py-2 border rounded-md md:w-auto bg-dark-card text-darkText border-borderColor focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 ease-in-out"
        >
          <option value="all">{t("status_all")}</option>
          <option value="ochiq">{t("status_open")}</option>
          <option value="bajarildi">{t("status_completed")}</option>
          <option value="amalga_oshirilmadi">{t("status_not_completed")}</option>
        </select>
        <select
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-4 py-2 border rounded-md md:w-auto bg-dark-card text-darkText border-borderColor focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 ease-in-out"
        >
          <option value="newest">{t("all_applications_sort_newest")}</option>
          <option value="oldest">{t("all_applications_sort_oldest")}</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Spinner />
        </div>
      ) : (
        <div className="p-4 bg-dark-card border rounded-lg shadow-sm border-borderColor">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-darkText">
              <thead className="bg-dark-hover">
                <tr>
                  <th className="px-4 py-3 font-semibold">{t("table_header_login")}</th>
                  <th className="px-4 py-3 font-semibold">{t("table_header_name")}</th>
                  <th className="px-4 py-3 font-semibold">{t("table_header_specialty")}</th>
                  <th className="px-4 py-3 font-semibold">{t("table_header_status")}</th>
                  <th className="px-4 py-3 font-semibold">{t("table_header_queue")}</th>
                  <th className="px-4 py-3 font-semibold">{t("table_header_date")}</th>
                  <th className="px-4 py-3 font-semibold text-center">{t("table_header_description")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderColor">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-dark-hover transition-colors duration-200">
                    <td className="px-4 py-3 font-medium">
                      {app.userId.login}
                    </td>
                    <td className="px-4 py-3">{app.userId.name || t("not_available")}</td>
                    <td className="px-4 py-3 capitalize">
                      {getSpecialtyName(app.mutaxassislik)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs font-bold rounded-full ${getStatusBadge(app.status)}`}
                      >
                        {getStatusName(app.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {app.status === "ochiq" && app.navbatRaqami !== null
                        ? app.navbatRaqami
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => openDescriptionModal(app)}
                        className="text-primary hover:text-primaryDark transition-transform duration-200 ease-in-out hover:scale-110"
                        title={t("action_view_description")}
                      >
                        <FiEye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t("table_header_description")}
      >
        {selectedApp && (
          <div>
            <p className="p-4 text-base rounded-md bg-dark-bg text-darkText">
              {selectedApp.muammoTavsifi}
            </p>
            <div className="flex justify-end pt-4 mt-4 border-t border-borderColor">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 font-semibold rounded-md text-darkText bg-gray-600 hover:bg-gray-700 transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95"
              >
                {t("action_close")}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ApplicationsList;
