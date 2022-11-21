import { ethers } from "hardhat";
import { Ballot, Ballot__factory, MyToken, MyToken__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config();

function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
        bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
}

async function main() {
    const provider = ethers.getDefaultProvider("goerli");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
    const signer = wallet.connect(provider);

    const args = process.argv;
    const proposals = args.slice(2);
    if (proposals.length <= 0) throw new Error("Not enough arguments");

    console.log("Deploying ERC20 Token contract");
    let erc20Contract: MyToken;
    const erc20ContractFactory = new MyToken__factory(signer);
    erc20Contract = await erc20ContractFactory.deploy();
    await erc20Contract.deployed();
    console.log(`ERC20 token contract was deployed at: ${erc20Contract.address}`);

    // Proposal examples (input parameters) are names of favorite DeFi protocol: MakerDAO, Aave, Uniswap
    console.log("Proposals: ");
    proposals.forEach((element, index) => {
        console.log(`Proposal N. ${index + 1}: ${element}`);
    });

    console.log("Deploying Tokenized Ballot contract");
    let tokenizedBallotContract: Ballot;
    const tokenizedBallotContractFactory = new Ballot__factory(signer);
    // ~250 blocks in the future since time of deployment
    tokenizedBallotContract = await tokenizedBallotContractFactory.deploy(convertStringArrayToBytes32(proposals), erc20Contract.address, 7991353);
    await tokenizedBallotContract.deployed();
    console.log(`Tokenized Ballot contract was deployed at: ${tokenizedBallotContract.address}`);
}

main().catch((err) => {
    console.log(err);
    process.exitCode = 1;
})