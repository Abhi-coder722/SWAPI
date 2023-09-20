import {ApolloClient, gql, InMemoryCache} from '@apollo/client';

export interface ICharacter {
  id:string,
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
export const boxStyles={
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '50px'
    };
export const paperStyles={ padding: '80px', textAlign: 'left', maxWidth: '80%', minWidth: '300px', position: 'relative' };

export const client = new ApolloClient({
  uri: 'https://swapi-graphql.netlify.app/.netlify/functions/index',
  cache: new InMemoryCache()
});