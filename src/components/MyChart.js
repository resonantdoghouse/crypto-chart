import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LineElement,
  PointElement,
  LinearScale,
  Tooltip,
  Title,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip
);

const MyChart = () => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Coin Values over 30 days',
      },
    },
  };

  const chartRef = useRef(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [data, setData] = useState([]);
  const [dateLabels, setDateLabels] = useState([]);

  useEffect(() => {
    axios
      .get(
        `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=cad&days=30&interval=daily
`
      )
      .then((response) => {
        const dataObj = {
          label: 'coin value',
          data: response.data.prices,
        };

        setData([dataObj]);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    console.log('coin data', data);
    const tmpDateLabels = [];
    data[0] &&
      data[0].data.forEach((label, index) => {
        tmpDateLabels.push(index);
      });
    setDateLabels(tmpDateLabels);
  }, [data]);

  return (
    <div>
      <Line
        options={options}
        datasetIdKey="id"
        data={{
          labels: dateLabels,
          datasets: data,
        }}
      />
    </div>
  );
};

export default MyChart;
