import { Pie } from "react-chartjs-2";

const PieChart = ({ data }) => {
  const topProducts = data?.topProducts;

  const pieData = {
    labels: topProducts?.map((product) => product[1].title),
    datasets: [
      {
        data: topProducts?.map((product) => product[1].quantity),
        backgroundColor: ["#10B981", "#3B82F6", "#F97316", "#0EA5E9"],
        label: "Top Products",
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    cutoutPercentage: 80,
    legend: {
      display: false,
    },
  };

  return (
    <div>
      <Pie data={pieData} options={pieOptions} className="chart" />
    </div>
  );
};

export default PieChart;
