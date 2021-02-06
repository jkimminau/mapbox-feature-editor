import React from 'react';

class App extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      features: []
    }
  }

  componentDidMount() {
    fetch(`https://api.mapbox.com/datasets/v1/loopguys/ck2b8qu2901u92impqz7ebr65/features?access_token=sk.eyJ1IjoibG9vcGd1eXMiLCJhIjoiY2syY3h2NXVwMjFnbDNibnA2cmZncGYzNCJ9.ANVYeZ4AK13dGPY9PHIqrw`)
      .then(response => {
        return response.json();
      }).then(response => {
        this.setState({features: response.features});
      })
  }

  render(){
    const { feature } = this.props;
    return (feature ? 
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            margin: '20px', 
            border: '1px solid #00F7FE', 
            borderRadius: '15px', 
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '20px', 
                color: 'white'
            }}>
                <div style={{ whiteSpace: 'pre', lineHeight: '30px' }}>{Object.keys(feature.properties).map(key => `${key}:\n`)}</div>
                <div style={{width: '50px'}}/>
                <div style={{ whiteSpace: 'pre', lineHeight: '30px' }}>{Object.keys(feature.properties).map(key => `${feature.properties[key]}\n`)}</div>
            </div>
        </div> : 
        <></>
    );
  }
}

export default App;
