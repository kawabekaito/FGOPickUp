import "./App.css"

import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';


const BarChart = ({ data }) => {
  const Width = 1430;
  const Height = 650;
  const margin = {
    top: 20,
    right: 50,
    bottom: 150,
    left: 100,
  };
  const chartWidth = Width - margin.left - margin.right;
  const chartHeight = Height - margin.top - margin.bottom;

  const sortedData = data.slice().sort((a, b) => {
    return b.days - a.days;
  });

  const xScale = d3.scaleBand().range([0, chartWidth]).padding(0.1);

  xScale.domain(sortedData.map((d) => d.name));

  const yScale = d3.scaleLinear().range([chartHeight, 0]);

  yScale.domain([0, d3.max(sortedData, (d) => d.days)]);

  const bars = sortedData.map((d, index) => (
    <g transform={`translate(${xScale(d.name)}, 0)`} key={index}>
      <rect x={0} y={yScale(d.days)} width={xScale.bandwidth()} height={chartHeight - yScale(d.days)} fill={d.NPcolor} className="barRect" />


      <text
        x={xScale.bandwidth() / 2 + 15}
        y={chartHeight + 20}
        textAnchor="end"
        alignmentBaseline="middle"
        transform={`rotate(-90, ${xScale.bandwidth() / 2}, ${chartHeight + 20})`}
        style={{ fontSize: "12px" }}
      >
        {d.name}
      </text>
    </g>
  ));


  const legendData = [
    { label: "Buster", color: "#a41818" },
    { label: "Arts", color: "#1640a3" },
    { label: "Quick", color: "#267815" },
  ];

  const legend = legendData.map((d, index) => (
    <g key={index} transform={`translate(${chartWidth - 100}, ${index * 20})`}>
      <rect x={0} y={-10} width={10} height={10} fill={d.color} />
      <text x={15} y={0} style={{ fontSize: "15px" }}>{d.label}</text>
    </g>
  ));

  const yAxis = d3.axisLeft(yScale).ticks();

  return (
    <svg width={Width} height={Height}>
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        {bars}
        <g transform={`translate(0, ${chartHeight})`} ref={(node) => d3.select(node).call(d3.axisBottom(xScale).tickFormat("").tickSize(1))} />
        <text
          transform={`translate(${chartWidth / 2}, ${Height - margin.bottom + 130})`} // x軸ラベルの位置を変更
          textAnchor="middle"
        >
          Servant
        </text>

        <g ref={(node) => d3.select(node).call(yAxis)} />
        <text
          transform={`translate(-50, ${chartHeight / 2}) rotate(-90)`}
          textAnchor="middle"
        >
          days
        </text>

        <g>{legend}</g>
      </g>
    </svg>
  );

};




const App = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch("/dataFGO.json")
      .then((response) => response.json())
      .then((jsonData) => {

        setData(jsonData);
      })
  }, []);


  console.log(data);

  const optionsClass = [
    { value: "Saber", label: "Saber" },
    { value: "Archer", label: "Archer" },
    { value: "Lancer", label: "Lancer" },
    { value: "Rider", label: "Rider" },
    { value: "Assassin", label: "Assassin" },
    { value: "Caster", label: "Caster" },
    { value: "Berserker", label: "Berserker" },
    { value: "Ruler", label: "Ruler" },
    { value: "Extra", label: "Extra" },
  ];

  const optionsNPEffect = [
    { value: "all", label: "all" },
    { value: "only", label: "only" },
    { value: "buff", label: "buff" }
  ];




  // チェックボックスの状態を管理するやつ
  const ClassCheckedState = Object.fromEntries(
    optionsClass.map((option) => [option.value, false])
  );

  const NPChekedState = Object.fromEntries(
    optionsNPEffect.map((option) => [option.value, false])
  );


  //console.log(ClassCheckedState);
  const [classChecked, setClassChecked] = useState(ClassCheckedState);
  const [NPChecked, setNPCheked] = useState(NPChekedState);

  //console.log(classChecked);
  //console.log(NPChecked);


  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    //console.log(isChecked);

    if (optionsClass.find((item) => item.value === value)) {
      setClassChecked((prevState) => ({
        ...prevState,
        [value]: isChecked
      }));
    } else if (optionsNPEffect.find((item) => item.value === value)) {
      setNPCheked((prevState) => ({
        ...prevState,
        [value]: isChecked
      }));
    }

  };


  const parseDate = (dateString) => {
    const [year, month, day] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
  };



  const calculateDaysFromToday = (data) => {
    const today = new Date(); // 現在の日付
    return data.map((d) => {
      const date = parseDate(d.days); // 日付をDateオブジェクトに変換
      const timeDiff = today - date; // 現在の日付との差分を計算
      //console.log(data);
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      return {
        ...d,
        days: daysDiff,
      };
    });
  };


  const [calculatedData, setCalculatedData] = useState([]);

  useEffect(() => {
    if (data) {
      const a = calculateDaysFromToday(data)
      console.log(a);
      setCalculatedData(a);
    }
  }, [data]);


  // チェックボックスからフィルタリング
  const filterData = () => {
    const selectedClasses = optionsClass.filter((item) => classChecked[item.value]).map((item) => item.value);
    const selectedNPTarget = optionsNPEffect.filter((item) => NPChecked[item.value]).map((item) => item.value);

    if (selectedClasses.length === 0 && selectedNPTarget.length === 0) {
      return calculatedData;
    } else if (selectedClasses.length > 0 && selectedNPTarget.length === 0) {

      return calculatedData.filter((d) => selectedClasses.includes(d.class));
    } else if (selectedClasses.length === 0 && selectedNPTarget.length > 0) {
      console.log(calculatedData.filter((d) => selectedNPTarget.includes(d.NPtarget)));
      return calculatedData.filter((d) => selectedNPTarget.includes(d.NPtarget));
    } else {
      return calculatedData.filter((d) => selectedClasses.includes(d.class) && selectedNPTarget.includes(d.NPtarget));
    }

  };


  const filteredData = filterData();
  console.log(filteredData);
  console.log(calculatedData);


  return (
    <div >
      <h1>FGO don't PickUp</h1>
      <div >
        <div>
          <h3>クラス</h3>
          {optionsClass.map((option) => (
            <label key={option.value} style={{ marginRight: "10px" }}>
              <input
                type="checkbox"
                value={option.value}
                checked={classChecked[option.value]}
                onChange={handleCheckboxChange}
              />
              {option.label}

            </label>
          ))}
        </div>


        <div>
          <h3>宝具タイプ</h3>
          {optionsNPEffect.map((option) => (
            <label key={option.value} style={{ marginRight: "10px" }} >
              <input
                type="checkbox"
                value={option.value}
                checked={NPChecked[option.value]}
                onChange={handleCheckboxChange}
              />
              {option.label}
            </label>
          ))}
        </div>

      </div>

      {<BarChart data={filteredData} />}
    </div>
  );
};

export default App;