import { IProvider } from '../interfaces/IProvider';
import { ApiResponse, BalanceResponse } from '../types';
import { randomUUID } from 'crypto';

export abstract class BaseProvider implements IProvider {
    protected token: string = '';
    protected abstract baseProviderUrl: string;
    private userName: string = '';
    private balance: number = 0;
    private currency: string = 'USD';

    async authenticate(): Promise<string> {
        // Mock authentication
        this.token = `auth_token_${randomUUID()}`;
        return this.token;
    }

    // Fetches user data from provider's API
    // For new Providers, we override this to set name, balance and currency as needed
    protected async fetchUserData(userId: string): Promise<any> {
        const response = await fetch(`${this.baseProviderUrl}/${userId.toLowerCase()}`);
        if (!response.ok) {
            throw new Error(`User not found: ${userId}`);
        }
        const user = await response.json();

        // We set data structure from PokeAPI(name & base_experience) by default
        this.userName = user.name;
        this.balance = user.base_experience;
        this.currency = '$';

        return user;
    }

    // Returns the available balance of an user
    async getBalance(userId: string): Promise<BalanceResponse> {
        try {
            const token = await this.authenticate();

            if (!token) {
                throw new Error('Unauthenticated request');
            }

            await this.fetchUserData(userId);

            return {
                userId,
                name: this.userName,
                balance: this.balance,
                currency: this.currency
            };
        } catch (e) {
            const error = e instanceof Error ? e.message : 'Unknown error';
            throw new Error(`Error trying to get balance: ${error}`);
        }
    }

    // Reduces an amount from the balance of an user
    async debit(userId: string, amount: number): Promise<ApiResponse> {
        try {

            const token = await this.authenticate();

            if (!token) {
                throw new Error('Unauthenticated request');
            }

            await this.fetchUserData(userId);

            if (this.balance < amount) {
                throw new Error('Insufficient balance');
            }

            // Mock debit operation
            const newBalance = this.balance - amount;
            console.log(`Amount debited successfully, new balance for user ${this.userName}: ${this.currency}${newBalance}`);

            const transactionId = `debit_${randomUUID()}`;

            return {
                success: true,
                transactionId
            };
        } catch (e) {
            const error = e instanceof Error ? e.message : 'Unknown error';
            throw new Error(`Error trying to debit: ${error}`);
        }
    }

    // Adds an amount to the balance of an user
    async credit(userId: string, amount: number): Promise<ApiResponse> {
        try {
            const token = await this.authenticate();

            if (!token) {
                throw new Error('Unauthenticated request');
            }

            await this.fetchUserData(userId);

            // Mock credit operation
            const newBalance = this.balance + amount;
            console.log(`Amount credited successfully, new balance for user ${this.userName}: ${this.currency}${newBalance}`);

            const transactionId = `credit_${randomUUID()}`;

            return {
                success: true,
                transactionId
            };
        } catch (e) {
            const error = e instanceof Error ? e.message : 'Unknown error';
            throw new Error(`Error trying to credit: ${error}`);
        }
    }
}
