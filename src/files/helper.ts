import { useQuery } from '@apollo/react-hooks';
import { useState } from 'react';
import { gql } from '@apollo/client';

export interface ICharacter {
  name: string;
  height: string;
  mass: string;
  gender: string;
  homeworld: string;
  species: { name: string } | null;
  eye_color: string;
  favorite: boolean;
}

export const GET_CHARACTERS = gql`
  query AllPeople($first: Int, $after: String) {
    allPeople(first: $first, after: $after) {
      edges {
        node {
          name
          height
          mass
          gender
          homeworld {
            name
          }
          species {
            name
          }
          eyeColor
        }
      }
    }
  }
`;

export const useCharacters = () => {
  const { data, loading } = useQuery(GET_CHARACTERS, {
    variables: { first: 1000, after: null },
  });

  return { data, loading };
};

export const useFilters = () => {
  const [favoritesOnly, setFavoritesOnly] = useState<boolean>(false);
  const [genderFilter, setGenderFilter] = useState("");
  const [eyeColorFilter, setEyeColorFilter] = useState<string[]>([]);
  const [speciesFilter, setSpeciesFilter] = useState<string[]>([]);

  return { favoritesOnly, setFavoritesOnly, genderFilter, setGenderFilter, eyeColorFilter, setEyeColorFilter, speciesFilter, setSpeciesFilter };
};