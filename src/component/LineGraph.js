import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";
import '../style/LineGraph.css'

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const buildChartData = (data, casesType) => {
  let chartData = [];
  let lastDataPoint;
  for (let date in data.cases) {
    if (lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: data[casesType][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date];
  }
  return chartData;
};

function LineGraph({ casesType, country }) {
  const [data, setData] = useState({});
  const [color, setColor] = useState({
    backgroundColor : "rgba(204,16,52,0.5)",
    borderColor : "#CC1034",
  });
  const [days, setDays] = useState(60)

  const handleDays= e => {
    const newDay = e.target.value;
    setDays(newDay);
  }

  useEffect(() => {
    console.log(country);
    const fetchData = async () => {
      if(country === 'all'){
        await fetch(`https://disease.sh/v3/covid-19/historical/all?lastdays=${days}`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          let chartData = buildChartData(data, casesType);
          setData(chartData);
          console.log(data);
        });
      }
      else{
        await fetch(`https://disease.sh/v3/covid-19/historical/${country}?lastdays=${days}`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          let chartData = buildChartData(data['timeline'], casesType);
          setData(chartData);
          console.log(data);
        });
      }
      
    };
    const setGraphColor = ()=>{
      switch(casesType){
          case 'cases' :
              setColor({
                  backgroundColor : "rgba(204,16,52,0.5)",
                  borderColor : "#CC1034",
              });break;
          case 'recovered' :
              setColor({
                  backgroundColor : "rgba(11,156,0,0.5)",
                  borderColor : "#03cc35",
              });break;
          case 'deaths' :
              setColor({
                  backgroundColor : "rgba(0,0,0,0.5)",
                  borderColor : "#000000",
              });break;
          default : 
              setColor({
                  backgroundColor : "rgba(204,16,52,0.5)",
                  borderColor : "#CC1034",
              });
      }
  }
  setGraphColor();
  fetchData();
  }, [casesType, days, country]);

  return (
    <div>
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                backgroundColor: color.backgroundColor,
                borderColor: color.borderColor,
                data: data,
              },
            ],
          }}
          options={options}
        />
      )}
      <div>
        <h4 className='range__legend'> Ces dernier {days} jours </h4>
        <input className='range' type='range' value={days} min={30} max={120} onChange={handleDays} />
      </div>
    </div>
  );
}

export default LineGraph;
