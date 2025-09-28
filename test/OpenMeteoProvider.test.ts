import { OpenMeteoProvider } from '../src/providers/OpenMeteoProvider';

describe('OpenMeteoProvider', () => {
    let openMeteoProvider: OpenMeteoProvider;

    beforeEach(() => {
        openMeteoProvider = new OpenMeteoProvider();
    });

    test('must authenticate successfully', async () => {
        const token = await openMeteoProvider.authenticate();
        // we check if token starts with "auth_token_"
        expect(token).toMatch(/^auth_token_/); 
    });

    test('must get user\'s balance successfully', async () => {
        const balance = await openMeteoProvider.getBalance('madrid');

        expect(balance).toHaveProperty('balance');
        expect(balance).toHaveProperty('currency', '€');
        expect(typeof balance.balance).toBe('number');
    });

    test('must throw an error if user does not exist', async () => {
        await expect(openMeteoProvider.getBalance('25')).rejects.toThrow();
    });

    test('must debit user\'s balance successfully', async () => {
        const result = await openMeteoProvider.debit('roma', 20);
        // Roma has a balance of 128 so console.log must show 108
        expect(result.success).toBe(true);
        expect(result.transactionId).toContain('debit');
    });

    test('debit must fail if amount is greater than user\'s balance', async () => {
        // Roma has a balance of 128
        await expect(openMeteoProvider.debit('roma', 130))
            .rejects.toThrow('Insufficient balance');
    });

    test('must credit user\'s balance successfully', async () => {
        const result = await openMeteoProvider.credit('caracas', 12);
        // Caracas has a balance of 887 so console.log must show 899
        expect(result.success).toBe(true);
        expect(result.transactionId).toContain('credit');
    });
});