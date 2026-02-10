import styled from "styled-components";
import { useState, useMemo } from "react";
import GameThumbnail from "./GameThumbnail";
import { useContent } from "./hooks/useContent";
import { EditableText } from "./components/editable";
import { PageHeader } from "./styles/constants";

const Container = styled.nav`
  max-width: 1011px;
  margin: auto;
  display: flex;
  flex-direction: column;
  padding: 0 20px;

  @media (max-width: 768px) {
    p {
      text-align: center;
    }
  }
`;

const GamesGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, 230px);
  gap: 30px;
  justify-content: center;
  margin-bottom: 20px;
`;

const SectionHeader = styled.h2`
  margin: 0;
  font-size: 36px;

  @media (max-width: 768px) {
    font-size: 30px;
  }
`;


const SectionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const FilterControls = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const FilterButton = styled.button`
  background-color: rgb(240, 91, 47);
  border: none;
  color: white;
  height: 32px;
  padding: 0 14px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 16px;
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }

  @media (max-width: 768px) {
    padding: 0 10px;
    font-size: 11px;
    height: 28px;
  }
`;

const GamesPage = () => {
  const { content, games, loading } = useContent();
  const [showAvailable, setShowAvailable] = useState(false);
  const [sortedByYear, setSortedByYear] = useState<'asc' | 'desc' | null>('desc');
  const [sortedAlphabetically, setSortedAlphabetically] = useState<'asc' | 'desc' | null>(null);
  const [installationSortAlpha, setInstallationSortAlpha] = useState<'asc' | 'desc' | null>(null);
  const [installationSortYear, setInstallationSortYear] = useState<'asc' | 'desc' | null>('desc');
  const [showInstallationAvailable, setShowInstallationAvailable] = useState(false);

  // Convert games object to array with keys, filtering out inactive games
  const arcadeGamesArray = useMemo(() => {
    return Object.entries(games.arcadeCabinets)
      .filter(([, game]) => game.active !== false)
      .map(([key, game]) => ({
        ...game,
        key,
      }));
  }, [games.arcadeCabinets]);

  const installationGamesArray = useMemo(() => {
    return Object.entries(games.installationGames)
      .filter(([, game]) => game.active !== false)
      .map(([key, game]) => ({
        ...game,
        key,
      }));
  }, [games.installationGames]);

  // Apply sorting and filtering to installation games
  const filteredAndSortedInstallationGames = useMemo(() => {
    let result = [...installationGamesArray];

    // Filter by availability
    if (showInstallationAvailable) {
      result = result.filter((game) => game.available);
    }

    // Sort by year
    if (installationSortYear) {
      result.sort((a, b) =>
        installationSortYear === 'asc' ? a.year - b.year : b.year - a.year
      );
    }

    // Sort alphabetically
    if (installationSortAlpha) {
      result.sort((a, b) =>
        installationSortAlpha === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      );
    }

    return result;
  }, [installationGamesArray, showInstallationAvailable, installationSortYear, installationSortAlpha]);

  // Apply sorting and filtering
  const filteredAndSortedGames = useMemo(() => {
    let result = [...arcadeGamesArray];

    // Filter by availability
    if (showAvailable) {
      result = result.filter((game) => game.available);
    }

    // Sort by year
    if (sortedByYear) {
      result.sort((a, b) =>
        sortedByYear === 'asc' ? a.year - b.year : b.year - a.year
      );
    }

    // Sort alphabetically
    if (sortedAlphabetically) {
      result.sort((a, b) =>
        sortedAlphabetically === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      );
    }

    return result;
  }, [arcadeGamesArray, showAvailable, sortedByYear, sortedAlphabetically]);

  const toggleYearSort = () => {
    setSortedAlphabetically(null);
    setSortedByYear((prev) => {
      if (prev === null) return 'asc';
      if (prev === 'asc') return 'desc';
      return null;
    });
  };

  const toggleAlphaSort = () => {
    setSortedByYear(null);
    setSortedAlphabetically((prev) => {
      if (prev === null) return 'asc';
      if (prev === 'asc') return 'desc';
      return null;
    });
  };

  const toggleFilter = () => {
    setShowAvailable((prev) => !prev);
  };

  const toggleInstallationAlphaSort = () => {
    setInstallationSortYear(null);
    setInstallationSortAlpha((prev) => {
      if (prev === null) return 'asc';
      if (prev === 'asc') return 'desc';
      return null;
    });
  };

  const toggleInstallationYearSort = () => {
    setInstallationSortAlpha(null);
    setInstallationSortYear((prev) => {
      if (prev === null) return 'asc';
      if (prev === 'asc') return 'desc';
      return null;
    });
  };

  const toggleInstallationFilter = () => {
    setShowInstallationAvailable((prev) => !prev);
  };

  return (
    <Container className={`content-fade ${!loading ? 'loaded' : ''}`}>
        <EditableText
          value={content.games.pageHeading}
          contentPath="content/games/pageHeading"
          as={PageHeader}
        />
        <EditableText
          value={content.games.pageIntro}
          contentPath="content/games/pageIntro"
          as="p"
          multiline
        />
        <SectionWrapper>
          <EditableText
            value={content.games.sectionHeaders.arcadeCabinets}
            contentPath="content/games/sectionHeaders/arcadeCabinets"
            as={SectionHeader}
          />
          <FilterControls>
            <FilterButton onClick={toggleYearSort}>
              Sort by Date {sortedByYear === 'asc' ? '↑' : sortedByYear === 'desc' ? '↓' : ''}
            </FilterButton>
            <FilterButton onClick={toggleAlphaSort}>
              Sort A-Z {sortedAlphabetically === 'asc' ? '↑' : sortedAlphabetically === 'desc' ? '↓' : ''}
            </FilterButton>
            <FilterButton onClick={toggleFilter}>
              {showAvailable ? 'Show All' : 'Show Publicly Available'}
            </FilterButton>
          </FilterControls>
        </SectionWrapper>
        <GamesGrid key={`arcade-${showAvailable}-${sortedByYear}-${sortedAlphabetically}`}>
          {filteredAndSortedGames.map((game, index) => (
            <GameThumbnail
              key={game.key}
              id={game.id}
              name={game.name}
              year={game.year}
              imageUrl={game.imageUrl}
              animationIndex={index}
            />
          ))}
        </GamesGrid>
        <SectionWrapper>
          <EditableText
            value={content.games.sectionHeaders.installationGames}
            contentPath="content/games/sectionHeaders/installationGames"
            as={SectionHeader}
          />
          <FilterControls>
            <FilterButton onClick={toggleInstallationYearSort}>
              Sort by Date {installationSortYear === 'asc' ? '↑' : installationSortYear === 'desc' ? '↓' : ''}
            </FilterButton>
            <FilterButton onClick={toggleInstallationAlphaSort}>
              Sort A-Z {installationSortAlpha === 'asc' ? '↑' : installationSortAlpha === 'desc' ? '↓' : ''}
            </FilterButton>
            <FilterButton onClick={toggleInstallationFilter}>
              {showInstallationAvailable ? 'Show All' : 'Available Only'}
            </FilterButton>
          </FilterControls>
        </SectionWrapper>
        <GamesGrid key={`install-${showInstallationAvailable}-${installationSortYear}-${installationSortAlpha}`}>
          {filteredAndSortedInstallationGames.map((game, index) => (
            <GameThumbnail
              key={game.key}
              id={game.id}
              name={game.name}
              year={game.year}
              imageUrl={game.imageUrl}
              isInstallation
              animationIndex={index}
            />
          ))}
        </GamesGrid>
    </Container>
  );
};

export default GamesPage;
