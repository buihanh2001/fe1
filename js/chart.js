google.charts
  .load("upcoming", { packages: ["vegachart", "corechart"] }) 
  .then(() => {
    drawChart();
    drawChart2();
  });

async function drawChart() {
  const dataTable = new google.visualization.DataTable();
  dataTable.addColumn({ type: "string", id: "month" });
  dataTable.addColumn({ type: "number", id: "amount" });
  let arrayMonth = [];
  await fetch(`${API_BASE_URL}/orders/charts`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Lỗi mạng");
      return response.json();
    })
    .then(async (data) => {
      data.forEach((item) => {
        arrayMonth.push(["Tháng " + item.month, item.totalPrice]);
      });
    })
    .catch((error) => {
      console.error(error);
      document.body.innerHTML = "<p>Lỗi khi tải dữ liệu sản phẩm.</p>";
    });
  
  dataTable.addRows(arrayMonth);

  const options = {
    vega: {
      $schema: "https://vega.github.io/schema/vega/v4.json",
      width: 1000,
      height: 400,
      padding: 5,

      data: [{ name: "table", source: "datatable" }],

      signals: [
        {
          name: "tooltip",
          value: {},
          on: [
            { events: "rect:mouseover", update: "datum" },
            { events: "rect:mouseout", update: "{}" },
          ],
        },
      ],

      scales: [
        {
          name: "xscale",
          type: "band",
          domain: { data: "table", field: "month" },
          range: "width",
          padding: 0.05,
          round: true,
        },
        {
          name: "yscale",
          domain: { data: "table", field: "amount" },
          nice: true,
          range: "height",
        },
      ],

      axes: [
        { orient: "bottom", scale: "xscale" },
        { orient: "left", scale: "yscale" },
      ],

      marks: [
        {
          type: "rect",
          from: { data: "table" },
          encode: {
            enter: {
              x: { scale: "xscale", field: "month" },
              width: { scale: "xscale", band: 1 },
              y: { scale: "yscale", field: "amount" },
              y2: { scale: "yscale", value: 0 },
            },
            update: {
              fill: { value: "steelblue" },
            },
            hover: {
              fill: { value: "red" },
            },
          },
        },
        {
          type: "text",
          encode: {
            enter: {
              align: { value: "center" },
              baseline: { value: "bottom" },
              fill: { value: "#333" },
            },
            update: {
              x: { scale: "xscale", signal: "tooltip.month", band: 0.5 },
              y: { scale: "yscale", signal: "tooltip.amount", offset: -2 },
              text: { signal: "tooltip.amount" },
              fillOpacity: [
                { test: "datum === tooltip", value: 0 },
                { value: 1 },
              ],
            },
          },
        },
      ],
    },
  };

  const chart = new google.visualization.VegaChart(
    document.getElementById("chart-div")
  );
  chart.draw(dataTable, options);
}
async function drawChart2() {
  try {
    const response = await fetch(`${API_BASE_URL}/cars/top-brands`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const dataFromApi = await response.json();

    const chartData = [["Hãng xe", "Số lượng đã bán"]];
    dataFromApi.forEach((item) => {
      chartData.push([item.brandName, item.totalSold]);
    });

    const data = google.visualization.arrayToDataTable(chartData);

    const options = {
      title: "Top 3 hãng xe bán chạy nhất",
      pieHole: 0.4,
      width: 600,
      height: 400,
    };

    const chart = new google.visualization.PieChart(
      document.getElementById("chart_div2")
    );
    chart.draw(data, options);
  } catch (err) {
    console.error("Lỗi khi load biểu đồ:", err);
  }
}
