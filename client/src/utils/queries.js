import { gql } from '@apollo/client';

export const GET_ME = gql`
 {
    me {
        username
        email
        bookCount
        _id
        savedBooks {
          authors
          bookId
          description
          image
          link
          title
        }
      }
}
`