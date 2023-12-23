import { gql } from '@apollo/client';

export const getLoggedInUserDetailsQuery = gql`
  query {
    getLoggedInUserDetails {
      code
      message
      user {
        uuid
        username
        email
      }
    }
  }
`;
