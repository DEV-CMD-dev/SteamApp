export type GameDto = {
        id: number;
        title: string;
        description: string;
        developerId: string;
        releaseDate: Date | string;
        price: number;
        discount: number;
        systemRequirements: string;
        coverImageHorizontal: string;
        coverImageVertical: string;
        tagIds: []
    }