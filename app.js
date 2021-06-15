// We will get the file(input) using csvtojson Dependency
// Fs and path are used to get the file system and path respectively
//Then we have to sort on basis such that fees is maximized and weight is minimum (weight < 4000000)
//The sorting formula used here is fees/weight so we get all the desired transaction ids
//We are good to go :)

let fs = require("fs");
let path = require("path");

let content = fs.readFileSync(path.join(__dirname,"mempool.csv"), 
                        "utf-8", function (err) {
                        console.log(err);
                        });

content = content.split("\n");
headers = content.shift().split(",");
let json = [];
content.forEach(function (individualfile) {
  temp = {};
  row = individualfile.split(",");
  for (var i = 0; i < headers.length; i++) {
    temp[headers[i]] = row[i];
  }
  json.push(temp);
});

//Sorting Algorithm
json.sort((var1, var2) => var2.fee / var2.weight - var1.fee / var1.weight);

let output = [], totalWeight = 0,i = 0;

const maxWeight = 4000000;

while (totalWeight < maxWeight && i < json.length) {
  if (totalWeight + parseInt(json[i].weight) > maxWeight) {
    i++;
    continue;
  }
  if (!json[i].parents) {
    output.push(json[i].tx_id);
    totalWeight += +json[i].weight;
    i++;
  } else if (json[i].parents) {
    if (output.includes(`${json[i].parents}`)) {
      output.push(json[i].tx_id);
      totalWeight += +json[i].weight;
      i++;
    } else {
      i++;
    }
  }
}


// Exporting in block.txt
const CreateFile = fs.createWriteStream("./block.txt", {  flags: "a" });

for (let i = 0; i < output.length; i++) {
  CreateFile.write(output[i].toString() + "\r\n");
}
