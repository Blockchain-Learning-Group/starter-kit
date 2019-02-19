pragma solidity ^0.4.24;

contract Storage {
  string public simpleStorageVariable;

  event StorageUpdated(string value);

  function setSotrageVariable(string value) external {
    simpleStorageVariable = value;
    emit StorageUpdated(value);
  }
}
