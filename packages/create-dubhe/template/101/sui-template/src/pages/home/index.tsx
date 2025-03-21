import { loadMetadata, Dubhe, Transaction, TransactionResult, DevInspectResults } from '@0xobelisk/sui-client';
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { Value } from '../../jotai';
import { useRouter } from 'next/router';
import { Counter_Object_Id, NETWORK, PACKAGE_ID } from '../../chain/config';
import { PRIVATEKEY } from '../../chain/key';

const Home = () => {
  const router = useRouter();
  const [value, setValue] = useAtom(Value);
  const [loading, setLoading] = useState(false);

  const query_counter_value = async () => {
    const metadata = await loadMetadata(NETWORK, PACKAGE_ID);
    const dubhe = new Dubhe({
      networkType: NETWORK,
      packageId: PACKAGE_ID,
      metadata: metadata,
    });
    const tx = new Transaction();
    console.log('counterObjectId:', Counter_Object_Id);
    const query_value = (await dubhe.query.counter_schema.get_value(tx, [
      tx.object(Counter_Object_Id),
    ])) as DevInspectResults;
    console.log(dubhe.view(query_value)[0]);
    setValue(dubhe.view(query_value)[0]);
  };

  const counter = async () => {
    setLoading(true);
    try {
      const metadata = await loadMetadata(NETWORK, PACKAGE_ID);
      const dubhe = new Dubhe({
        networkType: NETWORK,
        packageId: PACKAGE_ID,
        metadata: metadata,
        secretKey: PRIVATEKEY,
      });
      const tx = new Transaction();
      (await dubhe.tx.counter_system.inc(tx, [tx.object(Counter_Object_Id)], undefined, true)) as TransactionResult;
      const response = await dubhe.signAndSendTxn(tx);
      if (response.effects.status.status == 'success') {
        setTimeout(async () => {
          await query_counter_value();
          setLoading(false);
        }, 200);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    if (router.isReady) {
      query_counter_value();
    }
  }, [router.isReady]);
  return (
    <div className="max-w-7xl mx-auto text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8 flex-6">
      <div className="flex flex-col gap-6 mt-12">
        <div className="flex flex-col gap-4">
          You account already have some sui from testnet
          <div className="flex flex-col gap-6 text-2xl text-green-600 mt-6 ">Counter: {value}</div>
          <div className="flex flex-col gap-6">
            <button
              type="button"
              className="mx-auto px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              onClick={() => counter()}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Increment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
