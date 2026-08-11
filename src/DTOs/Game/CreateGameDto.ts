export type CreateGameDto = {
        title: string;
        description: string;
        releaseDate: Date | string;
        price: number;
        systemRequirements: string;
        coverImageHorizontal: string;
        coverImageVertical: string;
    }