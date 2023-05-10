const { assert ,expect} = require("chai");
const { network, deployments, ethers } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("ERC20Swap", function () {
          let erc20Swap;
          let erc20Token;
          const minAmount = 100;

          beforeEach(async () => {
              accounts = await ethers.getSigners();
              deployer = accounts[0];
              await deployments.fixture(["erc20swap"]);
              erc20Swap = await ethers.getContract("ERC20Swap");
              erc20Token = await ethers.getContractAt("IERC20", "0x963B286dC447874BC34fb479cC2A4D186FB749d1");
          });

          it("should swap Ether for ERC20 tokens", async function () {
              const ethAmount = ethers.utils.parseEther("1");

              // Send Ether to the ERC20Swap contract
              await erc20Swap.swapEtherToToken(erc20Token.address, minAmount, { value: ethAmount });

              // Check the token balance of the caller
              const callerBalance = await erc20Token.balanceOf(await ethers.getSigners()[0].address);
              assert.equal(callerBalance.toString(), ethAmount.mul(5).toString());
          });

          it("should revert if no Ether sent", async function () {
              await assert.reverts(
                  erc20Swap.swapEtherToToken(erc20Token.address, minAmount),
                  "No Ether sent"
              );
          });

          it("should revert if token amount is insufficient", async function () {
              const ethAmount = ethers.utils.parseEther("1");
              const invalidMinAmount = ethAmount.mul(5).add(1);

              await assert.reverts(
                  erc20Swap.swapEtherToToken(erc20Token.address, invalidMinAmount, { value: ethAmount }),
                  "Insufficient token amount"
              );
          });
      });
