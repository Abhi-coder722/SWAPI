import React, {useEffect, useState} from 'react';
import { ApolloProvider, useQuery } from '@apollo/react-hooks';
import {ApolloClient, InMemoryCache} from "@apollo/client";
import {BrowserRouter as Router, Route, Routes, useNavigate} from 'react-router-dom';
import {DataGrid, GridCellParams, GridColDef} from "@mui/x-data-grid";
import CharacterDetailPage from "./files/CharacterDetails";
import {ICharacter, GET_CHARACTERS, client} from "./files/helper";
import Header from "./files/Header";
import {Checkbox, Chip, FormControl, FormControlLabel, FormLabel, Grid, MenuItem, Select } from '@mui/material';
export const CharactersTable: React.FC = () => {
const navigate = useNavigate();
const { data, loading } = useQuery(GET_CHARACTERS, {
    variables: { first: 1000, after: null }, // Fetch first 100 characters instead of 10
});
    const [characters, setCharacters] = useState<ICharacter[]>([]);

const [favoritesOnly, setFavoritesOnly] = useState<boolean>(false);
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
        const charactersData = data.allPeople.edges.map(({ node }: any, index:any) => ({
            id: index + 1, // Assign initial ID
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
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Character ID', width: 100 },
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
     id: char.id,
    name: char.name,
    height: char.height,
    mass: char.mass,
    homeworld: char.homeworld,
    species: char.species ? char.species.name : '-',
    gender: char.gender,
    eye_color: char.eye_color,
    favorite: char.favorite,
  }));
    return (<Grid sx={{paddingLeft:'35px',paddingRight:'35px', marginTop:'15px'}} gap={10}>
        <div>
<Grid container direction="row" justifyContent="space-between" alignItems="center">
    <Grid item>
        <Grid container alignItems="center" spacing={2}>
            <Grid item>
                <FormLabel>Filter by Gender:    </FormLabel>
            </Grid>
            <Grid item>
                <FormControl variant="standard">
                    <Select
                        value={genderFilter}
                        onChange={e => { setGenderFilter(e.target.value) }}
                        displayEmpty
                    >
                        <MenuItem value="">
                            <em>All</em>
                        </MenuItem>
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    </Grid>

    <Grid item>
        <FormControlLabel
            control={
                <Checkbox
                    checked={favoritesOnly}
                    onChange={e => setFavoritesOnly(e.target.checked)}
                    color="primary"
                />
            }
            label="Favorites only"
        />
    </Grid>
</Grid>

            <Grid container alignItems="center" spacing={2}>
    <Grid item>
        <FormLabel>Filter by Eye Color: </FormLabel>
    </Grid>
    <Grid item>
        <FormControl variant="standard">
            <Select
                multiple
                value={eyeColorFilter}
                onChange={e => { setEyeColorFilter(e.target.value as string[]) }}
                renderValue={(selected) => (
                    <div>
                        {(selected as string[]).map((value) => (
                            <Chip key={value} label={value} />
                        ))}
                    </div>
                )}
            >
                <MenuItem value="blue">Blue</MenuItem>
                <MenuItem value="brown">Brown</MenuItem>
                <MenuItem value="yellow">Yellow</MenuItem>
                <MenuItem value="red">Red</MenuItem>
                <MenuItem value="orange">Orange</MenuItem>
                <MenuItem value="black">Black</MenuItem>
            </Select>
        </FormControl>
    </Grid>
</Grid>
      <Grid container alignItems="center" spacing={2}>
    <Grid item>
        <FormLabel>Filter by Species: </FormLabel>
    </Grid>
    <Grid item>
        <FormControl variant="standard">
            <Select
                multiple
                value={speciesFilter}
                onChange={e => { setSpeciesFilter(e.target.value as string[]) }}
                renderValue={(selected) => (
                    <div>
                        {(selected as string[]).map((value) => (
                            <Chip key={value} label={value} />
                        ))}
                    </div>
                )}
            >
                <MenuItem value="Human">Human</MenuItem>
                <MenuItem value="Mirialan">Mirialan</MenuItem>
                <MenuItem value="Droid">Droid</MenuItem>
                <MenuItem value="Gungan">Gungan</MenuItem>
                <MenuItem value="Kaminoan">Kaminoan</MenuItem>
                <MenuItem value="Twi'lek">Twi'lek</MenuItem>
                <MenuItem value="Zabrak">Zabrak</MenuItem>
            </Select>
        </FormControl>
    </Grid>
</Grid>



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
  pageSizeOptions={[5, 10,100]}
/>


    </div>
</div>
  </Grid>
    );
};



function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route path="/character/:id" element={<CharacterDetailPage />} />
          <Route path="/" element={
              <>
              <Header/>
              <CharactersTable />
              </>
          } />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}


export default App;
