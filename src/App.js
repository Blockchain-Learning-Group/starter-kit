import React, { Component } from 'react';
import logo from './blg.jpg';
import './App.css';
import Web3 from 'web3';

// Material UI
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

// Import build Artifacts
import storageArtifacts from './build/contracts/Storage.json';

class App extends Component {
  state = {
    storage: null,  // For contract reference
    simpleStorageVariable: "",
    storageValueToSet: ""
  };

  async componentDidMount() {
    // Create a web3 connection
    const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

    if (web3.isConnected()) {
        web3.version.getNetwork(async (err, netId) => {
          if (netId in storageArtifacts.networks) {
            // Where the storage contract was deployed to, be sure you have run truffle deploy before!
            const storageAddress = storageArtifacts.networks[netId].address;
            // The reference of the deployed contract
            const storage = web3.eth.contract(storageArtifacts.abi).at(storageAddress);

            // Save the web3 connection and reference to the contract in the application's state for later access
            this.setState({ web3: web3 });
            this.setState({ storage: storage });
            console.log(storage);

            // Initial Storage value
            const simpleStorageVariable = await storage.simpleStorageVariable();
            this.setState({ simpleStorageVariable: simpleStorageVariable });

            this.listenForEvents();
          }
        });
    }
  }

  async setSotrageVariable(value) {
    // Define that account that is going to send the transaction
    const sender = this.state.web3.eth.accounts[0];

    // Send the transaction to the storage contract to set the storage variable
    const transactionHash = await this.state.storage.setSotrageVariable(value, { from: sender, gas: 4e6 });
    console.log(transactionHash);
  }

  listenForEvents() {
    this.state.storage.StorageUpdated({ fromBlock: 'latest', toBlock: 'latest' })
    .watch(async (error, eventLog) => {
      console.log(eventLog);
      
      // Update the application's state with the new value
      const newValue = await this.state.storage.simpleStorageVariable();
      this.setState({ simpleStorageVariable: newValue });
    });
  }

  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <header className="App-header">
            <img src={logo} alt="logo" style={{height: '150px', width: '350px'}}/>
          </header>
          <div>
            <h3>Current Storage Value</h3>
            <p className="App-intro">{this.state.simpleStorageVariable ||  "Empty"}</p>
            
            <h3>Set the Storage Value</h3>
            <TextField floatingLabelText="New Value." style={{width: 200}} value={this.state.storageValueToSet}
              onChange={(e, value) => {this.setState({ storageValueToSet: value })}}
            />
            <RaisedButton label="SET" labelPosition="before" primary={true}
              onClick={() => this.setSotrageVariable(this.state.storageValueToSet)}
            />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;