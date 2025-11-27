import { loadAllData } from "./data.js";
import { drawChoropleth } from "./map.js";

async function init() {
  try {
    const world = await loadAllData();
    drawChoropleth(world);
  } catch (err) {
    console.error("Error loading or drawing data:", err);
  }
}

init();