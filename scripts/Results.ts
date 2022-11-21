import { ethers } from "hardhat";
import { Ballot, Ballot__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
import { BigNumber } from "ethers";
dotenv.config();

async function main() {
    const provider = ethers.getDefaultProvider("goerli");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
    const signer = wallet.connect(provider);

    const args = process.argv;
    const parameters = args.slice(2);
    if (parameters.length <= 0) throw new Error("Not enough arguments");
    const tokenizedBallotContractAddress = parameters[0];

    console.log("Attaching Tokenized Ballot contract");
    let tokenizedBallotContract: Ballot;
    const tokenizedBallotContractFactory = new Ballot__factory(signer);
    tokenizedBallotContract = tokenizedBallotContractFactory.attach(tokenizedBallotContractAddress);

    console.log("Querying results");
    let winnerName: any = await tokenizedBallotContract.winnerName();
    winnerName = ethers.utils.parseBytes32String(winnerName);
    console.log(`Winning proposal name: ${winnerName}`);

    let remainingVotePower: BigNumber = await tokenizedBallotContract.votePower(signer.address);
    console.log(`Remaining vote power: ${remainingVotePower}`);
}

main().catch((err) => {
    console.log(err);
    process.exitCode = 1;
})