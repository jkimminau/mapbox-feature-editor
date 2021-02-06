import React from 'react';
import Feature from './Feature'

class App extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      features: [],
      username: '',
      datasetID: '',
      accessToken: '',
      loadStatus: undefined,
    }

    this.updateNewFeatureName = this.updateNewFeatureName.bind(this)
    this.updateNewFeatureData = this.updateNewFeatureData.bind(this)
    this.updateLookupFeatureName = this.updateLookupFeatureName.bind(this)
    this.updateLookupFeatureData = this.updateLookupFeatureData.bind(this)
    this.updateUsername = this.updateUsername.bind(this)
    this.updateDatasetID = this.updateDatasetID.bind(this)
    this.updateAccessToken = this.updateAccessToken.bind(this)
    this.addFeatureViaLookup = this.addFeatureViaLookup.bind(this)
    this.fetchDataset = this.fetchDataset.bind(this)
    this.saveDataset = this.saveDataset.bind(this)
  }

  componentDidMount() {
  }

  render(){
    const { features, loadStatus } = this.state;
    return (
      <div style={{display: 'flex', flexDirection: 'row', height: '100vh', overflow: 'hidden'}}>
        <div style={{ display: 'flex', flexDirection: 'column', width: '350px', padding: '20px', lineHeight: '30px', color: 'white', whiteSpace: 'pre', background: 'linear-gradient(180deg, rgba(34,33,35,1) 0%, rgba(18,18,18,1) 100%)', border: '1px solid #E8E8E8', height: '100%', }}>
          <div style={{marginBottom: '20px', display: 'flex', flexDirection: 'column'}}>
            <>{`Username:\n`}<input type="text" onChange={this.updateUsername}/></>
            <>{`Dataset ID:\n`}<input type="text" onChange={this.updateDatasetID}/></>
            <>{`Access Token:\n`}<input type="text" onChange={this.updateAccessToken}/></>
            <button onClick={this.fetchDataset}>Load my Dataset</button>
            {loadStatus === false && <div style={{color: 'red'}}>Load Failed</div>}
          </div>

          {`Feature to add or replace:\n`}
          <input type="text" onChange={this.updateNewFeatureName}/>
          {`Paste the new data here:\n`}
          <input type="text" onChange={this.updateNewFeatureData}/>
          {`Feature to lookup with:\n`}
          <input type="text" onChange={this.updateLookupFeatureName}/>
          {`Paste the lookup data here:\n`}
          <input type="text" onChange={this.updateLookupFeatureData}/>
          <button onClick={this.addFeatureViaLookup}>Add new feature by lookup</button>
          <button onClick={this.saveDataset}>Save my Dataset</button>
        </div>
        <div style={{ height: '100vh', width: '100%', display: 'flex', flexDirection: 'row', backgroundColor: '#222123', overflow: 'scroll'}}>
          {features.map((feature) => <Feature feature={feature} />)}
        </div>
      </div>
    );
  }

  updateNewFeatureName(ev) {
    this.setState({newFeatureName: ev.target.value})
  }

  updateNewFeatureData(ev) {
    navigator.clipboard.readText()
      .then(response => {
        const data = response.split('\n').map(item => item.replace(/[^a-zA-Z\w0-9 ]/g, ""));
        this.setState({newFeatureData: data})
      })
  }

  updateLookupFeatureName(ev) {
    this.setState({lookupFeatureName: ev.target.value})
  }

  updateLookupFeatureData(ev) {
    navigator.clipboard.readText()
      .then(response => {
        const data = response.split('\n').map(item => item.replace(/[^a-zA-Z\w0-9 ]/g, ""));
        this.setState({lookupFeatureData: data})
      })
  }

  updateUsername(ev) {
    this.setState({username: ev.target.value})
  }

  updateDatasetID(ev) {
    this.setState({datasetID: ev.target.value})
  }

  updateAccessToken(ev) {
    this.setState({accessToken: ev.target.value})
  }

  addFeatureViaLookup() {
    const { newFeatureName, newFeatureData, lookupFeatureName, lookupFeatureData, features } = this.state;

    console.log(lookupFeatureData)
    let lookupObject = {}
    lookupFeatureData.forEach((key, index) => {
      lookupObject[key] = newFeatureData[index]
    })
    console.log(lookupObject)
    features.forEach(feature => {
      feature.properties[newFeatureName] = lookupObject[feature.properties[lookupFeatureName]];
    })

    console.log(features)
    this.setState(features)
  }

  fetchDataset(){
    const { username, datasetID, accessToken } = this.state;
    fetch(`https://api.mapbox.com/datasets/v1/${username}/${datasetID}/features?access_token=${accessToken}`)
      .then(response => {
        this.setState({loadStatus: response.ok === true})
        return response.json();
      }).then(response => {
        if (response.features)
          this.setState({features: response.features});
      })
  }

  saveDataset(){
    const { username, datasetID, accessToken, features } = this.state;
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
}

export default App;
