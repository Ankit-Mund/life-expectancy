// const readline = require('readline');

// const fs = require('fs');

// const newArray = [];
// const arrFemale = [];
// const arrMale = [];
// let counter = 0;
// let indexCountry;
// let indexIndicatorCode;
// let indexYear;
// let indexValue;

// const rl = readline.createInterface({
//   input: fs.createReadStream('./Indicators.csv'), // Read CSV file.
// });
// function remove(array, element) {
//   return array.filter(e => e !== element); // fn to remove irrelevant commas
// }
// rl.on('line', (line) => {
//   // console.log(`Line from file: ${line}`);
//   // console.log(typeof(line));

//   counter += 1;

//   const arr = line.split((/(".*?"|[^",]+)(?=,|$)+/g));

//   let filteredArray = remove(arr, ',');
//   filteredArray = remove(filteredArray, '');

//   if (counter === 1) { // headers
//     // console.log(arr);
//     indexCountry = filteredArray.indexOf('CountryName');
//     indexYear = filteredArray.indexOf('Year');
//     indexIndicatorCode = filteredArray.indexOf('IndicatorCode');
//     indexValue = filteredArray.indexOf('Value');
//   }
//   if (filteredArray[indexCountry] === 'India') { // filtration
//     if (filteredArray[indexIndicatorCode] === 'SP.DYN.LE00.FE.IN') {
//       const tempObj = {
//         year: filteredArray[indexYear],
//         le_female: filteredArray[indexValue], // female
//       };
//       arrFemale.push(tempObj);
//     } else if (filteredArray[indexIndicatorCode] === 'SP.DYN.LE00.MA.IN') {
//       const tempObj = {
//         year: filteredArray[indexYear],
//         le_male: filteredArray[indexValue], // male
//       };
//       arrMale.push(tempObj);
//     }
//   }
// }).on('close', () => {
//   let i;
//   let j;
//   for (i = 0; i < arrFemale.length; i += 1) {
//     for (j = 0; j < arrMale.length; j += 1) { // compare both array of objects
//       if (i === j) {
        
//         const tempObj = Object.assign(arrFemale[j], arrMale[i]); // new object for json
//         newArray.push(tempObj); // final filtered array of objects
//       }
//     }
//   }
//   // console.log(newArray)
//   const myJSON = JSON.stringify(newArray); // JSON creation

//   fs.writeFile('output.json', myJSON, 'utf8', (err) => {
//     if (err) {
//       console.log('An error occured while writing JSON Object to File.');
//       return console.log(err);
//     }
//   });
//   console.log('JSON file has been saved.');
// });


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
let newArrayGrowth = [];
let newArrayAsia = []; //stacked

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

//let asia_female = [];
//let asia_male = [];
let StackArray = [];

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

    if(filteredArray[indexCountry] === "India") {

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
        /*else if(filteredArray[indexIndicatorCode] === "SP.URB.GROW"){
            let temp_obj = {
                year: filteredArray[indexYear],
                growth_val: filteredArray[indexValue]
            }
            
            arr_ur_growth.push(temp_obj);
        } */
    }
    if(filteredArray[indexCountry] === "India") {

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

        }

    /* for(let i=0;i<countries.length;i++) {
        if(countries[i]===filteredArray[indexCountry]) {
            if(filteredArray[indexYear] === "2000") {
                if(filteredArray[indexIndicatorCode]==="SP.RUR.TOTL") {
                    let outobj = {
                        country: filteredArray[indexCountry],
                        rur_val: filteredArray[indexValue]
                    }
                    asia_female.push(outobj);
                }
                else if(filteredArray[indexIndicatorCode]==="SP.URB.TOTL") {
                    let outobj = {
                        country: filteredArray[indexCountry],
                        urb_val: filteredArray[indexValue]
                    }
                    asia_male.push(outobj);
                }
            }                        
        }
    } */


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

    newArrayGrowth = arr_ur_growth;
    /**********  creating JSON file from Array of Objects  *********/
    var myJSON = JSON.stringify(newArray, 1,1);
    //var myJSON2 = JSON.stringify(newArrayGrowth, 1, 1);
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
    // fs.writeFile("output3.json", myJSON3, 'utf8', function (err) {
    //     if (err) {
    //         console.log("An error occured while writing JSON Object to File.");
    //         return console.log(err);
    //     }

    //     console.log("JSON file3 has been saved.");
    // });

});