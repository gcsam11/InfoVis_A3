export async function loadAllData() {
    const csvPromise = d3.csv("./data/online_sales_dataset.csv");
    const geoPromise = d3.json(
        "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
    );

    return Promise.all([csvPromise, geoPromise]).then(([rows, world]) => {
        rows.forEach(d => {
            d.Quantity = +d.Quantity;   // convert to number
        });

        const salesByCountry = d3.rollup(
            rows,
            v => d3.sum(v, d => d.Quantity),   // <--- sum Quantity
            d => d.Country
        );

        const geoToCsvName = {
            "USA": "United States",
            "England": "United Kingdom"
        };

        // 4. Merge the data into GeoJSON
        world.features.forEach(f => {
            const geoName = f.properties.name;
            const csvName = geoToCsvName[geoName] || geoName;

            f.properties.csvName = csvName;
            f.properties.sales = salesByCountry.get(csvName) || 0;
            f.properties.name = csvName;
        });

        return world;
    });
}