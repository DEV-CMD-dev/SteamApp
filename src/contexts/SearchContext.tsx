import { createContext, useState } from "react";

const initialState = {
    TagIds: [] as number[],
    setTagIds: (val: any) => { },

    IsWindows: false,
    setIsWindows: (val: boolean) => { },

    IsMacOS: false,
    setIsMacOS: (val: boolean) => { },

    IsDiscounted: false,
    setIsDiscounted: (val: boolean) => { },

    HideFreeToPlay: false,
    setHideFreeToPlay: (val: boolean) => { },

    MaxPrice: null as number | null,
    setMaxPrice: (val: number | null) => { }
};

export const SearchContext = createContext(initialState);

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
    const [TagIds, setTagIds] = useState(initialState.TagIds);
    const [IsWindows, setIsWindows] = useState(initialState.IsWindows);
    const [IsMacOS, setIsMacOS] = useState(initialState.IsMacOS);
    const [IsDiscounted, setIsDiscounted] = useState(initialState.IsDiscounted);
    const [HideFreeToPlay, setHideFreeToPlay] = useState(initialState.HideFreeToPlay);
    const [MaxPrice, setMaxPrice] = useState(initialState.MaxPrice);

    return (
        <SearchContext.Provider value={{
            TagIds,setTagIds,
            IsWindows, setIsWindows,
            IsMacOS, setIsMacOS,
            IsDiscounted, setIsDiscounted,
            HideFreeToPlay, setHideFreeToPlay,
            MaxPrice, setMaxPrice
        }}>
            {children}
        </SearchContext.Provider>
    );
}