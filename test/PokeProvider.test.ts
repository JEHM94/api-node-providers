import { PokeProvider } from '../src/providers/PokeProvider';

describe('PokeProvider', () => {
    let pokeProvider: PokeProvider;

    beforeEach(() => {
        pokeProvider = new PokeProvider();
    });

    test('must authenticate successfully', async () => {
        const token = await pokeProvider.authenticate();
        // we check if token starts with "auth_token_"
        expect(token).toMatch(/^auth_token_/); 
    });

    test('must get user\'s balance successfully', async () => {
        const balance = await pokeProvider.getBalance('ditto');

        expect(balance).toHaveProperty('balance');
        expect(balance).toHaveProperty('currency', '$');
        expect(typeof balance.balance).toBe('number');
    });

    test('must throw an error if user does not exist', async () => {
        await expect(pokeProvider.getBalance('unknownUser')).rejects.toThrow();
    });

    test('must debit user\'s balance successfully', async () => {
        const result = await pokeProvider.debit('nidoking', 10);
        // Nidoking has a balance of 227 so console.log must show 217
        expect(result.success).toBe(true);
        expect(result.transactionId).toContain('debit');
    });

    test('debit must fail if amount is greater than user\'s balance', async () => {
        // Nidoking has a balance of 227
        await expect(pokeProvider.debit('nidoking', 300))
            .rejects.toThrow('Insufficient balance');
    });

    test('must credit user\'s balance successfully', async () => {
        const result = await pokeProvider.credit('rapidash', 10);
        // Rapidash has a balance of 175 so console.log must show 185
        expect(result.success).toBe(true);
        expect(result.transactionId).toContain('credit');
    });
});