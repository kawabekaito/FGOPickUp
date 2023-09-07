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

export default BarChart;