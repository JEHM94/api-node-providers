export interface ApiResponse {
  success: boolean;
  transactionId: string;
  message?: string;
}

export interface BalanceResponse {
  userId: string;
  name: string;
  balance: number;
  currency: string;
}

export interface TransactionRequest {
  amount: number;
}