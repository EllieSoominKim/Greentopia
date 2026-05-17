import React, { useState, useCallback, useEffect } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import { db } from "../data/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";

const containerStyle = {
  width: "100%",
  height: "80vh",
};

const SUNGSHIN_CENTER = {
  lat: 37.5925,
  lng: 127.0164,
};

function GoogleMapPage() {
  const [markers, setMarkers] = useState([]);
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const [mapCenter, setMapCenter] = useState(SUNGSHIN_CENTER);
  const [mapInstance, setMapInstance] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyB2TLR8YmWKfuQI0pAXzddA52rwtekezjU",
  });

  useEffect(() => {
    const fetchMarkers = async () => {
      const snapshot = await getDocs(collection(db, "markers"));
      const markerList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMarkers(markerList);
    };
    fetchMarkers();
  }, []);

  const handleMapClick = useCallback(async (event) => {
    const newMarker = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
      memo: "",
    };

    try {
      const docRef = await addDoc(collection(db, "markers"), newMarker);
      setMarkers((prev) => [...prev, { id: docRef.id, ...newMarker }]);
      setSelectedMarkerId(docRef.id);
    } catch (error) {
      console.error("Error adding marker:", error);
    }
  }, []);

  const handleMarkerDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "markers", id));
      setMarkers((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.error("Error deleting marker:", error);
    }
  };

  const handleMemoChange = async (id, memo) => {
    try {
      await updateDoc(doc(db, "markers", id), { memo });
      setMarkers((prev) =>
        prev.map((marker) => (marker.id === id ? { ...marker, memo } : marker))
      );
    } catch (error) {
      console.error("Error updating memo:", error);
    }
  };

  const moveToSungshin = () => {
    setMapCenter(SUNGSHIN_CENTER);
    mapInstance?.panTo(SUNGSHIN_CENTER);
  };

  const moveToCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const current = { lat: latitude, lng: longitude };
        setMapCenter(current);
        mapInstance?.panTo(current);
      },
      () => alert("현재 위치를 가져올 수 없습니다.")
    );
  };

  return isLoaded ? (
    <div className="min-h-screen bg-white p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-left text-black">📍 주변 쓰레기통 위치</h1>
        <div className="space-x-2">
          <button onClick={moveToSungshin} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">성신여대 주변</button>
          <button onClick={moveToCurrentLocation} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">현재 위치로 이동</button>
        </div>
      </div>

      <div className="flex gap-4">
        {/* 좌측 마커 목록 */}
        <div className="w-1/3 p-4 bg-gray-100 rounded-lg shadow overflow-y-auto h-[80vh]">
          <h2 className="text-xl font-semibold mb-4 text-green-800">🗒️ 마커 목록 (총 {markers.length}개)</h2>
          <ul className="space-y-3 text-sm">
            {markers.map((marker, idx) => (
              <li
                key={marker.id}
                className="flex flex-col gap-1 bg-white p-2 rounded shadow-sm border"
              >
                <span className="font-mono text-gray-700">
                  [{idx + 1}] {marker.lat.toFixed(5)}, {marker.lng.toFixed(5)}
                </span>
                <span className="text-gray-600">💬 {marker.memo || "메모 없음"}</span>
                <button
                  onClick={() => handleMarkerDelete(marker.id)}
                  className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 self-end"
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* 우측 지도 */}
        <div className="w-2/3 rounded-lg overflow-hidden shadow-lg">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={16}
            onLoad={(map) => setMapInstance(map)}
            onClick={handleMapClick}
          >
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                position={{ lat: marker.lat, lng: marker.lng }}
                onClick={() => setSelectedMarkerId(marker.id)}
              />
            ))}

            {selectedMarkerId &&
              (() => {
                const marker = markers.find((m) => m.id === selectedMarkerId);
                return marker ? (
                  <InfoWindow
                    position={{ lat: marker.lat, lng: marker.lng }}
                    onCloseClick={() => setSelectedMarkerId(null)}
                  >
                    <div>
                      <textarea
                        value={marker.memo}
                        onChange={(e) => handleMemoChange(marker.id, e.target.value)}
                        className="w-40 h-20 border rounded p-1"
                        placeholder="여기에 메모..."
                      />
                    </div>
                  </InfoWindow>
                ) : null;
              })()}
          </GoogleMap>
        </div>
      </div>
    </div>
  ) : (
    <p className="text-center mt-20 text-lg">지도를 불러오는 중...</p>
  );
}

export default GoogleMapPage;