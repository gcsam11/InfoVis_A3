export function drawChoropleth(world) {
    const width = 1300;
    const height = 700;

    const svg = d3.select("#world_map")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .style("max-width", "100%")
        .style("height", "auto");

    // get all sales values from merged GeoJSON
    // extract only non-zero values
    const values = world.features
        .map(f => f.properties.sales)
        .filter(v => v > 0);   // ignore the zero countries
    const min = d3.min(values);
    const max = d3.max(values);

    console.log(min, max);

    // color scale – red gradient, you can keep custom domain if you want
    const colorScale = d3.scaleSequential()
        .domain([min, max])            // dynamic version
        .interpolator(d3.interpolateReds);

    // projection that fits map into SVG
    const projection = d3.geoNaturalEarth1()
        .fitSize([width, height], world);

    const path = d3.geoPath().projection(projection);

    // tooltip
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    const g = svg.append("g");

    g.selectAll("path")
        .data(world.features)
        .join("path")
        .attr("d", path)
        .attr("stroke", "#fff")
        .attr("stroke-width", 0.5)
        .attr("fill", d => {
            const v = d.properties.sales;
            return v ? colorScale(v) : "#eee";
        })
        .attr("opacity", 0)
    .transition()
        .duration(1500)
        .attr("opacity", 1)
    .selection()
        .on("mouseover", function (event, d) {
            d3.select(this)
                .attr("stroke", "black")
                .attr("stroke-width", 1.5);

            tooltip
                .style("opacity", 1)
                .html(`<strong>${d.properties.name}</strong><br>Nº of Products Sold: ${d.properties.sales}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mousemove", function (event) {
            tooltip
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseleave", function () {
            d3.select(this)
                .attr("stroke", "#fff")
                .attr("stroke-width", 0.5);

            tooltip.style("opacity", 0);
        });

    // add zoom behavior
    const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .translateExtent([[0, 0], [width, height]])
        .extent([[0, 0], [width, height]])
        .on("zoom", (event) => {
            g.attr("transform", event.transform);
        });

    svg.call(zoom)
    .on("dblclick.zoom", null); // disable zoom on double click
}