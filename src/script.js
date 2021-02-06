const fetch = require("node-fetch");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const readline = require('readline')
const username= 'loopguys'
const accessToken= 'sk.eyJ1IjoibG9vcGd1eXMiLCJhIjoiY2syY3h2NXVwMjFnbDNibnA2cmZncGYzNCJ9.ANVYeZ4AK13dGPY9PHIqrw'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const it = rl[Symbol.asyncIterator]();

const fetchDataset = (username, accessToken, datasetID) => {
    const dataset = fetch(`https://api.mapbox.com/datasets/v1/${username}/${datasetID}/features?access_token=${accessToken}`)
      .then(response => {
        return response.json();
      }).then(response => {
        return response
      })
    return dataset;
}

const saveDataset = (username, datasetID, accessToken, features) => {
    features.forEach(feature => {
      fetch(`https://api.mapbox.com/datasets/v1/${username}/${datasetID}/features/${feature.id}?access_token=${accessToken}`, {
        method: "PUT",
        body: JSON.stringify(feature),
        headers: {
            'Content-Type': 'application/json'
        }
      })
    })
  }

const datasetIDs= [
    'ck450ae8b1kjc2op5s8njblkn',
    'cjut71g2805h832pejhnlbz2f',
    'ck77z21tt0lih2tt2evqxp2d3',
    'cjut71xvf20zg33qu09jlcsm8',
    'cjyqwzlwh0o2l2onv1hwe34jw',
    'cjut6xyy2byds2xqunfv31dpt',
]

let routes = []
let cities = {}
let rows = []
const main = async () => {
    for (i in datasetIDs) {
        const dataset = await fetchDataset(username, accessToken, datasetIDs[i])
        const features = dataset.features;
        const routes = features.filter(feature => feature.geometry.type === 'MultiLineString')
        const stops = features.filter(feature => feature.geometry.type === 'Point')
        console.log(routes)
        // for (j in features){
            
        //     if (features[j].geometry.type === 'LineString'){
        //         console.log(features[j])
        //         features[j].geometry.type = 'MultiLineString' 
        //         features[j].geometry.coordinates = [features[j].geometry.coordinates]
        //         if (!features[j].properties.routename)
        //             features[j].properties.routename = features[j].properties.name
        //         console.log(features[j].properties.routename)
        //     }
        // }
        // await saveDataset(username, datasetIDs[i], accessToken, features)
        
        // for (i in dataset.features){
        //     if (dataset.features[i].geometry.type !== 'Point'){
        //         routes.push({name: dataset.features[i].properties.routename, featureID: dataset.features[i].properties.featureID, needsMultiLineString: dataset.features[i].geometry.type !== 'MultiLineString' })
        //     } else if (dataset.features[i].geometry.type === 'Point'){
        //         if (cities[dataset.features[i].properties.routeID])
        //             cities[dataset.features[i].properties.routeID].push({name: dataset.features[i].properties.name, featureID: dataset.features[i].properties.featureID, needsFeatureID: dataset.features[i].properties.featureID === dataset.features[i].properties.routeID})
        //         else
        //             cities[dataset.features[i].properties.routeID] = [{name: dataset.features[i].properties.name, featureID: dataset.features[i].properties.featureID, needsFeatureID: dataset.features[i].properties.featureID === dataset.features[i].properties.routeID}]
        //     }
        // }
    }
    // for (routeID in cities){
    //     for (i in cities[routeID]){
    //         let item = {
    //             name: cities[routeID][i].name,
    //             featureID: cities[routeID][i].featureID,
    //             needsFeatureID: cities[routeID][i].needsFeatureID || '',
    //             routeID,
    //         }
    //         rows.push(item)
    //     }
    //     // console.log(`Route : ${routes[i].name} : ${routes[i].featureID} ${routes[i].needsMultiLineString ? '\t//needs to be multilinestring' : ''}`)
    //     // for (j in cities[routes[i].featureID]){
    //     //     item[j] = cities[routes[i].featureID][j].featureID
    //     //     console.log(`\tCity : ${cities[routes[i].featureID][j].name} : ${cities[routes[i].featureID][j].featureID} ${cities[routes[i].featureID][j].needsFeatureID ? '\t//needs a unique featureID' : ''}`)
    //     // }
        
    // }
    // const csvWriter = createCsvWriter({
    //     path: './output.csv',
    //     header: [
    //         {id: 'featureID', title: 'featureID'},
    //         {id: 'name', title: 'City Name'},
    //         {id: 'needsFeatureID', title: 'Needs a unique featureID'},
    //         {id: 'routeID', title: 'Route featureID'},
    //     ]
    // });
    
    
    // await csvWriter.writeRecords(rows)       // returns a promise
    process.exit(1)
}

main()