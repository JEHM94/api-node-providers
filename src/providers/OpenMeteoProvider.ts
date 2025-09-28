import { BaseProvider } from './BaseProvider';

export class OpenMeteoProvider extends BaseProvider {
    protected baseProviderUrl: string = 'https://geocoding-api.open-meteo.com/v1/search';

    // Override to set balance from elevation
    protected async fetchUserData(userId: string): Promise<any> {
        const response = await fetch(`${this.baseProviderUrl}?name=${userId.toLowerCase()}&count=1`);

        if (!response.ok) {
            throw new Error(`User not found: ${userId}`);
        }
        
        const { results } = await response.json();

        // We add this validation to match provider's response structure
        if (!results || results.length === 0) {
            throw new Error(`User not found: ${userId}`);
        }

        this["userName"] = results[0].name;
        this["balance"] = results[0].elevation;
        this["currency"] = '€';
        
        return results;
    }
}