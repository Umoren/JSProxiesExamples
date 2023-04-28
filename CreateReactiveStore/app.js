function createReactiveStore(initialData) {
  const observers = new Set();

  const handler = {
    set(target, prop, value) {
      target[prop] = value;
      observers.forEach((observer) => observer());
      return true;
    },
  };

  const addObserver = (observer) => {
    observers.add(observer);
  };

  return {
    data: new Proxy(initialData, handler),
    addObserver,
  };
}

const initialData = {
  dailyActiveUsers: [50, 60, 70, 80, 140, 100, 110],
};

const store = createReactiveStore(initialData);

const chartElement = document.getElementById("barChart").getContext("2d");

const barChart = new Chart(chartElement, {
  type: "bar",
  data: {
    labels: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    datasets: [
      {
        label: "Daily Active Users",
        data: store.data.dailyActiveUsers,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

function updateChartData() {
  barChart.data.datasets[0].data = store.data.dailyActiveUsers;
  barChart.update();
}

store.addObserver(updateChartData);

setTimeout(() => {
  store.data.dailyActiveUsers = [60, 70, 80, 90, 100, 110, 120];
}, 2000);
