d3.json('samples.json').then((incomingData) => {

    var data = incomingData;
    
    //Alotting data to the drop down menu
   var dropdown = d3.select("#selDataset");

    var subjID = data.names;

    subjID.forEach((names) => {

        var option = dropdown.append("option");
        option.text(names);
    });

    //Setting Default screen ouptut
    var defaultID = subjID[0];
    getMetaData(defaultID);
    plots(defaultID);

    //Function to get the data for the respective ID
    function getMetaData(ID){

        var metaData = data.metadata;

        var filteredData = {};

        //For loop to go over the array to get the data for the corresponding ID
        for (let i = 0; i<metaData.length;i++) {

            if(metaData[i].id == ID){
                filteredData = metaData[i];
                break;
            }
        }

        //Adding data to the body
        var body = d3.select("#sample-metadata");
        body.html("");
        for (let [key, value] of Object.entries(filteredData)) {
            body.append("p").text(`${key}: ${value}`);
          }
    }

    function plots(ID){

        //Getting the sample Data
        var sampleData = data.samples;

        var filteredData = [];

        //Filtering out the data for the specific ID
        for (var i = 0; i < sampleData.length; i++){

            if(sampleData[i].id == ID){
                filteredData.push(sampleData[i]);
                break;
            }
        };

        console.log(filteredData);

        var otuIds = [];
        var sampleValues = [];
        var otuLabels = [];
        var colorIDs = [];

        //Getting the top 10 otu ids for the chosen ID
        for(var i = 0; i < 10; i++){
                otuIds.push(filteredData[0].otu_ids[i]);
                colorIDs.push(filteredData[0].otu_ids[i]);
                sampleValues.push(filteredData[0].sample_values[i]);
                otuLabels.push(filteredData[0].otu_labels[i]);

        };

        //Appending OTU at the start of the ID's
        for (var j =0; j < otuIds.length; j++){
            otuIds[j] = 'OTU ' + otuIds[j];
        };

        //Bar Plot
        var barData = [{
            type: 'bar',
            x: sampleValues.reverse(),
            y: otuIds.reverse(),
            orientation: 'h',
            text: otuLabels.reverse()
        }];

        var barLayout = {
            yaxis:{range: otuIds, width: 400},
        };

        //Adding plot to the html page
        Plotly.newPlot('bar', barData, barLayout);

        //Bubble Plot
        var bubbleData = [{
            type: 'scatter',
            mode: 'markers',
            x: colorIDs,
            y: sampleValues,
            marker: {
                size: sampleValues,
                color: colorIDs
            },
            hovertext: otuLabels
        }];

        //Adding plot to the html page
        Plotly.newPlot('bubble', bubbleData);
    }

    //Calling the function to change if the value in drop down menu changes
   d3.select("select").on("change",function(d){
       var selected = d3.select("#selDataset").node().value;
       console.log(selected);
       getMetaData(selected);
       plots(selected);

   });
});