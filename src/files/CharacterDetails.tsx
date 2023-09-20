import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {boxStyles, ICharacter, paperStyles} from "./helper";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { Box, IconButton, List, ListItem, ListItemText, Paper} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
interface IFilm {
  title: string;
}

const CharacterDetailPage: React.FC = () => {
  let { id = '0' } = useParams<{ id: string }>();
  let idNumber = parseInt(id);
  if (idNumber > 16) {
    idNumber += 1;
  }
  id = idNumber.toString();
  const navigate = useNavigate();

  const [character, setCharacter] = useState<ICharacter | null>(null);
  const [loading, setLoading] = useState(true);
  const [films, setFilms] = useState<IFilm[]>([]);
  const [homeworld, setHomeworld] = useState<string>('');
  const [species, setSpecies] = useState<string>('');

  useEffect(() => {
    fetch(`https://swapi.dev/api/people/${id}/`)
      .then(response => response.json())
      .then(data => {
        setCharacter(data);
        fetch(data.homeworld)
          .then(response => response.json())
          .then(data => setHomeworld(data.name));
        fetch(data.species[0])
          .then(response => response.json())
          .then(data => setSpecies(data.name));
        Promise.all(data.films.map((film: string) => fetch(film).then(res => res.json())))
          .then(filmsData => {
            setFilms(filmsData);
            setLoading(false);
          })
          .catch(err => {
            setFilms([{title:'No films or Error fetching films'}]);
          });
      });
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!character) return <p>No data</p>;

  return (
    <>
  <Header/>
  <Box
    sx={boxStyles}
  >
    <Paper elevation={3} sx={paperStyles}>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1, marginBottom:'30px'}} gutterBottom>
            Name: {character.name}
          </Typography>
      <Typography variant="body1" gutterBottom>
        1. Height: {character.height}
      </Typography>
      <Typography variant="body1" gutterBottom>
        2. Mass: {character.mass}
      </Typography>
      <Typography variant="body1" gutterBottom>
        3. Gender: {character.gender}
      </Typography>
      <Typography variant="body1" gutterBottom>
        4. Eye color: {character.eye_color}
      </Typography>
      <Typography variant="body1" gutterBottom>
        5. Home World: {homeworld}
      </Typography>
      <Typography variant="body1" gutterBottom>
6. Species : {species ? species : 'n/a'}
      </Typography>
      <Typography variant="h5" component="div" gutterBottom style={{ textDecoration: 'underline' }}>
        Films
      </Typography>
      <List>
        {films.map((film, index) => (
          <ListItem key={index}>
            <ListItemText primary={`• ${film.title}`} />
          </ListItem>
        ))}
      </List>
          <Box sx={{ position: 'absolute', bottom: 10, right: 10 }}>
    <IconButton color="primary" aria-label="back" onClick={() => navigate('/')}>
      <ArrowBackIcon />
    </IconButton>
  </Box>
    </Paper>
  </Box>
</>
);
};

export default CharacterDetailPage;
