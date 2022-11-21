import { ethers } from "hardhat";
import { MyToken, MyToken__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config();

const TEST_MINT_VALUE = ethers.utils.parseEther("10");

async function main() {
    const provider = ethers.getDefaultProvider("goerli");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
    const signer = wallet.connect(provider);

    const args = process.argv;
    const parameters = args.slice(2);
    if (parameters.length <= 0) throw new Error("Not enough arguments");
    const erc20ContractAddress = parameters[0];

    console.log("Attaching ERC20 Token contract");
    let erc20Contract: MyToken;
    const erc20ContractFactory = new MyToken__factory(signer);
    erc20Contract = erc20ContractFactory.attach(erc20ContractAddress);

    console.log("Minting tokens to self");
    const mintTx = await erc20Contract.mint(signer.address, TEST_MINT_VALUE);
    await mintTx.wait();
    let tokenBalance = await erc20Contract.balanceOf(signer.address);
    console.log(`ERC20 token balance: ${tokenBalance}`);

    console.log("Delegating voting power to self");
    const delegateTx = await erc20Contract.delegate(signer.address);
    await delegateTx.wait();
    let votePower = await erc20Contract.getVotes(signer.address);
    console.log(`Vote power: ${votePower}`);
}

main().catch((err) => {
    console.log(err);
    process.exitCode = 1;
})