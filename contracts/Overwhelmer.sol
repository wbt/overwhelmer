pragma solidity >=0.4.25 <0.6.0;

contract Overwhelmer {
	mapping (uint => string) public uniqueStrings;
    string public overwrittenString;

	function writeUniqueString(uint intIdentfier, string memory newString) public {
		uniqueStrings[intIdentfier] = newString;
	}

	function overwriteString(string memory newString) public {
		overwrittenString = newString;
	}
}
