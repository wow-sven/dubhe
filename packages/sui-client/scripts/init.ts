import {
  Obelisk,
  NetworkType,
  TransactionArgument,
  loadMetadata,
  Transaction,
  DevInspectResults,
} from '../src/index';
import * as process from 'process';
import dotenv from 'dotenv';
dotenv.config();

async function init() {
  const network = 'testnet';
  const packageId =
    '0x3b09247b204f17ef5cd240e6c5c9b2c03bb4907c6d2cb6e27597cdf97a00f004';

  const metadata = await loadMetadata(network as NetworkType, packageId);

  const privateKey = process.env.PRIVATE_KEY;

  const obelisk = new Obelisk({
    networkType: network as NetworkType,
    packageId: packageId,
    metadata: metadata,
    secretKey: privateKey,
  });

  console.log(obelisk.getAddress());
  // await obelisk.requestFaucet();
  let balance = await obelisk.getBalance();
  console.log('balance', balance);

  let tx = new Transaction();
  let params: TransactionArgument[] = [];
  let query1 = (await obelisk.query.funt.get_u8(
    tx,
    params
  )) as DevInspectResults;
  console.log(JSON.stringify(query1.results![0]));
  let formatData1 = obelisk.view(query1);
  console.log(formatData1);

  let tx2 = new Transaction();
  let params2: TransactionArgument[] = [];
  let query2 = (await obelisk.query.funt.get_u64(
    tx2,
    params2
  )) as DevInspectResults;
  console.log(JSON.stringify(query2.results![0]));
  let formatData2 = obelisk.view(query2);
  console.log(formatData2);

  let tx3 = new Transaction();
  let params3: TransactionArgument[] = [];
  let query3 = (await obelisk.query.funt.get_u128(
    tx3,
    params3
  )) as DevInspectResults;
  console.log(JSON.stringify(query3.results![0]));
  let formatData3 = obelisk.view(query3);
  console.log(formatData3);

  let tx4 = new Transaction();
  let params4: TransactionArgument[] = [];
  let query4 = (await obelisk.query.funt.get_u256(
    tx4,
    params4
  )) as DevInspectResults;
  console.log(JSON.stringify(query4.results![0]));
  let formatData4 = obelisk.view(query4);
  console.log(formatData4);

  let tx5 = new Transaction();
  let params5: TransactionArgument[] = [];
  let query5 = (await obelisk.query.funt.get_bool(
    tx5,
    params5
  )) as DevInspectResults;
  console.log(JSON.stringify(query5.results![0]));
  let formatData5 = obelisk.view(query5);
  console.log(formatData5);

  let tx6 = new Transaction();
  let params6: TransactionArgument[] = [];
  let query6 = (await obelisk.query.funt.get_address(
    tx6,
    params6
  )) as DevInspectResults;
  console.log(JSON.stringify(query6.results![0]));
  let formatData6 = obelisk.view(query6);
  console.log(formatData6);

  let tx7 = new Transaction();
  let params7: TransactionArgument[] = [];
  let query7 = (await obelisk.query.funt.get_vector_u8(
    tx7,
    params7
  )) as DevInspectResults;
  console.log(JSON.stringify(query7.results![0]));
  let formatData7 = obelisk.view(query7);
  console.log(formatData7);

  let tx8 = new Transaction();
  let params8: TransactionArgument[] = [];
  let query8 = (await obelisk.query.funt.get_tuple(
    tx8,
    params8
  )) as DevInspectResults;
  console.log(JSON.stringify(query8.results![0]));
  let formatData8 = obelisk.view(query8);
  console.log(formatData8);

  let tx9 = new Transaction();
  let params9: TransactionArgument[] = [];
  let query9 = (await obelisk.query.funt.get_string(
    tx9,
    params9
  )) as DevInspectResults;
  console.log(JSON.stringify(query9.results![0]));
  let formatData9 = obelisk.view(query9);
  console.log(formatData9);

  let tx10 = new Transaction();
  let params10: TransactionArgument[] = [];
  let query10 = (await obelisk.query.funt.get_option_type(
    tx10,
    params10
  )) as DevInspectResults;
  console.log(JSON.stringify(query10.results![0]));
  let formatData10 = obelisk.view(query10);
  console.log(formatData10);

  let tx11 = new Transaction();
  let params11: TransactionArgument[] = [];
  let query11 = (await obelisk.query.funt.get_struct(
    tx11,
    params11
  )) as DevInspectResults;
  let datares = obelisk.view(query11);
  console.log(datares);

  let tx12 = new Transaction();
  let params12: TransactionArgument[] = [];
  let formatData12 = obelisk.view(
    (await obelisk.query.funt.get_obj(tx12, params12)) as DevInspectResults
  );
  console.log(formatData12);
  // let txb = new TransactionBlock();

  // const [coin] = txb.splitCoins(txb.gas, [txb.pure(2n * MIST_PER_SUI)]);
  // const params = [coin];

  // let [coins] = (await obelisk.tx.example_system.get_object(
  //   txb,
  //   params,
  //   undefined,
  //   true
  // )) as TransactionResult;
  // txb.transferObjects(
  //   [coins],
  //   txb.pure(
  //     '0xd2c36eea220c7deb9d1c7d4b01269eca9d9543050255432896cd13ade6550d90'
  //   )
  // );
  // let res = await obelisk.signAndSendTxn(txb);
  // console.log(res);
  // let comsName = await obelisk.listSchemaNames(
  //   '0xacfec03b65c34a4afff82e0913e00759e5c799fbcbbd4bdf6299de4749766304'
  // );

  // console.log(comsName);

  // let entities = await obelisk.getEntities(
  //   '0x1541f3a2e7ac48e3e68e60bb97a7cee94e16316cc3f9043a9c0f5e6790ea3af0',
  //   'multi_column'
  // );
  // console.log(entities);

  // let entityData = await obelisk.getEntity(
  //   '0xdca3675091c8fdccd4fb46f9f70de0bd65053fbc8104600daf86a959ca9b7120',
  //   'single_value'
  // );
  // console.log(entityData);

  // // let tx = new TransactionBlock();

  // // let params = [
  // //   tx.pure(
  // //     '0xdca3675091c8fdccd4fb46f9f70de0bd65053fbc8104600daf86a959ca9b7120'
  // //   ),
  // // ];
  // // let inc_res = await obelisk.tx.example_system.increase(tx, params);
  // // console.log(inc_res);

  // let txb = new TransactionBlock();

  // let params = [
  //   txb.pure(
  //     '0xdca3675091c8fdccd4fb46f9f70de0bd65053fbc8104600daf86a959ca9b7120'
  //   ),
  //   txb.pure(
  //     '0x6761ca73d8793006a3d0ac74ed2ad541487d4010c706f7c6d0d41d96eff9e4cf'
  //   ),
  // ];

  // let typeArguments = ['0x2::coin::Coin<0x2::sui::SUI>'];
  // let inc_with_type_res = await obelisk.tx.example_system.increase_with_type(
  //   txb,
  //   params,
  //   typeArguments
  // );
  // console.log(inc_with_type_res);

  // let containData = await obelisk.containEntity(
  //   '0x9f2b0bd5153799eb97c8d604472f0993a10586ce6725cdeb175b02dedc2dd10a',
  //   'position',
  //   '0x59a5fbf2c56da3a4a2ac761f062cb0e8ed6c6cb1812136178cf2321586736cc7'
  // );

  // console.log(containData);

  // let objectAddress = await obelisk.entity_key_from_object(
  //   '0x1541f3a2e7ac48e3e68e60bb97a7cee94e16316cc3f9043a9c0f5e6790ea3af0'
  // );
  // console.log(objectAddress);

  // let bytesAddress = await obelisk.entity_key_from_bytes('hello');
  // console.log(bytesAddress);

  // let numberAddress = await obelisk.entity_key_from_u256(123);
  // console.log(numberAddress);
}

init();
