export interface GameDto {
        id: number;
        title: string;
        description: string;
        developerId: string;
        releaseDate: Date | string;
        price: number;
        discount: number;
        systemRequirements: string;
        coverImage: string;
    }