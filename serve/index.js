import {Chart, ChartView} from "./build/index.js";

(async function main() {
    const chart = Chart.fromJSON(await (await fetch("./test.rgc")).json());
    const chart_view = new ChartView(document.getElementById('chart-view'), chart);
})();