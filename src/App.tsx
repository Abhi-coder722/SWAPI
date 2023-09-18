import React, {useEffect, useState} from 'react';
import { ApolloProvider, useQuery } from '@apollo/react-hooks';
import {ApolloClient, InMemoryCache} from "@apollo/client";
import {BrowserRouter as Router, Route, Routes, useNavigate} from 'react-router-dom';
import {DataGrid, GridCellParams, GridColDef} from "@mui/x-data-grid";
import CharacterDetailPage from "./files/CharacterDetails";
import {ICharacter, GET_CHARACTERS} from "./files/helper";
export const CharactersTable: React.FC = () => {
const navigate = useNavigate();
const { data, loading } = useQuery(GET_CHARACTERS, {
    variables: { first: 1000, after: null }, // Fetch first 100 characters instead of 10
});
const [favoritesOnly, setFavoritesOnly] = useState<boolean>(false);
    const [characters, setCharacters] = useState<ICharacter[]>([]);
  const [genderFilter, setGenderFilter] = useState("");
  const [eyeColorFilter, setEyeColorFilter] = useState<string[]>([]);
  const [speciesFilter, setSpeciesFilter] = useState<string[]>([]);

const filteredCharacters = characters.filter((char) => {
    let eyeColorMatch = eyeColorFilter.length === 0 || eyeColorFilter.includes(char.eye_color);
    let speciesMatch = speciesFilter.length === 0 || (char.species && speciesFilter.includes(char.species.name));
    let genderMatch = !genderFilter || genderFilter === char.gender;
    let favoritesMatch = !favoritesOnly || char.favorite;
    return genderMatch && eyeColorMatch && speciesMatch && favoritesMatch;
},[characters, genderFilter, eyeColorFilter, speciesFilter]);
    useEffect(() => {
        if (!loading && data) {
const charactersData = data.allPeople.edges.map(({ node }: any) => ({
    name: node.name || "-",
    height: node.height || "-",
    mass: node.mass || "-",
    homeworld: node.homeworld && node.homeworld.name && node.homeworld.name !== 'unknown' ? node.homeworld.name : "-",

    species: node.species ? { name: node.species.name } : null,
    gender: node.gender && node.gender !== 'unknown' && node.gender !== 'n/a' ? node.gender : "-",
    eye_color: node.eyeColor || "-",
    favorite: !!localStorage.getItem(node.name),
}));
          setCharacters(charactersData);
        }
    }, [data, loading]);

    if (loading) return <p>Loading...</p>;
const toggleFavorite = (characterName: string) => {
    const updatedCharacters = characters.map(character => {
      if (character.name === characterName) {
        character.favorite = !character.favorite;
        if (character.favorite) {
          localStorage.setItem(characterName, 'true');
        } else {
          localStorage.removeItem(characterName);
        }
      }
      return character;
    });

    setCharacters(updatedCharacters);
  };
const handleCheckboxFilter = (e: React.ChangeEvent<HTMLInputElement>, setFilterState: React.Dispatch<React.SetStateAction<string[]>>) => {
  if(e.target.checked) {
    setFilterState(prevState => [...prevState, e.target.value]);
  } else {
    setFilterState(prevState => prevState.filter(item => item !== e.target.value));
  }
};
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Name', width: 130 },
    { field: 'height', headerName: 'Height', type: 'number', width: 110 },
    { field: 'homeworld', headerName: 'Home Planet', width: 150 },
    { field: 'species', headerName: 'Species name',  width: 160 },
    { field: 'gender', headerName: 'Gender', width: 130 },
    { field: 'eye_color', headerName: 'Eye color', width: 130 },
    {
    field: 'favorite',
    headerName: 'Favorite',
    width: 130,
    renderCell: (params: GridCellParams) => (
      <button
        onClick={() => toggleFavorite(params.row.name)}
      >
        {params.value ? '💖' : '♡'}
      </button>
    ),
  },
  ];
const rows = filteredCharacters.map((char, i) => ({
    id: i + 1,
    name: char.name,
    height: char.height,
    mass: char.mass,
    homeworld: char.homeworld,
    species: char.species ? char.species.name : '-',
    gender: char.gender,
    eye_color: char.eye_color,
    favorite: char.favorite,
  }));
    return (
        <div><div><div>
    <label>
        <input type="checkbox" checked={favoritesOnly} onChange={e => setFavoritesOnly(e.target.checked)} />
        Favorites only
    </label>
</div>

          <label>Filter by Gender: </label>
          <select value={genderFilter} onChange={e => { setGenderFilter(e.currentTarget.value) }}>
              <option value="">All</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
          </select>
      </div>
      <div>
          <label>Filter by Eye Color: </label>
          <input type="checkbox" value="blue" checked={eyeColorFilter.includes("blue")} onChange={e => { handleCheckboxFilter(e, setEyeColorFilter) }} /> Blue
          <input type="checkbox" value="brown" checked={eyeColorFilter.includes("brown")} onChange={e => handleCheckboxFilter(e, setEyeColorFilter)}/> Brown
          <input type="checkbox" value="yellow" checked={eyeColorFilter.includes("yellow")} onChange={e => handleCheckboxFilter(e, setEyeColorFilter)}/> Yellow
          <input type="checkbox" value="red" checked={eyeColorFilter.includes("red")} onChange={e => handleCheckboxFilter(e, setEyeColorFilter)}/> Red
          <input type="checkbox" value="orange" checked={eyeColorFilter.includes("orange")} onChange={e => handleCheckboxFilter(e, setEyeColorFilter)}/> Orange
          <input type="checkbox" value="black" checked={eyeColorFilter.includes("black")} onChange={e => handleCheckboxFilter(e, setEyeColorFilter)}/> Black
      </div>
      <div>
          <label>Filter by Species: </label>
          <input type="checkbox" value="Human" checked={speciesFilter.includes("Human")} onChange={e => handleCheckboxFilter(e, setSpeciesFilter)} /> Human
          <input type="checkbox" value="Mirialan" checked={speciesFilter.includes("Mirialan")} onChange={e => handleCheckboxFilter(e, setSpeciesFilter)} /> Mirialan
          <input type="checkbox" value="Droid" checked={speciesFilter.includes("Droid")} onChange={e => handleCheckboxFilter(e, setSpeciesFilter)} /> Droid
          <input type="checkbox" value="Gungan" checked={speciesFilter.includes("Gungan")} onChange={e => handleCheckboxFilter(e, setSpeciesFilter)} /> Gungan
          <input type="checkbox" value="Kaminoan" checked={speciesFilter.includes("Kaminoan")} onChange={e => handleCheckboxFilter(e, setSpeciesFilter)} /> Kaminoan
          <input type="checkbox" value="Twi'lek" checked={speciesFilter.includes("Twi'lek")} onChange={e => handleCheckboxFilter(e, setSpeciesFilter)} /> Twi'lek
          <input type="checkbox" value="Zabrak" checked={speciesFilter.includes("Zabrak")} onChange={e => handleCheckboxFilter(e, setSpeciesFilter)} /> Zabrak
      </div>



    <div style={{ height: 600, width: '100%' }}>
<DataGrid
  rows={rows}
  columns={columns}
  onCellClick={(params) => {
    if (params.field === 'name') {
      navigate(`/character/${params.row.id}`);
    }
  }}
  initialState={{
    pagination: {
      paginationModel: { page: 0, pageSize: 10 },
    },
  }}
  pageSizeOptions={[5, 10]}
/>


    </div>
</div>
    );
};

const client = new ApolloClient({
  uri: 'https://swapi-graphql.netlify.app/.netlify/functions/index',
  cache: new InMemoryCache()
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route path="/character/:id" element={<CharacterDetailPage />} />
          <Route path="/" element={
            <div>
              <h2>Star Wars Characters 🚀</h2>
              <CharactersTable />
            </div>
          } />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}


export default App;
