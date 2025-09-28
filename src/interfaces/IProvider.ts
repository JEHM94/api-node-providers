export interface IProvider {
  authenticate(): Promise<string>;
  getBalance(userId: string): Promise<{ balance: number; currency: string }>;
  debit(userId: string, amount: number): Promise<{ success: boolean; transactionId: string }>;
  credit(userId: string, amount: number): Promise<{ success: boolean; transactionId: string }>;
}