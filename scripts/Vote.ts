import { ethers } from "hardhat";
import { Ballot, Ballot__factory, MyToken, MyToken__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config();

// Only voting with 70% of vote power
const TEST_VOTE_POWER_VALUE = ethers.utils.parseEther("7");

async function main() {
    const provider = ethers.getDefaultProvider("goerli");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
    const signer = wallet.connect(provider);

    const args = process.argv;
    const parameters = args.slice(2);
    if (parameters.length <= 0) throw new Error("Not enough arguments");
    const erc20ContractAddress = parameters[0];
    const tokenizedBallotContractAddress = parameters[1];
    const proposal = parameters[2];

    console.log("Attaching ERC20 Token contract");
    let erc20Contract: MyToken;
    const erc20ContractFactory = new MyToken__factory(signer);
    erc20Contract = erc20ContractFactory.attach(erc20ContractAddress);

    console.log("Attaching Tokenized Ballot contract");
    let tokenizedBallotContract: Ballot;
    const tokenizedBallotContractFactory = new Ballot__factory(signer);
    tokenizedBallotContract = tokenizedBallotContractFactory.attach(tokenizedBallotContractAddress);

    console.log("Voting on proposal");
    const voteTx = await tokenizedBallotContract.vote(proposal, TEST_VOTE_POWER_VALUE);
    await voteTx.wait();
}

main().catch((err) => {
    console.log(err);
    process.exitCode = 1;
})