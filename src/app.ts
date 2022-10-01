import axios from "axios";

const form: HTMLFormElement = document.querySelector("form")!;
const addressInput: HTMLInputElement = document.getElementById("address")! as HTMLInputElement;

const GOOGLE_API_KEY: string = "AIzaSyC7HoM_rVWXhCva2bX-jlXhlsYpsjz9u9o";

type GoogleGeocodingResponse = {
    results: { geometry: { location: { lat: number; lng: number } } }[];
    status: "OK" | "ZERO_RESULTS";
};

function searchAddressHandler(event: Event): void {
    event.preventDefault();
    const enteredAddress: string = addressInput.value;

    axios.get<GoogleGeocodingResponse>(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
            enteredAddress
        )}&key=${GOOGLE_API_KEY}`
    )
        .then(response => {
            if (response.data.status !== "OK") {
                throw new Error("Could not fetch location!");
            }
            const coordinates = response.data.results[0].geometry.location;
            console.log(coordinates)
            const map = new google.maps.Map(document.getElementById("map")!, {
                center: coordinates,
                zoom: 16
            });

            new google.maps.Marker({ position: coordinates, map: map });
        })
        .catch(err => {
            alert(err.message);
            console.log(err);
        });
}

form.addEventListener("submit", searchAddressHandler);
