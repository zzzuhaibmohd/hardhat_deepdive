const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("Token.sol", () => {
    let contractFactory;
    let contract;
    let owner;
    let alice;
    let bob;
    let initialSupply;
    let ownerAddress;
    let aliceAddress;
    let bobAddress;

    beforeEach(async () => {
        //setting up the global varaibles so we do not have to redine them
        //initialize the users of the contract
        //First user is always the owner
        [owner, alice, bob] = await ethers.getSigners();
        //set the initial supply
        initialSupply = ethers.utils.parseEther("1000");
        contractFactory = await ethers.getContractFactory("Token");
        contract = await contractFactory.deploy(initialSupply);
        ownerAddress = await owner.getAddress();
        aliceAddress = await alice.getAddress();
        bobAddress = await bob.getAddress();
    });

    describe("Correct setup", () => {
        it("should be named 'HAHA", async () => {
            const name = await contract.name();
            expect(name).to.equal("HAHA");
        });
        it("should have correct supply", async () => {
            const supply = await contract.getTotalSupply();
            expect(supply).to.equal(initialSupply);
        });
        it("owner should have all the supply", async () => {
            const ownerBalance = await contract.balanceOf(ownerAddress);
            expect(ownerBalance).to.equal(initialSupply);
        });
    });

    describe("Core", () => {
        it("owner should transfer to Alice and update balances", async () => {
            const transferAmount = ethers.utils.parseEther("100");
            let aliceBalance = await contract.balanceOf(aliceAddress);
            expect(aliceBalance).to.equal(0);
            await contract.transfer(transferAmount, aliceAddress);
            aliceBalance = await contract.balanceOf(aliceAddress);
            expect(aliceBalance).to.equal(transferAmount);
        });
        it("owner should transfer to Alice and Alice to Bob", async () => {
            const transferAmount = ethers.utils.parseEther("100");
            await contract.transfer(transferAmount, aliceAddress); // contract is connected to the owner.
            let bobBalance = await contract.balanceOf(bobAddress);
            expect(bobBalance).to.equal(0);
            await contract.connect(alice).transfer(transferAmount, bobAddress);
            bobBalance = await contract.balanceOf(bobAddress);
            expect(bobBalance).to.equal(transferAmount);
        });
        it("should fail if Alice tries to send Bob more than her current balance", async () => {
            const transferAmount = ethers.utils.parseEther("100");
            await contract.transfer(transferAmount, aliceAddress); // contract is connected to the owner.
            let bobBalance = await contract.balanceOf(bobAddress);
            expect(bobBalance).to.equal(0);
            await expect(contract.transfer(transferAmount + 1, bobAddress)).to.be.revertedWith("Not enough funds");
            //await contract.connect(alice).transfer(transferAmount, bobAddress);
            //bobBalance = await contract.balanceOf(bobAddress);
            //expect(bobBalance).to.equal(transferAmount);
        });
        it("should fail if owner tries to transfer more tokens than minted", async () => {
            const txFailure = initialSupply + 1;
            await expect(contract.transfer(txFailure, aliceAddress)).to.be.revertedWith("Not enough funds");
        });
    });
});