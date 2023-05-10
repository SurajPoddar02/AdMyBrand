// SPDX-License-Identifier: MIT
pragma solidity^0.8.18;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ERC20Swapper {
    function swapEtherToToken(address token, uint minAmount) external payable returns (uint);
}

contract ERC20Swap is ERC20Swapper {
    function swapEtherToToken(address token, uint minAmount) external payable override returns (uint) {

        //Sender needs to send some eth value, value should be greater than zero
        require(msg.value > 0, "No Ether sent");
        
        uint256 senderEth = msg.value;

        //Get the token contract instance
        IERC20 tokenContract = IERC20(token);

        //Here i am giving the customize converion of token amount
        uint256 amountOfToken = senderEth * 5; // Example: 1 Ether = 5 tokens

        //Transfer the tokens to the caller
        require(amountOfToken >= minAmount, "Insufficient token amount");
        tokenContract.transfer(msg.sender, amountOfToken);
        
        return amountOfToken;
    }
}
