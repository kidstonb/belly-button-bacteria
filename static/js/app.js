// url with sample data
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise); 

// function to filter for top ten OTU
// Takes a single array, turns into object and sorts/slices, returns object
function topTen(item) {
    // create an object of otu_id, sample_values, otu_labels
    let sortObject = [];
    for(let i = 0; i < item.otu_ids.length; i++){
        sortObject.push({'ids': `${item.otu_ids[i]}`, 'values': `${item.sample_values[i]}`, 'labels': `${item.otu_labels}`});
    }

    // console.log(sortObject);
    // console.log(Object.values(sortObject))

    // sort by the sample values
    let sort = sortObject.sort((first, second)=> second.values - first.values); // second.sample_values-first.sample_values);

    let sliced = sort.slice(0,10);
    sliced.reverse();
    
    return sliced;
}

// function to initialize plots/data 
function init(data) {

    // Populate dropdown menu with Test Subject ID's
    var x = document.getElementById("selDataset");
    for (let i = 0; i < data.names.length; i++){
        var option = document.createElement("option");
        option.text = data.names[i];
        // option.value = "list";
        option.value = data.names[i];
        x.add(option);
    }

    // initialize bar 
    let barData = data.samples;
    // sort with function
    let barTen = topTen(barData[0]);
    // console.log(barTen);
    let trace1 = {
        x: barTen.map((item) => item.values),
        y: barTen.map((item) => `OTU: ${item.ids}`),
        text: barTen.map((item) => item.labels),
        type: "bar",
        orientation:"h"
    };

    let layout = {};

    Plotly.newPlot("bar",[trace1],layout);

    // initialize bubble 
    let bubbleData = data.samples; //filter((item) => item.id == subjectID);

    let trace2 = {
        x: bubbleData[0]['otu_ids'],
        y: bubbleData[0]['sample_values'],
        text: bubbleData[0]['otu_labels'],
        mode: 'markers',
        marker:{
            size: bubbleData[0]['sample_values'],
            color: bubbleData[0]['otu_ids']
        }
    };

    var layout2 = {
        width: 1000
    };

    Plotly.newPlot('bubble', [trace2], layout2);

    // initialize demographic info
    // Create an element to write to
    const initNode = document.createElement("span");
    initNode.id = 'metadata-span';
    document.getElementById("sample-metadata").appendChild(initNode);
    // populate each key value pair 
    for (const [key, value] of Object.entries(data.metadata[0])) {
        d3.select("span").append("li").text(`${key}: ${value}`);
    }
    
}

// Call the initialization 
d3.json(url).then(function(data){
    init(data);
});

// function to update bar plot
function barPlot(data) {
    // Get the selected ID
    let dropdown = d3.select("#selDataset");
    let subjectID = dropdown.property("value");

    // Get data from ID selected 
    let barData = data.samples.filter((item) => item.id == subjectID);
    // sort with function
    let barTen = topTen(barData[0]);
    
    let trace1 = {
        x: barTen.map((item) => item.values),
        y: barTen.map((item) => `OTU: ${item.ids}`),
        text: barTen.map((item) => item.labels),
        type: "bar",
        orientation:"h"
    };
    let layout = {};

    Plotly.newPlot("bar",[trace1],layout);
}

// function to update bubble plot 
function bubblePlot(data) {
    // Get data for selected ID 
    let dropdown = d3.select("#selDataset");
    let subjectID = dropdown.property("value");

    // Get data from ID selected 
    let bubbleData = data.samples.filter((item) => item.id == subjectID);

    let trace2 = {
        x: bubbleData[0]['otu_ids'],
        y: bubbleData[0]['sample_values'],
        text: bubbleData[0]['otu_labels'],
        mode: 'markers',
        marker:{
            size: bubbleData[0]['sample_values'],
            color: bubbleData[0]['otu_ids']
        }
    };

    var layout = {
        width: 1000
    };

    Plotly.newPlot('bubble', [trace2], layout);
}

// function to update demographic panel
function demoPanel(data) {
    // Get data for selected ID 
    let dropdown = d3.select("#selDataset");
    let subjectID = dropdown.property("value");

    let panelData = data.metadata.filter((item) => item.id == subjectID);
    
    // delete previous span element 
    var ul = document.getElementById("metadata-span");
    let lis = ul.getElementsByTagName("li");
    while( lis.length > 0 ) (
        ul.removeChild(lis[0])
    )
    
    // populate based on new selection
    for (const [key, value] of Object.entries(panelData[0])) {
        d3.select("span").append("li").text(`${key}: ${value}`);
    }
    
}

// function/section to call and change based on DOM 
function DOMfn() {
    d3.json(url).then(function(data){
        barPlot(data);
        bubblePlot(data);
        demoPanel(data);
    });
}

// call functions on DOM selection
d3.selectAll("#selDataset").on("change", DOMfn);