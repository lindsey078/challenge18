import { gql } from '@apollo/client';

export const GET_ME = gql`
    query {
        me {
            _id
            username
            email
            bookCount
            savedBooks {
                bookId
                title
                authors
                description
                image
                link
            }
        }
    }
`;