import { SuiMoveNormalizedType } from "@mysten/sui.js";

import type { NetworkType as SuiNetworkType } from '../libs/suiRpcProvider/types';

export type { DerivePathParams } from '../libs/suiAccountManager/types';
export type {
  SuiTxArg,
  SuiVecTxArg,
  SuiObjectArg,
} from '../libs/suiTxBuilder/types';

export type NetworkType = SuiNetworkType;
export type SuiKitParams = {
  mnemonics?: string;
  secretKey?: string;
  fullnodeUrl?: string;
  faucetUrl?: string;
  networkType?: NetworkType;
  packageId?: string,
//   needLoad?: boolean;
};

export type SuiMoveMoudleValueType =  {
    address: string;
    name: string;
    fileFormatVersion: number;
    friends: {
        address: string;
        name: string;
    }[];
    structs: Record<string, {
        fields: {
            type: SuiMoveNormalizedType;
            name: string;
        }[];
        abilities: {
            abilities: string[];
        };
        typeParameters: {
            constraints: {
                abilities: string[];
            };
            isPhantom: boolean;
        }[];
    }>;
    exposedFunctions: Record<string, {
        visibility: "Private" | "Public" | "Friend";
        isEntry: boolean;
        typeParameters: {
            abilities: string[];
        }[];
        parameters: SuiMoveNormalizedType[];
        return: SuiMoveNormalizedType[];
    }>;
}