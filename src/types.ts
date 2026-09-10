export interface CryptoAsset {
  id: string;
  name: string;
  symbol: string;
  network: string;
  currentPriceUsd: number;
  iconBg: string;
  iconColor: string;
  defaultAmount: string;
  minAmount: number;
  placeholderAddress: string;
  addressHint: string;
  badge?: string;
}

export interface OrderState {
  crypto: CryptoAsset;
  amount: string;
  destinationAddress: string;
  feeAmount: number;
  feeCrypto: string;
  feeAddress: string;
  network: string;
  createdAt?: string;
  orderId?: string;
}
