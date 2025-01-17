import axios from "axios";


export const getCities = async (req, res) => {
    try {
        const { input } = req.query;
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;

        const autocompleteResponse = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
            params: {
                input: input,
                key: apiKey,
                types: '(cities)', // Limit to cities for New Zealand
                components: 'country:nz' // Restrict to New Zealand
            }
        });
        const cities = autocompleteResponse.data.predictions;
        // Check if there are any predictions before attempting to access them
        if (!cities || cities.length === 0) {
            return res.json({ message: 'No cities found', predictions: [] }); 
        }
        const citiesDetails = await Promise.all(cities.map(async (city) => {
            const detailsResponse = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
                params: {
                    placeid: city.place_id,
                    key: apiKey
                }
            });

            const lat = detailsResponse.data.result.geometry.location.lat;
            const lon = detailsResponse.data.result.geometry.location.lng;

            return { ...city, lat, lon };
        }));
        console.log(citiesDetails)
        res.json(citiesDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// export const getPlaceDetails = async (req, res) => {
//     try {
//         const { placeId } = req.query;
//         const apiKey = process.env.GOOGLE_MAPS_API_KEY;
//         console.log(placeId)
//         const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
//             params: {
//                 placeid: placeId,
//                 key: apiKey
//             }
//         });

//         const lat = response.data.result.geometry.location.lat;
//         const lon = response.data.result.geometry.location.lng;

//         res.json({ lat, lon });
//     } catch (error) {
//         console.error(error);
//         res.status(400).json({ message: 'Internal server error' });
//     }
// };