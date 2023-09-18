import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {ICharacter} from "./helper";

const CharacterDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [character, setCharacter] = useState<ICharacter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://swapi.dev/api/people/${id}/`)
      .then(response => response.json())
      .then(data => {
        setCharacter(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!character) return <p>No data</p>;

  return (
    <div>
      <h1>{character.name}</h1>
      <p>Height: {character.height}</p>
      <p>Mass: {character.mass}</p>
      <p>Gender: {character.gender}</p>
      <p>Eye color: {character.eye_color}</p>
      <Link to="/">Back</Link>
    </div>
  );
};

export default CharacterDetailPage;
