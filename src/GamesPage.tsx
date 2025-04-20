import styled from "styled-components";
import { useState } from "react";
import Navbar from "./Navbar";
import GameThumbnail from "./GameThumbnail";

// Fake data for now

const itemsData = [
  { id: 1, available: false, name: "HOVERBURGER", year: 2023 },
  { id: 2, available: false, name: "DYEBREAKER", year: 2024 },
  { id: 3, available: true, name: "PARTICLE MACE", year: 2014 },
  {
    id: 4,
    available: false,
    name: "NOTHING GOOD CAN COME OF THIS",
    year: 2015,
  },
  { id: 5, available: false, name: "HOVERBURGER", year: 2023 },
  { id: 6, available: false, name: "DYEBREAKER", year: 2024 },
  { id: 7, available: false, name: "PARTICLE MACE", year: 2014 },
  { id: 8, available: true, name: "NOTHING GOOD CAN COME OF THIS", year: 2015 },
  { id: 9, available: false, name: "HOVERBURGER", year: 2023 },
  { id: 10, available: true, name: "DYEBREAKER", year: 2024 },
  { id: 11, available: false, name: "PARTICLE MACE", year: 2014 },
  {
    id: 12,
    available: true,
    name: "NOTHING GOOD CAN COME OF THIS",
    year: 2015,
  },
];

const Container = styled.nav`
  width: 1010px;
  margin: auto;
  display: flex;
  flex-direction: column;

  p {
    font-size: 18px;
  }
`;

const GamesGrid = styled.div`
  width: 1010px;
  display: flex;
  gap: 30px 30px;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin-bottom: 20px;
`;

const SectionHeader = styled.h2`
  margin-bottom: 30px;
  font-size: 36px;
`;

const MainHeader = styled.h1`
  font-weight: bold;
  font-size: 46px;
  margin-bottom: 5px;
`;

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
`;

const FilterButton = styled.button`
  background-color: rgb(240, 91, 47);
  box-shadow: 0px solid black;
  border: 0px solid white;
  color: white;
  height: 45px;
  font-weight: bold;
  margin-top: 5px;
  cursor: pointer;
  margin-left: 20px;
  &:hover {
    opacity: 0.7;
  }
`;

const GamesPage = () => {
  const [items, setItems] = useState(itemsData);
  const [showAvailable, setShowAvailable] = useState(false);
  const [sortedByYear, setSortedByYear] = useState(false);
  const [sortedAlphabetically, setSortedAlphabetically] = useState(false);
  const sortItemsByYear = (sortedByYear: boolean) => {
    if (!sortedByYear) {
      var sortedItems = [...items].sort((a, b) => a.year - b.year);
    } else {
      var sortedItems = [...items].sort((a, b) => b.year - a.year);
    }
    setSortedByYear(!sortedByYear);
    setItems(sortedItems);
  };

  const sortItemsAlphabetically = (sortedAlphabetically: boolean) => {
    if (!sortedAlphabetically) {
      var sortedItems = [...items].sort((a, b) => a.name.localeCompare(b.name));
    } else {
      var sortedItems = [...items].sort((a, b) => b.name.localeCompare(a.name));
    }
    setSortedAlphabetically(!sortedAlphabetically);
    setItems(sortedItems);
  };

  const toggleFilter = () => {
    setShowAvailable((prevShowAvailable) => !prevShowAvailable);
  };

  const filteredItems = showAvailable
    ? items.filter((item) => item.available)
    : items;

  return (
    <>
      <Navbar />
      <Container>
        <MainHeader>GAMES / PROJECTS</MainHeader>
        <p>
          Here is a selection of arcade games and other projects we've helped
          creators realize over the years. Click View Publicly Available to see
          games you can go check out right now!
        </p>
        <FilterBar>
          <SectionHeader>Arcade Cabinets</SectionHeader>
          <FilterButton onClick={() => sortItemsByYear(sortedByYear)}>
            Sort by Date
          </FilterButton>
          <FilterButton
            onClick={() => sortItemsAlphabetically(sortedAlphabetically)}
          >
            Sort by Alphabetically
          </FilterButton>
          <FilterButton onClick={toggleFilter}>
            Show Publicly Available
          </FilterButton>
        </FilterBar>
        <GamesGrid>
          {filteredItems.map((item) => (
            <GameThumbnail key={item.id} name={item.name} />
          ))}
        </GamesGrid>
        <SectionHeader>Installation Games / Alt Control Games</SectionHeader>
        <GamesGrid>
          <GameThumbnail name="Salmon Roll" />
          <GameThumbnail name="Circumnavigators" />
          <GameThumbnail name="Drink Rink" />
          <GameThumbnail name="Salmon Roll" />
          <GameThumbnail name="Salmon Roll" />
          <GameThumbnail name="Salmon Roll" />
          <GameThumbnail name="Salmon Roll" />
          <GameThumbnail name="Salmon Roll" />
          <GameThumbnail name="Salmon Roll" />
          <GameThumbnail name="Salmon Roll" />
        </GamesGrid>
      </Container>
    </>
  );
};

export default GamesPage;
