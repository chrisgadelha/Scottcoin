import { expect } from "chai";
import { ethers } from "hardhat";
import { Scottcoin } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("Scottcoin", function () {
  let scottcoin: Scottcoin;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addr3: SignerWithAddress;

  beforeEach(async function () {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();
    const ScottcoinFactory = await ethers.getContractFactory("Scottcoin");
    scottcoin = await ScottcoinFactory.deploy();
    await scottcoin.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right name and symbol", async function () {
      expect(await scottcoin.name()).to.equal("Scottcoin");
      expect(await scottcoin.symbol()).to.equal("SCOTT");
    });

    it("Should assign the total supply to the owner", async function () {
      const ownerBalance = await scottcoin.balanceOf(owner.address);
      expect(await scottcoin.totalSupply()).to.equal(ownerBalance);
    });

    it("Should have correct initial supply", async function () {
      const expectedSupply = ethers.parseEther("10000"); // 10000 tokens with 18 decimals
      expect(await scottcoin.totalSupply()).to.equal(expectedSupply);
    });

    it("Should have 18 decimals", async function () {
      expect(await scottcoin.decimals()).to.equal(18);
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

    it("Should emit Transfer event", async function () {
      const amount = ethers.parseEther("100");
      await expect(scottcoin.transfer(addr1.address, amount))
        .to.emit(scottcoin, "Transfer")
        .withArgs(owner.address, addr1.address, amount);
    });

    it("Should fail when transferring to zero address", async function () {
      const amount = ethers.parseEther("100");
      await expect(
        scottcoin.transfer(ethers.ZeroAddress, amount)
      ).to.be.revertedWithCustomError(scottcoin, "ERC20InvalidReceiver");
    });

    it("Should fail when transferring amount greater than balance", async function () {
      const ownerBalance = await scottcoin.balanceOf(owner.address);
      await expect(
        scottcoin.transfer(addr1.address, ownerBalance + 1n)
      ).to.be.revertedWithCustomError(scottcoin, "ERC20InsufficientBalance");
    });
  });

  describe("Allowances", function () {
    const amount = ethers.parseEther("100");

    it("Should approve tokens for delegated transfer", async function () {
      await scottcoin.approve(addr1.address, amount);
      expect(await scottcoin.allowance(owner.address, addr1.address)).to.equal(amount);
    });

    it("Should emit Approval event", async function () {
      await expect(scottcoin.approve(addr1.address, amount))
        .to.emit(scottcoin, "Approval")
        .withArgs(owner.address, addr1.address, amount);
    });

    it("Should allow delegated transfer with allowance", async function () {
      await scottcoin.approve(addr1.address, amount);
      await scottcoin.connect(addr1).transferFrom(owner.address, addr2.address, amount);
      expect(await scottcoin.balanceOf(addr2.address)).to.equal(amount);
    });

    it("Should fail delegated transfer if allowance is insufficient", async function () {
      await scottcoin.approve(addr1.address, amount - 1n);
      await expect(
        scottcoin.connect(addr1).transferFrom(owner.address, addr2.address, amount)
      ).to.be.revertedWithCustomError(scottcoin, "ERC20InsufficientAllowance");
    });

    it("Should update allowance after transferFrom", async function () {
      await scottcoin.approve(addr1.address, amount);
      await scottcoin.connect(addr1).transferFrom(owner.address, addr2.address, amount / 2n);
      expect(await scottcoin.allowance(owner.address, addr1.address)).to.equal(amount / 2n);
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

    it("Should emit Transfer event on mint", async function () {
      const amount = ethers.parseEther("1000");
      await expect(scottcoin.mint(addr1.address, amount))
        .to.emit(scottcoin, "Transfer")
        .withArgs(ethers.ZeroAddress, addr1.address, amount);
    });

    it("Should fail when minting to zero address", async function () {
      const amount = ethers.parseEther("1000");
      await expect(
        scottcoin.mint(ethers.ZeroAddress, amount)
      ).to.be.revertedWithCustomError(scottcoin, "ERC20InvalidReceiver");
    });

    it("Should increase total supply when minting", async function () {
      const initialSupply = await scottcoin.totalSupply();
      const amount = ethers.parseEther("1000");
      await scottcoin.mint(addr1.address, amount);
      expect(await scottcoin.totalSupply()).to.equal(initialSupply + amount);
    });
  });
}); 