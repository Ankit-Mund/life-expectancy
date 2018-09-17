/**********  variable to store CSV File   *********/
const csvFile = "./Indicators.csv";

/**********  variable to store modules   *********/
const fs = require('fs');
const readline = require('readline');

/**********  variable to store column header index   *********/
let indexYear;
let indexCountry;
let indexValue;
let indexIndicatorCode;
let indexCountryCode;

/**********  Array variable to store Filtered Array of Objects  *********/
let newArray = [];     //multi-line
let newArrayTotal = []; //stacked

/**********  Array variables to store specific Objects ********/
let male = [];
let female = [];
let arr_birth = [];
let arr_death = [];
let arr_ur_growth = [];
//let asia = ["PAK","IND","BGD","IDN","CHN","AFG"];
let countries=['India','Afghanistan','Armenia','Azerbaijan','Bahrain','Bangladesh','Bhutan','Brunei'
,'Cambodia','China','Cyprus','Georgia','Indonesia','Iran','Iraq','Israel','Japan','Jordan','Kazakhstan'
,'Kyrgyzstan','Laos','Lebanon','Malaysia','Maldives','Mongolia','Myanmar','Nepal','North Korea','Oman'
,'Pakistan','Palestine','Philippines','Qatar','Russia','Saudi Arabia','Singapore','South Korea'
,'Sri Lanka','Syria','Taiwan','Tajikistan','Thailand','Timor-Leste','Turkey','Turkmenistan'
,'United Arab Emirates','Uzbekistan','Vietnam','Yemen'];

let arr_total = []; // bar
let StackArray = [];
let new_arr_total = [];

let cn = 0;
/**********  counter variable for  storing header indexes   *********/
let counter = 0;

/**********  Custom Remove function to remove specific array elements   *********/
function remove(array, element) {
    return array.filter(e => e !== element);
}

/**********  Reading CSV File by creating Read Stream Interface   *********/
const rl = readline.createInterface({
    input: fs.createReadStream(csvFile)
});

/**********  Reading the Stream Line by Line *********/
rl.on('line', (line)=>{

    counter++;

    /**********  Array to store each line of CSV  ;   Using Regex to ignore commas between double quotes *********/
    let arr = line.split((/(".*?"|[^",]+)(?=,|$)+/g));

    /**********  Filtered Array by removing nulls & commas   *********/
    let filteredArray = remove(arr,",");
    filteredArray = remove(filteredArray, "");

    /**********  Using counter to store header indexes   *********/
    if(counter === 1){
        indexCountry = filteredArray.indexOf("CountryName");
        indexYear = filteredArray.indexOf("Year");
        indexIndicatorCode = filteredArray.indexOf("IndicatorCode");
        indexValue = filteredArray.indexOf("Value");
        indexCountryCode = filteredArray.indexOf("CountryCode");
    }

    /**********  Filtering the dataset according to Country-India and IndicatorName*********/

    if(filteredArray[indexCountry] === "India") {   // multi line

        if(filteredArray[indexIndicatorCode] === "SP.DYN.CBRT.IN") {
            
            let temp_obj = {
                year: filteredArray[indexYear],
                birth: filteredArray[indexValue],
            };
            
            arr_birth.push(temp_obj);

        }
        else if(filteredArray[indexIndicatorCode] === "SP.DYN.CDRT.IN"){
            
            let temp_obj = {
                year: filteredArray[indexYear],
                death: filteredArray[indexValue],
            };

            arr_death.push(temp_obj);

        }
        
    }
    if(filteredArray[indexCountry] === "India") {       // filtration for stacked

        if(filteredArray[indexIndicatorCode] === "SP.DYN.LE00.FE.IN") {
            
            let temp_obj = {
                year: filteredArray[indexYear],
                female1: filteredArray[indexValue],
            };
            
            female.push(temp_obj);

        }
        else if(filteredArray[indexIndicatorCode] === "SP.DYN.LE00.MA.IN"){
            
            let temp_obj = {
                year: filteredArray[indexYear],
                male1: filteredArray[indexValue],
            };

            male.push(temp_obj);

        }}

     for(let i=0;i<countries.length;i++) {
        if(countries[i]===filteredArray[indexCountry]) {
            if(filteredArray[indexYear] === "2000") {
                if(filteredArray[indexIndicatorCode]==="SP.DYN.LE00.IN") {
                    let outobj = {
                        country: filteredArray[indexCountry],
                        le_total: filteredArray[indexValue]
                    }
                    arr_total.push(outobj);        // bar chart(array of all countries)
                }
                
                }
            }                        
        
    }
     

}).on('close', () => {
console.log("here.....")
    for(i=0;i<arr_birth.length;i++) {
        for(j=0;j<arr_death.length;j++) {
            if(i===j) {
                let temp_Obj = Object.assign(arr_birth[j],arr_death[j]);
                /**********  pushing the objects to Array of Objects  *********/
                newArray.push(temp_Obj);
            }
        }
    }

    for(i=0;i<female.length;i++){
        for(j=0;j<male.length;j++){
            if(i===j){
                let temp_Obj = Object.assign(female[j],male[j]);
                StackArray.push(temp_Obj);
            }            
        }
    }
    arr_total=arr_total.sort(function (a, b) {        // sorting for Top 5 countries
     return b.le_total - a.le_total
   })
     for(i=0;i<5;i++)
     {
      new_arr_total[i]=arr_total[i];
     }

    // for(i=0;i<asia_female.length;i++){
    //     for(j=0;j<asia_male.length;j++){
    //         if(i===j){
    //             let temp_obj = {
    //                 country: countries[i],
    //                 birth: asia_female[i],
    //                 death: asia_male[i]
    //             }
    //             newArrayAsia.push(temp_obj);
    //         }
            
    //     }
    // }

    // for(i=0;i<asia.length;i++){
    //     let temp_obj = {
    //         country: asia[i],
    //         population: asia_female[i] + asia_male[i]
    //     }
    //     //console.log(temp_obj);
    //     newArrayAsia.push(temp_obj);
    // }

    
    /**********  creating JSON file from Array of Objects  *********/
    var myJSON = JSON.stringify(newArray, 1,1);
    var myJSON2 = JSON.stringify(new_arr_total, 1, 1);
    var myJSON3 = JSON.stringify(StackArray, 1, 1);
    fs.writeFile("output.json", myJSON, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }

        console.log("JSON file1 has been saved.");
    });
    fs.writeFile("output3.json", myJSON3, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }

        console.log("JSON file3 has been saved.");
    });
    fs.writeFile("output2.json", myJSON2, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }

        console.log("JSON file2 has been saved.");
    });

});