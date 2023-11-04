const ethers = require('ethers');

const providerUrl = "wss://rpc.ankr.com/scroll/ws/96f299e6c2497e7fca7cfd26f31ef725dc468688c184bb9c30d480ae44cb5344";
//const providerUrl = 'https://rpc.ankr.com/scroll'
//const provider = new ethers.JsonRpcProvider(providerUrl)
const provider = new ethers.WebSocketProvider(providerUrl);
const args = process.argv.slice(2);

const mnemonic = ethers.Mnemonic.fromPhrase(args[0]);

//主钱包，用来生成 m/44'/60'/0'/0/{i} 路径地址
//仅用于派生地址，不交互

let mainWallet = ethers.HDNodeWallet.fromMnemonic(mnemonic, "m/44'/60'/0'/0");
mainWallet = mainWallet.connect(provider)

const wallet0 = mainWallet.deriveChild(0);
console.log(0, wallet0.address)

//部署分发合约
async function disp() {
    const tx = {
        data: '0x608060405234801561001057600080fd5b506106f4806100206000396000f300608060405260043610610057576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806351ba162c1461005c578063c73a2d60146100cf578063e63d38ed14610142575b600080fd5b34801561006857600080fd5b506100cd600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001908201803590602001919091929391929390803590602001908201803590602001919091929391929390505050610188565b005b3480156100db57600080fd5b50610140600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001908201803590602001919091929391929390803590602001908201803590602001919091929391929390505050610309565b005b6101866004803603810190808035906020019082018035906020019190919293919293908035906020019082018035906020019190919293919293905050506105b0565b005b60008090505b84849050811015610301578573ffffffffffffffffffffffffffffffffffffffff166323b872dd3387878581811015156101c457fe5b9050602002013573ffffffffffffffffffffffffffffffffffffffff1686868681811015156101ef57fe5b905060200201356040518463ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019350505050602060405180830381600087803b1580156102ae57600080fd5b505af11580156102c2573d6000803e3d6000fd5b505050506040513d60208110156102d857600080fd5b810190808051906020019092919050505015156102f457600080fd5b808060010191505061018e565b505050505050565b60008060009150600090505b8585905081101561034657838382818110151561032e57fe5b90506020020135820191508080600101915050610315565b8673ffffffffffffffffffffffffffffffffffffffff166323b872dd3330856040518463ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019350505050602060405180830381600087803b15801561041d57600080fd5b505af1158015610431573d6000803e3d6000fd5b505050506040513d602081101561044757600080fd5b8101908080519060200190929190505050151561046357600080fd5b600090505b858590508110156105a7578673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb878784818110151561049d57fe5b9050602002013573ffffffffffffffffffffffffffffffffffffffff1686868581811015156104c857fe5b905060200201356040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050602060405180830381600087803b15801561055457600080fd5b505af1158015610568573d6000803e3d6000fd5b505050506040513d602081101561057e57600080fd5b8101908080519060200190929190505050151561059a57600080fd5b8080600101915050610468565b50505050505050565b600080600091505b858590508210156106555785858381811015156105d157fe5b9050602002013573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc858585818110151561061557fe5b905060200201359081150290604051600060405180830381858888f19350505050158015610647573d6000803e3d6000fd5b5081806001019250506105b8565b3073ffffffffffffffffffffffffffffffffffffffff1631905060008111156106c0573373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f193505050501580156106be573d6000803e3d6000fd5b505b5050505050505600a165627a7a72305820104eaf57909eb0d29f37ba9e3196e8e88438f83546136cf61270ca5d3b491e160029'
    };
    const txResponse = await wallet0.sendTransaction(tx);
    console.log(` ${txResponse.hash}`);
}

async function gen(start, amount) {
    let abi = [{ "constant": false, "inputs": [{ "name": "token", "type": "address" }, { "name": "recipients", "type": "address[]" }, { "name": "values", "type": "uint256[]" }], "name": "disperseTokenSimple", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "token", "type": "address" }, { "name": "recipients", "type": "address[]" }, { "name": "values", "type": "uint256[]" }], "name": "disperseToken", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "recipients", "type": "address[]" }, { "name": "values", "type": "uint256[]" }], "name": "disperseEther", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }]
    let addresses = []
    let amounts = []
    let aa = ethers.parseEther('0.00015')
    for (let i = start; i < start + amount; i++) {
        const childWallet = mainWallet.deriveChild(`${i}`);
        const childAddress = childWallet.address;
        addresses.push(childAddress)
        amounts.push(aa)
    }
    var iface = new ethers.Interface(abi)
    var calldata = iface.encodeFunctionData('disperseEther', [addresses, amounts]);
    const tx = {
        value: aa * BigInt(amount),
        to: '0xaf1f850154fb2484834ce7d369eb712ba9d194d9',//分发合约
        data: calldata
    };
    const txResponse = await wallet0.sendTransaction(tx);
    console.log(`over ${txResponse.hash}`);
}
//gen(1, 200)

async function deployContract(start, amount) {
    for (let i = start; i < start + amount; i++) {
        const childWallet = mainWallet.deriveChild(`${i}`);
        const childAddress = childWallet.address;
        const tx1 = {
            data: '0x608060405234801561001057600080fd5b5060008061001f6000396000f3fe'
        };
        const txResponse1 = await childWallet.sendTransaction(tx1);
        console.log(`${i}: ${txResponse1.hash}`);
    }
}
deployContract(1, 200)

async function recovery(start, amount) {
    // const targetAddress = '0x54b6032105A6DBdcdb21aD4A2707A8909AF153D7'; // 将 ETH 转移到此地址

    // const gasPrice = (await provider.getFeeData()).gasPrice
    // console.log(gasPrice)
    // const balance = await provider.getBalance(wallet0.address);
    // console.log(balance)

    // // 计算要转移的金额
    // const valueToSend = balance - (gasPrice * BigInt(21000)) * BigInt(3);
    // console.log(valueToSend)
    // if (valueToSend > BigInt(0)) {
    //     const tx = {
    //         to: targetAddress,
    //         value: valueToSend,
    //         gasLimit: 21000,
    //         gasPrice: gasPrice
    //     };

    //     const txResponse = await wallet0.sendTransaction(tx);

    //     await txResponse.wait();
    //     console.log(`成功发送 ${ethers.utils.formatEther(valueToSend)} ETH 到 ${targetAddress}`);
    // } else {
    //     console.log('余额不足以支付燃气费用。');
    // }

    for (let i = start; i < start + amount; i++) {
        const childWallet = mainWallet.deriveChild(`${i}`);
        console.log(i, childWallet.path)
        const childAddress = childWallet.address;
        childWallet.connect(provider)
        // 获取账户余额
        const balance = await provider.getBalance(childAddress);
        console.log(i, childAddress, balance)
        if (false && balance > BigInt(0)) {
            // 预估燃气费用
            const gasEstimate = await childWallet.estimateGas({ to: targetAddress, gasLimit: 21000, value: 0 });

            // 计算要转移的金额
            const valueToSend = balance.sub(gasEstimate);
            console.log(valueToSend)
            if (false && valueToSend > BigInt(0)) {
                const tx = {
                    to: targetAddress,
                    value: valueToSend,
                    gasLimit: gasEstimate.toNumber(),
                };

                const txResponse = await childWallet.sendTransaction(tx);

                await txResponse.wait();
                console.log(`成功发送 ${ethers.utils.formatEther(valueToSend)} ETH 到 ${targetAddress}`);
            } else {
                console.log('余额不足以支付燃气费用。');
            }
        }

        //console.log(`${i}: ${txResponse1.hash}`);
    }
}
//recovery(1, 101)

// async function main() {
//     const tx = {
//         data: '0x608060405234801561001057600080fd5b5060008061001f6000396000f3fe'
//     };
//     const txResponse = await wallet0.sendTransaction(tx);
//     console.log(`Transaction hash: ${txResponse.hash}`);
//     process.exit()
// }
// main()
