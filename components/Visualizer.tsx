
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { TelemetryData, SystemStatus } from '../types';

interface VisualizerProps {
  data: TelemetryData[];
}

export const Visualizer: React.FC<VisualizerProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    svg.selectAll("*").remove();

    // Setup scales
    const xScale = d3.scaleLinear().domain([0, 100]).range([20, width - 20]);
    const yScale = d3.scaleLinear().domain([0, 100]).range([20, height - 20]);

    // Draw grid
    svg.append("g")
      .attr("stroke", "#1e293b")
      .attr("stroke-dasharray", "2,2")
      .call(g => g.append("g")
        .selectAll("line")
        .data(xScale.ticks())
        .join("line")
        .attr("x1", d => xScale(d))
        .attr("x2", d => xScale(d))
        .attr("y1", 0)
        .attr("y2", height))
      .call(g => g.append("g")
        .selectAll("line")
        .data(yScale.ticks())
        .join("line")
        .attr("y1", d => yScale(d))
        .attr("y2", d => yScale(d))
        .attr("x1", 0)
        .attr("x2", width));

    // Define color mapping
    const getStatusColor = (status: SystemStatus) => {
      switch (status) {
        case SystemStatus.OPTIMAL: return "#22c55e";
        case SystemStatus.UNCERTAIN: return "#eab308";
        case SystemStatus.UNSAFE: return "#ef4444";
        case SystemStatus.HALTED: return "#ffffff";
        default: return "#64748b";
      }
    };

    // Draw path between points
    const line = d3.line<TelemetryData>()
      .x(d => xScale(d.latentCoordinates[0]))
      .y(d => yScale(d.latentCoordinates[1]))
      .curve(d3.curveMonotoneX);

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#334155")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Draw points
    svg.selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", d => xScale(d.latentCoordinates[0]))
      .attr("cy", d => yScale(d.latentCoordinates[1]))
      .attr("r", (d, i) => i === data.length - 1 ? 8 : 4)
      .attr("fill", d => getStatusColor(d.status))
      .attr("stroke", "#020617")
      .attr("stroke-width", 2)
      .style("filter", d => d.status === SystemStatus.UNSAFE ? "drop-shadow(0 0 8px #ef4444)" : "none");

    // Add legend label
    svg.append("text")
      .attr("x", 10)
      .attr("y", 20)
      .attr("fill", "#64748b")
      .attr("font-size", "10px")
      .attr("class", "font-mono")
      .text("LATENT DECISION LANDSCAPE (N-SPACE PROJECTION)");

  }, [data]);

  return (
    <div className="relative w-full h-full bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};
