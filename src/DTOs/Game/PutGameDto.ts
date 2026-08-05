export type PutGameDto = {
        title: string;
        description: string;
        releaseDate: Date | string;
        price: number;
        discount: number;
        systemRequirements: string;
        coverImage: string;
    }