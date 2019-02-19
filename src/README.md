# Quick Start

## Dependencies
git clone https://github.com/Blockchain-Learning-Group/starter-kit.git
cd starter-kit
npm install

## Starting your Ethereum Node
ganache-cli

## Deploying the Contract
- In a new terminal window as ganache will block the one above
cd src
truffle deploy --reset

## Start the Application
- Ensure you are not in the src directory but are in the starter-kit directory
cd ..
npm start

## Usage
Enter a new value and set that as the storage variable within the contract
View as the value is updated as soon as the event is caught