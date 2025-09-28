import express, { Request, Response } from 'express';
import { PokeProvider } from './providers/PokeProvider';
import { OpenMeteoProvider } from './providers/OpenMeteoProvider';
import { ApiResponse, BalanceResponse, TransactionRequest } from './types';

const app = express();
app.use(express.json());

// Providers config
// We add new providers here
const providers: { [key: string]: any } = {
    poke: new PokeProvider(),
    openmeteo: new OpenMeteoProvider()
};

// Checks if its a valid provider
const validateProvider = (request: Request, response: Response, next: Function) => {
    const provider = request.query.provider as string || '';

    if (!providers[provider]) {
        return response.status(400).json({
            success: false,
            message: `Invalid provider: ${provider} | Available options: ${Object.keys(providers).join(', ')}`
        });
    }

    (request as any).provider = providers[provider];
    next();
};

// Retrieves user balance
app.post('/balance/:userId', validateProvider, async (request: Request, response: Response) => {
    try {
        const { userId } = request.params;
        const provider = (request as any).provider;

        const balanceData = await provider.getBalance(userId) as BalanceResponse;

        response.json({
            success: true,
            data: balanceData
        });
    } catch (error) {
        response.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Debits user balance
app.post('/debit/:userId', validateProvider, async (request: Request, response: Response) => {
    try {
        const { userId } = request.params;
        const { amount } = request.body as TransactionRequest;
        const provider = (request as any).provider;

        if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
            return response.status(400).json({
                success: false,
                message: 'amount must be a valid positive number'
            });
        }

        const apiResponse = await provider.debit(userId, amount) as ApiResponse;

        response.json(apiResponse);
    } catch (error) {
        response.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Credits user balance
app.post('/credit/:userId', validateProvider, async (request: Request, response: Response) => {
    try {
        const { userId } = request.params;
        const { amount } = request.body as TransactionRequest;
        const provider = (request as any).provider;

        if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
            return response.status(400).json({
                success: false,
                message: 'amount must be a valid positive number'

            });
        }

        const apiResponse = await provider.credit(userId, amount) as ApiResponse;

        response.json(apiResponse);
    } catch (error) {
        response.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export default app;