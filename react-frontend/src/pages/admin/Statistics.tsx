import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Spinner from "../../components/ui/Spinner";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface StatsData {
  daily: number;
  monthly: number;
  yearly: number;
  completed: number;
  open: number;
  rejected: number;
  cancelled: number;
}

const StatCard = ({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) => (
  <div
    className="bg-dark-card p-6 rounded-lg shadow-md border-2 flex-1 min-w-0 transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-xl"
    style={{ borderColor: color }}
  >
    <div className="text-sm font-medium text-gray-400 mb-2">{title}</div>
    <div className="text-3xl font-bold" style={{ color }}>
      {value}
    </div>
  </div>
);

const Statistics: React.FC = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/admin/stats");
        setStats(data);
      } catch (error) {
        toast.error(t("stats_toast_load_error"));
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [t]);

  const chartData = {
    labels: [
      t("stats_card_daily"),
      t("stats_card_monthly"),
      t("stats_card_yearly"),
      t("stats_card_completed"),
      t("stats_card_open"),
      t("stats_card_rejected"),
      t("stats_card_cancelled"),
    ],
    datasets: [
      {
        label: t("stats_chart_label"),
        data: stats
          ? [
              stats.daily,
              stats.monthly,
              stats.yearly,
              stats.completed,
              stats.open,
              stats.rejected,
              stats.cancelled,
            ]
          : [],
        backgroundColor: [
          "#4a90e2",
          "#50e3c2",
          "#f5a623",
          "#7ed321",
          "#9b9b9b",
          "#d0021b",
          "#bd10e0",
        ],
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#e0e6f0', // darkText
        },
      },
      title: {
        display: true,
        text: t("stats_chart_title"),
        color: '#e0e6f0', // darkText
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#e0e6f0', // darkText
        },
        grid: {
          color: '#4a5568', // borderColor
        },
      },
      y: {
        ticks: {
          color: '#e0e6f0', // darkText
        },
        grid: {
          color: '#4a5568', // borderColor
        },
      },
    },
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="p-6 bg-dark-bg min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-darkText">{t("stats_title")}</h1>
      </div>

      {/* Stats Cards */}
      <div
        className="grid auto-fit-cards gap-6 mb-8"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
      >
        <StatCard
          title={t("stats_card_daily")}
          value={stats?.daily || 0}
          color="#4a90e2"
        />
        <StatCard
          title={t("stats_card_monthly")}
          value={stats?.monthly || 0}
          color="#50e3c2"
        />
        <StatCard
          title={t("stats_card_yearly")}
          value={stats?.yearly || 0}
          color="#f5a623"
        />
        <StatCard
          title={t("stats_card_completed")}
          value={stats?.completed || 0}
          color="#7ed321"
        />
        <StatCard title={t("stats_card_open")} value={stats?.open || 0} color="#9b9b9b" />
        <StatCard
          title={t("stats_card_rejected")}
          value={stats?.rejected || 0}
          color="#d0021b"
        />
        <StatCard
          title={t("stats_card_cancelled")}
          value={stats?.cancelled || 0}
          color="#bd10e0"
        />
      </div>

      {/* Chart */}
      <div className="bg-dark-card p-6 rounded-lg shadow-md">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Statistics;
