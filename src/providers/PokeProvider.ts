import { BaseProvider } from './BaseProvider';

export class PokeProvider extends BaseProvider {
    protected baseProviderUrl: string = 'https://pokeapi.co/api/v2/pokemon';

    // Override to set balance from base_experience
    protected async fetchUserData(userId: string): Promise<any> {
        const response = await fetch(`${this.baseProviderUrl}/${userId.toLowerCase()}`);
        
        if (!response.ok) {
            throw new Error(`User not found: ${userId}`);
        }

        const user = await response.json();

        this["userName"] = user.name;
        this["balance"] = user.base_experience;
        this["currency"] = '$';

        return user;
    }
}