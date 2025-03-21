import fs from 'fs';
import { execSync } from 'child_process';
import chalk from 'chalk';
import { Seq } from 'aptos/src/bcs';
import {
	getDefaultURL,
	InputNetworkType,
	AptosAccount,
	TxnBuilderTypes,
	HexString,
	AptosClient,
	Network,
	Types,
} from '@0xobelisk/aptos-client';

import { DubheCliError } from './errors';
import { saveContractData, validatePrivateKey } from './utils';

const {
	AccountAddress,
	EntryFunction,
	MultiSig,
	MultiSigTransactionPayload,
	TransactionPayloadMultisig,
} = TxnBuilderTypes;

type Module = TxnBuilderTypes.Module;
// type Seq = TxnBuilderTypes.Seq;

// type publishRes = {
//   projectName: string,
//   transactionHash: string,
//   packageId: string,
//   worldId: string
// }

export async function publishHandler(
	projectName: string,
	network: InputNetworkType
) {
	const privateKey = process.env.PRIVATE_KEY;
	if (!privateKey)
		throw new DubheCliError(
			`Missing PRIVATE_KEY environment variable.
  Run 'echo "PRIVATE_KEY=YOUR_PRIVATE_KEY" > .env'
  in your contracts directory to use the default aptos private key.`
		);

	const privateKeyFormat = validatePrivateKey(privateKey);
	if (privateKeyFormat === false) {
		throw new DubheCliError(`Please check your privateKey.`);
	}

	const keypair = AptosAccount.fromAptosAccountObject({
		privateKeyHex: privateKeyFormat.toString(),
	});

	const client = new AptosClient(getDefaultURL(network as Network).fullNode);

	const path = process.cwd();
	let modulesInfo: string[];
	try {
		const { Result: compileResult } = JSON.parse(
			execSync(
				`aptos move compile --save-metadata --package-dir ${path}/contracts/${projectName} --named-addresses ${projectName}=${keypair
					.address()
					.toString()}`,
				{
					encoding: 'utf-8',
				}
			)
		);
		modulesInfo = compileResult;
	} catch (error: any) {
		console.error(chalk.red('Error executing aptos move compile:'));
		console.error(error.stdout);
		process.exit(1); // You might want to exit with a non-zero status code to indicate an error
	}

	let packageId = '';
	let version = 0;

	try {
		const packageMetadata = fs.readFileSync(
			`${path}/contracts/${projectName}/build/${projectName}/package-metadata.bcs`
		);

		let modulesData: Module[] = [];
		modulesInfo.forEach(value => {
			const moduleName = value.split('::')[1];
			const moduleData = fs.readFileSync(
				`${path}/contracts/${projectName}/build/${projectName}/bytecode_modules/${moduleName}.mv`
			);

			modulesData.push(
				new TxnBuilderTypes.Module(
					new HexString(moduleData.toString('hex')).toUint8Array()
				)
			);
		});

		let txnHash = await client.publishPackage(
			keypair,
			new HexString(packageMetadata.toString('hex')).toUint8Array(),
			modulesData as Seq<Module>
		);
		await client.waitForTransaction(txnHash, { checkSuccess: true }); // <:!:publish

		packageId = keypair.address().toString();
		version = 1;

		console.log(chalk.blue(`${projectName} PackageId: ${packageId}`));
		saveContractData(projectName, network, packageId, version);
		console.log(chalk.green(`Publish Transaction Digest: ${txnHash}`));
	} catch (error: any) {
		console.error(chalk.red(`Failed to execute publish, please republish`));
		console.error(error.message);
		process.exit(1);
	}

	console.log('Executing the deployHook: ');
	const delay = (ms: number) =>
		new Promise(resolve => setTimeout(resolve, ms));
	await delay(5000);

	const payload: Types.EntryFunctionPayload = {
		function: `${packageId}::deploy_hook::run`,
		type_arguments: [],
		arguments: [],
	};

	const deployHookRawTxn = await client.generateTransaction(
		keypair.address(),
		payload
	);
	const deployHookBcsTxn = AptosClient.generateBCSTransaction(
		keypair,
		deployHookRawTxn
	);
	try {
		const deployTxnHash = await client.submitSignedBCSTransaction(
			deployHookBcsTxn
		);
		console.log(
			chalk.green(
				`Successful auto-execution of deployHook, please check the transaction digest: ${deployTxnHash.hash}`
			)
		);
	} catch (error: any) {
		console.error(
			chalk.red(
				`Failed to execute deployHook, please republish or manually call deploy_hook::run`
			)
		);
		console.error(error.message);
		process.exit(1);
	}
}
