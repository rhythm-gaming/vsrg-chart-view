import * as THREE from 'three';
import {Chart} from '@rhythm-gaming/rgc';

export class ChartView {
    #chart: Chart|null = null;
    get chart(): Readonly<Chart>|null { return this.#chart; }
    set chart(chart: Chart|null) { this.#setChart(chart); }

    readonly #root: HTMLDivElement;
    get root(): HTMLDivElement { return this.#root; }

    #scene = new THREE.Scene();
    #renderer = new THREE.WebGLRenderer();

    #width = 800;
    #height = 600;

    constructor(root: HTMLDivElement, chart: Chart|null = null) {
        this.#root = root;
        this.#setChart(chart);

        this.#renderer.setSize(this.#width, this.#height);
        this.#root.appendChild(this.#renderer.domElement);
    }

    #setChart(chart: Chart|null) {
        this.#chart = chart;
    }
}