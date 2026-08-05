export type PatchGameDto = {
        title: string | null;
        description: string | null;
        releaseDate: Date | string;
        price: number | null;
        discount: number | null;
        systemRequirements: string | null;
        coverImage: string | null;
    }