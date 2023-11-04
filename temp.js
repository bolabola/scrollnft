const ethers = require('ethers');
const args = process.argv.slice(2);

const providerUrl = "wss://rpc.ankr.com/scroll/ws/96f299e6c2497e7fca7cfd26f31ef725dc468688c184bb9c30d480ae44cb5344";
const provider = new ethers.WebSocketProvider(providerUrl);

const mnemonic = ethers.Mnemonic.fromPhrase(args[0]);

//主钱包，用来生成 m/44'/60'/0'/0/{i} 路径地址
//仅用于派生地址，不交互

const hdNode = ethers.HDNodeWallet.fromSeed(mnemonic.computeSeed());
console.log("a", hdNode.path)
hdNode.connect(provider)
console.log(hdNode.provider)

let path = ethers.getIndexedAccountPath(0);
console.log(0, hdNode.derivePath(path).path)

path = ethers.getIndexedAccountPath(1);
console.log(1, hdNode.derivePath(path).path)

path = ethers.getIndexedAccountPath(2);
console.log(2, hdNode.derivePath(path).path)
//
const bmainWallet = ethers.HDNodeWallet.fromMnemonic(mnemonic, "m/44'/60'/0'/0");
bmainWallet.connect(provider)
console.log(bmainWallet.provider)

const wallet0 = bmainWallet.deriveChild(0);
const wallet1 = bmainWallet.deriveChild(1);
const wallet2 = bmainWallet.deriveChild(2);
const wallet3 = bmainWallet.deriveChild(3);

console.log('b', bmainWallet.path)
console.log('0', wallet0.path)
console.log('1', wallet1.path)
console.log('2', wallet2.path)
console.log('3', wallet3.path)

const cmainWallet = ethers.HDNodeWallet.fromPhrase(args[0], null, "m/44'/60'/0'/0");
cmainWallet.connect(provider)
console.log(cmainWallet.provider)

const cwallet0 = cmainWallet.deriveChild(0);
const cwallet1 = cmainWallet.deriveChild(1);
const cwallet2 = cmainWallet.deriveChild(2);
const cwallet3 = cmainWallet.deriveChild(3);

console.log('c', cmainWallet.path)
console.log('0', cwallet0.path)
console.log('1', cwallet1.path)
console.log('2', cwallet2.path)
console.log('3', cwallet3.path)