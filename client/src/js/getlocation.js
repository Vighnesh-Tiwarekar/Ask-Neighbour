
export const getLocation = async (setprofile) => {
    
    if (!navigator.geolocation) {
        alert("Browser doesn't support Geolocation!");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            setprofile(...previsprof=> ({
                previsprof,
                lat: position.coords.latitude,
                lon: position.coords.longitude,
            }))
        },
        (error) => {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    alert("User denied the request for Geolocation.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    console.log(error)
                    alert("Location information is unavailable.");
                    break;
                case error.TIMEOUT:
                    alert("The request to get user location timed out.");
                    break;
                case error.UNKNOWN_ERROR:
                default:
                    alert("An unknown error occurred.");
                    break;
            }
            console.error("Geolocation error:", error);
        }
    );
};
