import type { LibraryGameVersionDto } from "../../../DTOs/GameVersion/LibraryGameVersionDto";
import NewsCard from "./NewsCard";
import styles from "../../../css/libraryPage/home/WhatsNewSection.module.css";

interface WhatsNewSectionProps {
    versions: LibraryGameVersionDto[];
    libraryGameIds: number[];
    onSelectGame: (gameId: number) => void;
}

export default function WhatsNewSection({
    versions,
    libraryGameIds,
    onSelectGame,
}: WhatsNewSectionProps) {
    const ownedGameIds = new Set(libraryGameIds);

    const ownedVersions = versions.filter((version) =>
        ownedGameIds.has(version.gameId)
    );

    const latestVersions = ownedVersions.reduce<LibraryGameVersionDto[]>(
        (result, version) => {
            const existingVersion = result.find(
                (item) => item.gameId === version.gameId
            );

            if (!existingVersion) {
                result.push(version);
                return result;
            }

            const currentDate = new Date(version.createdAt);
            const existingDate = new Date(existingVersion.createdAt);

            if (currentDate > existingDate) {
                const index = result.indexOf(existingVersion);
                result[index] = version;
            }

            return result;
        },
        []
    );

    if (latestVersions.length === 0) {
        return null;
    }

    return (
        <section className={styles.section}>
            <h2>What's New</h2>
            <p className={styles.subtitle}>This week</p>

            <div className={styles.grid}>
                {latestVersions.map((version) => (
                    <NewsCard
                        key={version.gameId}
                        version={version}
                        onSelect={onSelectGame}
                    />
                ))}
            </div>
        </section>
    );
}