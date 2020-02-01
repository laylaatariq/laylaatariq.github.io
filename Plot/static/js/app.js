d3.json('samples.json').then((incomingData) => {

    var data = incomingData;
    
    //Alotting data to the drop down menu
   var dropdown = d3.select("#selDataset");

    var subjID = data.names;

    // console.log(subjID);

    subjID.forEach((names) => {

        var option = dropdown.append("option");
        option.text(names);
    });

    var defaultID = subjID[0];
    getMetaData(defaultID);

    function getMetaData(ID){

        // var metaData = data.metadata;

        // var filteredData = {};

        // for (let i = 0; i<metaData.length;i++) {

        //     if(metaData[i].id === ID){

        //         filteredData = dataID[i];
        //         break;
        //     }
        // }

        // console.log(filteredData);

        // filteredData.forEach((pair) =>{

        //     Object.entries(pair).forEach(function([key, value]){
        //         console.log(key, value);
        //     })
        // })
    }
   function optionChanged(ID){}
});