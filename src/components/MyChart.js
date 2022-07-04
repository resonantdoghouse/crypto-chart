import React, { useState, useEffect } from 'react';
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
  // config
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

  // state
  const [data, setData] = useState([]);
  const [dateLabels, setDateLabels] = useState([]);
  const [coin, setCoin] = useState('bitcoin');
  const [days, setDays] = useState(30);

  // useEffect functions
  useEffect(() => {
    getCoinData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const tmpDateLabels = [];
    data[0] &&
      data[0].data.forEach((label, index) => {
        tmpDateLabels.push(index);
      });
    setDateLabels(tmpDateLabels);
  }, [data]);

  // functions
  const getCoinData = () => {
    axios
      .get(
        `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=cad&days=${days}&interval=daily
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
  };

  const handleCoinSelect = (e) => {
    setCoin(e.target.value);
  };

  useEffect(() => {
    getCoinData();
    // eslint-disable-next-line
  }, [coin, days]);

  const handleDaysChange = (daysVal) => {
    console.log('days change', daysVal);
    setDays(daysVal);

    getCoinData();
  };

  return (
    <div className="container">
      <h1>Coin Chart</h1>
      <p>Historical values for select coins.</p>
      <label htmlFor="coin">coin</label>
      <select name="coin" id="coin" onChange={handleCoinSelect}>
        <option value="bitcoin">bitcoin</option>
        <option value="ethereum">ethereum</option>
        <option value="dogecoin">dogecoin</option>
      </select>
      <button
        onClick={() => {
          handleDaysChange(30);
        }}
      >
        30 Days
      </button>
      <button
        onClick={() => {
          handleDaysChange(365);
        }}
      >
        1 Year
      </button>
      <button
        onClick={() => {
          handleDaysChange(730);
        }}
      >
        2 Years
      </button>
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
