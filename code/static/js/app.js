// Note - start building the static plots first, (also dropdown)
// then adjust to be dynamic based on DOM 

// url with sample data
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise); 

// function to filter for top ten OTU
// I want to pass the samples section for one individual 
function topTen(item) {
    // create an object that links otu_id with the sample_values 
    let sortObject = [];
    for(let i = 0; i < item.otu_ids.length; i++){
        // sortObject.append(`${item.otu_ids[i]}: ${item.sample_values[i]}`);
        // sortObject[`${item.otu_ids[i]}`] = `${item.sample_values[i]}`;
        // sortObject[item.otu_labels[i]] = item.sample_values[i];
        // sortObject[`OTU: ${item.otu_ids[i]}`] = item.sample_values[i];
        sortObject.push({'ids': `${item.otu_ids[i]}`, 'values': `${item.sample_values[i]}`, 'labels': `${item.otu_labels}`});
    }
    // let sortObject = test.map((item) => `${item.otu_ids}: ${item.sample_values}`);
    // var sortObject = object.samples.map(function(object){
    //     var obj = {}; 
    //     for(i = 0; i < object.otu_ids.length; i++ )
    //           obj[object.otu_ids[i]]=object.sample_values[i];      
    //     return obj;})

    console.log(sortObject);
    // let sorted = [];
    // for (var k in sortObject) {
    //     sorted.push([k, item.sample_values[k]])
    // }
    // console.log(sorted);

    // console.log(Object.values(sortObject))
    let sort = sortObject.sort((first, second)=> second.values - first.values); // second.sample_values-first.sample_values);
    // console.log(sort);
    let sliced = sort.slice(0,10);
    sliced.reverse();
    // console.log(sliced);
    return sliced;
    // for (const [key, value] of Object.entries(panelData[0])) {
    // let a = []; let b = []
    // for (const [key, value] in sliced){
    //     a.append(key); b.append(value);
    // }
    // return a, b;
}

// function? or just code  for initial plots/data 
function init(data) {
    // initialize bar 
    let barData = data.samples;
    // console.log(barData[0]['sample_values']);
    let trace1 = {
        // x: barData.sample_values,
        // y: barData.otu_labels,
        x: barData[0]['sample_values'],
        y: barData[0]['otu_labels'],
        // text: barData[0]['otu_labels'].map(String),
        // name: 'static',
        type: "bar",
        orientation:"h"
    };
    let layout = {
        // title: "Greek gods search results",
        margin: {
          l: 100,
          r: 100,
          t: 100,
          b: 100
        }
      };
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
        // title: 'test'
    };

    Plotly.newPlot('bubble', [trace2], layout2);

    // initialize demographic info
    const initNode = document.createElement("span");
    // const textnode = document.createTextNode(data.metadata[0]);
    // initNode.appendChild(textnode);
    initNode.id = 'metadata-span';
    document.getElementById("sample-metadata").appendChild(initNode);
    for (const [key, value] of Object.entries(data.metadata[0])) {
        // currentPanel.append(`${key}: ${value} <br>`);
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
    // console.log(barData);
    let barTen = topTen(barData[0]);
    // const [key, value] = topTen(barData[0]);
    // console.log(barTen);
    // console.log(barData[0]['sample_values']);
    let trace1 = {
        x: barTen.map((item) => item.values),
        y: barTen.map((item) => `OTU: ${item.ids}`),
        text: barTen.map((item) => item.labels),
        // x: barData[0]['sample_values'],
        // y: barData[0]['otu_labels'], // this needs to be ID's, like OTU: ID as string 
        // x: value,
        // y: key,
        // name: 'static',
        type: "bar",
        orientation:"h"
    };
    let layout = {
        // title: "Greek gods search results",
        // margin: {
        //   l: 100,
        //   r: 100,
        //   t: 100,
        //   b: 100
        // }
      };
    Plotly.newPlot("bar",[trace1],layout);
}
// function to update bubble plot 
function bubblePlot(data) {
    // Get data for selected ID 
    let dropdown = d3.select("#selDataset");
    let subjectID = dropdown.property("value");

    // Get data from ID selected 
    let bubbleData = data.samples.filter((item) => item.id == subjectID);
    // let bubbleTen = topTen(bubbleData[0]);

    let trace2 = {
        // x: bubbleTen.map((item) => item.ids),
        // y: bubbleTen.map((item) => item.values),
        // text: bubbleTen.map((item) => item.labels),
        x: bubbleData[0]['otu_ids'],
        y: bubbleData[0]['sample_values'],
        text: bubbleData[0]['otu_labels'],
        mode: 'markers',
        marker:{
            // size: bubbleTen.map((item) => item.values),
            // color: bubbleTen.map((item) => item.ids)
            size: bubbleData[0]['sample_values'],
            color: bubbleData[0]['otu_ids']
        }
    };

    var layout = {
        // title: 'test'
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
    // console.log(panelData[0]);

    // populate panel 
    // var selectPanel = document.getElementById("metadata-span");
    // let subjectData = document.createTextNode('testNode\n');
    // selectPanel.append(subjectData);
    

    // var selectPanel = document.getElementById("sample-metadata");
    // var panelInfo = document.createElement("ul");
    // panelInfo = 'test';
    // // option.value = "list";
    // // option.value = data.names[i];
    // selectPanel.append(panelInfo);
    
    // delete previous 
    var ul = document.getElementById("metadata-span");
    let lis = ul.getElementsByTagName("li");
    while( lis.length > 0 ) (
        ul.removeChild(lis[0])
    )
    // while((let lis = ul.getElementsByTagName("li")).length > 0 ) (
    //     ul.removeChild(lis[0]);
    // )

    for (const [key, value] of Object.entries(panelData[0])) {
        // currentPanel.append(`${key}: ${value} <br>`);
        d3.select("span").append("li").text(`${key}: ${value}`);
    }
    
    // d3.select("span").text("replaced");

    // const node = document.createElement("span");
    // const textnode = document.createTextNode("Water");
    // node.appendChild(textnode);
    // node.id = 'metadata-span';
    // document.getElementById("sample-metadata").appendChild(node);
}

// function/section to call and change based on DOM 
function DOMfn() {
    d3.json(url).then(function(data){
        barPlot(data);
        bubblePlot(data);
        demoPanel(data);
    });
}

// repopulate data based on DOM 
d3.selectAll("#selDataset").on("change", DOMfn);

// Create an array of category labels
// let labels = Object.keys(data);

d3.json(url).then(function(data){
    console.log(data);
    // Populate dropdown menu with Test Subject ID's
    var x = document.getElementById("selDataset");
    for (let i = 0; i < data.names.length; i++){
        var option = document.createElement("option");
        option.text = data.names[i];
        // option.value = "list";
        option.value = data.names[i];
        x.add(option);
    }
    // console.log(data.samples[0]);
    // console.log(data.samples[0]['id']);
    // Static bar plot (initialize?)
    // let trace1 = {
    //     x: data.samples[0]['sample_values'],
    //     y: data.samples[0]['otu_labels'],
    //     name: 'static',
    //     type: "bar",
    //     orientation:"h"
    // };
    // let layout = {
    //     title: "Greek gods search results",
    //     margin: {
    //       l: 100,
    //       r: 100,
    //       t: 100,
    //       b: 100
    //     }
    //   };
    // Plotly.newPlot("bar",[trace1],layout);

    //Static bubble plot
    // let trace2 = {
    //     x: otu_ids,
    //     y: sample_values,
    //     mode: 'markers',
    //     marker: {
    //         size: sample_values
    //     },
        
        // color = otu_ids,
        // text values = otu_labels?
    // };

    // Static populating Demographic Info 
    var demoTest = document.getElementById("sample-metadata");
    // var demoInfo = document.createElement("p");
    //     demoInfo.text = '940';//data.names[0];
    //     demoInfo.value = "list";
    //     demoTest.add(demoInfo);

    // let testNode = document.createTextNode('testNode');
    // demoTest.append('testNode');


    // let row = d3.select("sample-metadata").append("tr").append("td").text('test');

    // console.log(data.samples.filter((item) => item.id == "940"));
});

// repopulate data based on DOM 
d3.selectAll("#selDataset").on("change", DOMfn);


//  Select element with ID, fetch data.names
    // iterate over names, add <option>
    // var selectList = d3.select('selDataset');
    // for(n in data.names) {
    // selectList.options[select.options.length] = new Option('Text 1', 'Value1');
// }

// var selectDOM = d3.select("selDataset").append("option");
// selectDOM.options[2] = new Option('test',2);
// selectDOM.append('<option value = "list">value</option>');
// selectDOM.append("option").text('test');
// console.log(selectDOM.text());
// selectDOM.text("test");

// let newOption = new Option('Option Text','Option Value');
// const select = document.querySelector('selDataset');
// select.add(newOption, undefined);



// Add value to ID

// function onchange(sample){
//     sample = data.names;
// }







// //    Call updatePlotly() when a change takes place to the DOM
// d3.selectAll("#selDataset").on("change", updatePlotly);

// // Initialize the page with a default plot
// function unit() {
//     Plotly.newPlot("plot",data);
// }

// Function to update plot based on dropdown
function updatePlotly() {
    // select dropdown, assign to variable
    let dropdownMenu = d3.select("#selDataset");
    let dataset = dropdownMenu.property("onchange");

    d3.json(url).then(function(data){
        console.log(data);
    });
}




