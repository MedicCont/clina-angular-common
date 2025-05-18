import { gql } from 'apollo-angular';

export const ROOMS_FAVORITE_QUERY = gql`
  {
    roomsFavorite {
      roomFavoriteId
      ownerAccountId
      roomId
      room {
        roomId
        name
        description
        code
        advance
        types
        images
        minPrice
        clinicId
        clinicName
        zipcode
        address
        addressNumber
        addressComplement
        neighborhood
        city
        state
        lat
        lng
        packagesOfHours {
          packageOfHoursId
          type
          amountOfHours
          discountInPercent
        }
      }
    }
  }
`;
