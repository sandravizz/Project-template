////////////////////////////////////////////////////////////
///////////////////// Plot example /////////////////////////
////////////////////////////////////////////////////////////

// https://observablehq.com/plot/getting-started

const plot =
    Plot.rectY({length: 10000}, 
    Plot.binX({y: "count"}, {x: Math.random})).plot();

const div = document.querySelector("#myplot");

div.append(plot);

////////////////////////////////////////////////////////////
///////////////////// Arquero example //////////////////////
////////////////////////////////////////////////////////////

const { table, op, desc, all } = aq;


// Average hours of sunshine per month, from https://usclimatedata.com/.
const dt = table({
    'Seattle': [69, 108, 178, 207, 253, 268, 312, 281, 221, 142, 72, 52],
    'Chicago': [135, 136, 187, 215, 281, 311, 318, 283, 226, 193, 113, 106],
    'San Francisco': [165, 182, 251, 281, 314, 330, 300, 272, 267, 243, 189, 156]
});

// Sorted differences between Seattle and Chicago.
// Table expressions use arrow function syntax.
const differences = dt.derive({
    month: d => op.row_number(),
    diff: d => d.Seattle - d.Chicago
})
    .select('month', 'diff')
    .orderby(desc('diff'))
    .print();

// Is Seattle more correlated with San Francisco or Chicago?
// Operations accept column name strings outside a function context.
const correlations = dt.rollup({
    corr_sf: op.corr('Seattle', 'San Francisco'),
    corr_chi: op.corr('Seattle', 'Chicago')
})
    .print();

// Aggregate statistics per city, as output objects.
// Reshape (fold) the data to a two column layout: city, sun.
const aggregateStats = dt.fold(all(), { as: ['city', 'sun'] })
    .groupby('city')
    .rollup({
        min: d => op.min(d.sun), // functional form of op.min('sun')
        max: d => op.max(d.sun),
        avg: d => op.average(d.sun),
        med: d => op.median(d.sun),
        // functional forms permit flexible table expressions
        skew: ({ sun: s }) => (op.mean(s) - op.median(s)) / op.stdev(s) || 0
    })
    .objects();

    console.log(aggregateStats);

////////////////////////////////////////////////////////////
///////////////////// D3 example /////////////////////////
////////////////////////////////////////////////////////////

// https://d3js.org/getting-started

// Declare the chart dimensions and margins.
const width = 640;
const height = 400;
const marginTop = 20;
const marginRight = 20;
const marginBottom = 30;
const marginLeft = 40;

// Declare the x (horizontal position) scale.
const x = d3.scaleUtc()
    .domain([new Date("2023-01-01"), new Date("2024-01-01")])
    .range([marginLeft, width - marginRight]);

// Declare the y (vertical position) scale.
const y = d3.scaleLinear()
    .domain([0, 100])
    .range([height - marginBottom, marginTop]);

// Create the SVG container.
const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height);

// Add the x-axis.
svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x));

// Add the y-axis.
svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y));

// Append the SVG element.
chart.append(svg.node());




