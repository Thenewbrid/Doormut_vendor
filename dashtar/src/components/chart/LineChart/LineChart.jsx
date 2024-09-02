import { useState, useEffect } from "react";
import "chart.js/auto";
import { Line } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import useUtilsFunction from "@/hooks/useUtilsFunction";

const LineChart = ({ salesReport }) => {
  const earnings = salesReport.earnings;
  const vendorOrders = salesReport.vendorOrders;
  const [activeButton, setActiveButton] = useState({
    title: "Weekly Sales",
    color: "emerald",
  });

  const { globalSetting } = useUtilsFunction();

  const [lineOptions, setLineOptions] = useState({
    data: {
      labels: [],
      datasets: [
        {
          label: "Weekly Sales",
          data: [],
          borderColor: "#10B981",
          backgroundColor: "#10B981",
          borderWidth: 3,
          yAxisID: "y",
        },
      ],
    },
    options: {
      responsive: true,
    },
    legend: {
      display: false,
    },
  });

  useEffect(() => {
    const daysOfWeek = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const today = new Date();
    const firstDayOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay() + 1)
    );
    const lastDayOfWeek = new Date(today.setDate(today.getDate() + 6));

    const weeklyOrders = vendorOrders?.filter((order) => {
      const orderDate = new Date(order.orderTime);
      return orderDate >= firstDayOfWeek && orderDate <= lastDayOfWeek;
    });

    const weeklySales = earnings?.weekly;

    const salesData = daysOfWeek?.map((day) => {
      const dayOrders = weeklyOrders?.filter((order) => {
        const orderDate = new Date(order.orderTime);
        if (order.status === "Delivered") {
          return (
            orderDate.toLocaleString("en-us", {
              weekday: "long",
              timeZone: globalSetting?.default_time_zone,
            }) === day
          );
        }
      });
      return dayOrders?.reduce((acc, order) => acc + order.totalAmount, 0);
    });

    const ordersData = daysOfWeek?.map((day) => {
      const dayOrders = weeklyOrders?.filter((order) => {
        const orderDate = new Date(order.orderTime);
        return (
          orderDate.toLocaleString("en-us", {
            weekday: "long",
            timeZone: globalSetting?.default_time_zone,
          }) === day
        );
      });
      return dayOrders?.length;
    });

    setLineOptions({
      ...lineOptions,
      data: {
        labels: daysOfWeek,
        datasets: [
          {
            label: "Weekly Sales",
            data: salesData,
            borderColor: "#10B981",
            backgroundColor: "#10B981",
            borderWidth: 3,
            yAxisID: "y",
          },
        ],
      },
    });
  }, [vendorOrders, earnings]);

  const handleClick = ({ title, color }) => {
    setActiveButton({ title, color });
    if (title === "Weekly Orders") {
      const daysOfWeek = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];
      const today = new Date();
      const firstDayOfWeek = new Date(
        today.setDate(today.getDate() - today.getDay() + 1)
      );
      const lastDayOfWeek = new Date(today.setDate(today.getDate() + 6));

      const weeklyOrders = vendorOrders?.filter((order) => {
        const orderDate = new Date(order.orderTime);
        return orderDate >= firstDayOfWeek && orderDate <= lastDayOfWeek;
      });

      const ordersData = daysOfWeek?.map((day) => {
        const dayOrders = weeklyOrders?.filter((order) => {
          const orderDate = new Date(order.orderTime);
          return (
            orderDate.toLocaleString("en-us", {
              weekday: "long",
              timeZone: globalSetting?.default_time_zone,
            }) === day
          );
        });
        return dayOrders?.length;
      });

      setLineOptions({
        ...lineOptions,
        data: {
          labels: daysOfWeek,
          datasets: [
            {
              label: "Weekly Orders",
              data: ordersData,
              borderColor: "#F59E0B",
              backgroundColor: "#F59E0B",
              borderWidth: 3,
              yAxisID: "y",
            },
          ],
        },
      });
    } else {
      const daysOfWeek = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];
      const today = new Date();
      const firstDayOfWeek = new Date(
        today.setDate(today.getDate() - today.getDay() + 1)
      );
      const lastDayOfWeek = new Date(today.setDate(today.getDate() + 6));

      const weeklyOrders = vendorOrders?.filter((order) => {
        const orderDate = new Date(order.orderTime);
        return orderDate >= firstDayOfWeek && orderDate <= lastDayOfWeek;
      });

      const weeklySales = earnings.weekly;

      const salesData = daysOfWeek?.map((day) => {
        const dayOrders = weeklyOrders?.filter((order) => {
          const orderDate = new Date(order.orderTime);
          if (order.status === "Delivered") {
            return (
              orderDate.toLocaleString("en-us", {
                weekday: "long",
                timeZone: globalSetting?.default_time_zone,
              }) === day
            );
          }
        });
        return dayOrders?.reduce((acc, order) => acc + order.totalAmount, 0);
      });

      setLineOptions({
        ...lineOptions,
        data: {
          labels: daysOfWeek,
          datasets: [
            {
              label: "Weekly Sales",
              data: salesData,
              borderColor: "#10B981",
              backgroundColor: "#10B981",
              borderWidth: 3,
              yAxisID: "y",
            },
          ],
        },
      });
    }
  };

  const { t } = useTranslation();

  return (
    <>
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 mb-4">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              onClick={() =>
                handleClick({ title: "Weekly Sales", color: "emerald" })
              }
              type="button"
              className={`inline-block p-2 rounded-t-lg border-b-2 border-transparent ${
                activeButton.title === "Weekly Sales"
                  ? "text-emerald-600 border-emerald-600 dark:text-emerald-500 dark:border-emerald-500"
                  : "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              }  focus:outline-none`}
            >
              {t("Weekly Sales")}
            </button>
          </li>
          <li className="mr-2">
            <button
              onClick={() =>
                handleClick({ title: "Weekly Orders", color: "orange" })
              }
              type="button"
              className={`inline-block p-2 rounded-t-lg border-b-2 border-transparent ${
                activeButton.title === "Weekly Orders"
                  ? "text-orange-600 border-orange-600 dark:text-orange-500 dark:border-orange-500"
                  : "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              }  focus:outline-none`}
            >
              {t("Weekly Orders")}
            </button>
          </li>
          <li className="mr-2">
            <span className="inline-block p-2 rounded-t-lg border-b-2 border-transparent text-gray-600 dark:text-gray-400">
              {t("Total Orders")}: {vendorOrders?.length}
            </span>
          </li>
        </ul>
      </div>

      <Line {...lineOptions} />
    </>
  );
};

export default LineChart;
