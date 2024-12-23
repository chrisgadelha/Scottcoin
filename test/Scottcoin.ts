import { expect } from "chai";
import { ethers } from "hardhat";
import { Scottcoin } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("Scottcoin", function () {
  let scottcoin: Scottcoin;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const ScottcoinFactory = await ethers.getContractFactory("Scottcoin");
    scottcoin = await ScottcoinFactory.deploy();
    await scottcoin.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right name and symbol", async function () {
      expect(await scottcoin.name()).to.equal("Scottcoin");
      expect(await scottcoin.symbol()).to.equal("SCOTR");
    });

    it("Should assign the total supply to the owner", async function () {
      const ownerBalance = await scottcoin.balanceOf(owner.address);
      expect(await scottcoin.totalSupply()).to.equal(ownerBalance);
    });

    it("Should have correct initial supply", async function () {
      const expectedSupply = ethers.parseEther("10000"); // 10000 tokens with 18 decimals
      expect(await scottcoin.totalSupply()).to.equal(expectedSupply);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      const amount = ethers.parseEther("100");
      await scottcoin.transfer(addr1.address, amount);
      expect(await scottcoin.balanceOf(addr1.address)).to.equal(amount);

      await scottcoin.connect(addr1).transfer(addr2.address, amount);
      expect(await scottcoin.balanceOf(addr2.address)).to.equal(amount);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await scottcoin.balanceOf(owner.address);
      await expect(
        scottcoin.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWithCustomError(scottcoin, "ERC20InsufficientBalance");
      expect(await scottcoin.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint tokens", async function () {
      const amount = ethers.parseEther("1000");
      await scottcoin.mint(addr1.address, amount);
      expect(await scottcoin.balanceOf(addr1.address)).to.equal(amount);
    });

    it("Should not allow non-owner to mint tokens", async function () {
      const amount = ethers.parseEther("1000");
      await expect(
        scottcoin.connect(addr1).mint(addr1.address, amount)
      ).to.be.revertedWithCustomError(scottcoin, "OwnableUnauthorizedAccount");
    });
  });
}); 