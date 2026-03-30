import {useCallback, useEffect, useState} from 'react';
import {GoogleMap, MarkerF, useJsApiLoader} from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '400px'
};

// A default location (e.g., center of a city) in case geolocation fails
const defaultCenter = {
    lat: 9.9599655, // Chennai latitude
    lng: 78.1349839  // Chennai longitude
};

const isLoaded = false;
export default function LocationModal({onClose, onLocationSave}) {
    // const {isLoaded, loadError} = useJsApiLoader({
    //     id: 'google-map-script',
    //     googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    // });

    const [map, setMap] = useState(null);
    const [markerPosition, setMarkerPosition] = useState(defaultCenter);
    const [selectedAddress, setSelectedAddress] = useState('Fetching location...');

    // Function to get address from coordinates
    const getAddressFromLatLng = useCallback((lat, lng) => {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({location: {lat, lng}}, (results, status) => {
            if (status === 'OK') {
                if (results[0]) {
                    setSelectedAddress(results[0].formatted_address);
                } else {
                    setSelectedAddress('No address found');
                }
            } else {
                setSelectedAddress('Geocoder failed due to: ' + status);
            }
        });
    }, []);

    // Effect to get user's current location on component mount
    useEffect(() => {
        if (isLoaded) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newPos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setMarkerPosition(newPos);
                    if (map) {
                        map.panTo(newPos);
                    }
                    getAddressFromLatLng(newPos.lat, newPos.lng);
                },
                () => {
                    // Handle error or user denial
                    getAddressFromLatLng(defaultCenter.lat, defaultCenter.lng);
                    alert("Could not get your location. Defaulting to a central location.");
                }
            );
        }
    }, []);

    const handleMapClick = (event) => {
        const newPos = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
        };
        setMarkerPosition(newPos);
        getAddressFromLatLng(newPos.lat, newPos.lng);
    };

    const handleSave = () => {
        onLocationSave(selectedAddress);
    };

    const onLoad = useCallback(function callback(mapInstance) {
        setMap(mapInstance);
    }, []);

    const onUnmount = useCallback(function callback(mapInstance) {
        setMap(null);
    }, []);

    // if (loadError) {
    //     return <div>Error loading maps</div>;
    // }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
                <h2 className="text-xl font-bold mb-4">Select Your Delivery Location</h2>
                <p className="mb-2 text-sm text-gray-600">Click on the map to set your location pin.</p>

                {/*{isLoaded ? (*/}
                {/*    <GoogleMap*/}
                {/*        mapContainerStyle={containerStyle}*/}
                {/*        center={markerPosition}*/}
                {/*        zoom={15}*/}
                {/*        onLoad={onLoad}*/}
                {/*        onUnmount={onUnmount}*/}
                {/*        onClick={handleMapClick}*/}
                {/*        options={{*/}
                {/*            streetViewControl: false,*/}
                {/*            mapTypeControl: false,*/}
                {/*        }}*/}
                {/*    >*/}
                {/*        <MarkerF position={markerPosition}/>*/}
                {/*    </GoogleMap>*/}
                {/*) : (*/}
                {/*    <div style={containerStyle} className="flex justify-center items-center bg-gray-200">*/}
                {/*        Loading Map...*/}
                {/*    </div>*/}
                {/*)}*/}

                <div className="mt-4 p-3 bg-gray-100 rounded">
                    <p className="font-semibold">Selected Address:</p>
                    <p className="text-gray-800">{selectedAddress}</p>
                </div>

                <div className="mt-6 flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Save & Continue
                    </button>
                </div>
            </div>
        </div>
    );
}
