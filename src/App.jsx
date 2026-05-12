// import React, { useState, useEffect } from 'react';
// import { APIProvider, Map, AdvancedMarker, useMapsLibrary, useMap } from '@vis.gl/react-google-maps';

// import { stadiums } from './stadiums';

// const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
// const MAP_ID = import.meta.env.VITE_MAP_ID;

// function StadionPlaner() {
//   const [selectedStadium, setSelectedStadium] = useState(null);
//   const [stadiumsWithData, setStadiumsWithData] = useState(stadiums);
//   const map = useMap();

//   const routesLib = useMapsLibrary('routes');
// // Neue States für die Sortierung
// const [sortConfig, setSortConfig] = useState({ key: 'distance', direction: 'asc' });

// // Hilfsfunktion zum Sortieren
// const sortedStadiums = React.useMemo(() => {
//   let sortableItems = [...stadiumsWithData];

//   sortableItems.sort((a, b) => {
//     let aValue = a[sortConfig.key];
//     let bValue = b[sortConfig.key];

//     // Spezialfall Distanz: "145.2 km" -> 145.2
//     if (sortConfig.key === 'distance') {
//       aValue = parseFloat(aValue) || Infinity;
//       bValue = parseFloat(bValue) || Infinity;
//     }

//     // Spezialfall Spieltag: "12. Spieltag" -> 12
//     if (sortConfig.key === 'matchday') {
//       aValue = parseInt(aValue) || Infinity;
//       bValue = parseInt(bValue) || Infinity;
//     }

//     if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
//     if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
//     return 0;
//   });

//   return sortableItems;
// }, [stadiumsWithData, sortConfig]);

// // Funktion zum Wechseln der Sortierung
// const requestSort = (key) => {
//   let direction = 'asc';
//   if (sortConfig.key === key && sortConfig.direction === 'asc') {
//     direction = 'desc';
//   }
//   setSortConfig({ key, direction });
// };

//   useEffect(() => {
//     if (!routesLib) return;

//     const service = new routesLib.DistanceMatrixService();
//     const origin = { lat: 49.2464, lng: 11.0928 }; // Start: Roth
//     const destinations = stadiums.map(s => s.coords);

//     service.getDistanceMatrix({
//       origins: [origin],
//       destinations: destinations,
//       travelMode: google.maps.TravelMode.DRIVING,
//     }, (response, status) => {
//       if (status === 'OK') {
//         const results = response.rows[0].elements;
//         const updated = stadiums.map((s, index) => ({
//           ...s,
//           distance: results[index].distance?.text || 'N/A',
//           duration: results[index].duration?.text || 'N/A'
//         }));
//         setStadiumsWithData(updated);
//       }
//     });
//   }, [routesLib]);

//   // Funktion für den sanften 3D-Kamera-Flug
//   const handleStadiumClick = (stadium) => {
//     setSelectedStadium(stadium);

//     if (map) {
//       map.moveCamera({
//         center: stadium.coords,
//         zoom: 17.5,
//         tilt: 65,
//         heading: 0
//       });
//     }
//   };

//   // Dynamische Sortierung: Kürzeste Distanz zuerst
//   // const sortedStadiums = [...stadiumsWithData].sort((a, b) => {
//   //   // Wandelt "145.2 km" in 145.2 um. Falls "N/A", setze es auf Unendlich (ganz nach unten)
//   //   const distA = parseFloat(a.distance) || Infinity;
//   //   const distB = parseFloat(b.distance) || Infinity;
//   //   return distA - distB;
//   // }
//   // );

//   return (
//     <div className="flex flex-col h-screen bg-slate-900 text-white font-sans overflow-hidden selection:bg-red-500/30">

//       <header className="shrink-0 p-4 bg-slate-800/90 backdrop-blur-md border-b border-slate-700 z-10 flex justify-between items-center">
//         <h1 className="text-xl font-black text-red-600 uppercase italic">
//           Away Day Zentrale 26/27
//         </h1>
//         <div className="text-xs text-slate-400">
//           Start: <span className="text-slate-200 font-bold">Roth</span>
//         </div>
//       </header>

//       <div className="shrink-0 h-[45vh] w-full relative border-b border-slate-800">
//         <Map
//   defaultCenter={{ lat: 51.1657, lng: 10.4515 }}
//   defaultZoom={6}
//   mapId={MAP_ID}
//   gestureHandling={'greedy'}
//   disableDefaultUI={false}
// >
//   {stadiumsWithData.map((s) => (
//     <AdvancedMarker
//       key={s.id}
//       position={s.coords}
//       onClick={() => handleStadiumClick(s)}
//       zIndex={selectedStadium?.id === s.id ? 100 : 1}
//     >
//       {/* Nur wenn s.logoUrl existiert UND nicht leer ist, rendern wir den Custom-Marker */}
//       {s.logoUrl ? (
//         <div className={`relative transition-transform duration-300 ${
//           selectedStadium?.id === s.id ? 'scale-125' : 'scale-100 hover:scale-110'
//         }`}>
//           <div className="w-10 h-10 bg-white rounded-full p-1 shadow-lg border-2 border-slate-800 flex items-center justify-center text-black font-bold">
//             <img
//               src={s.logoUrl}
//               alt={s.team}
//               className="w-full h-full object-contain"
//             />
//           </div>
//           <div className="w-3 h-3 bg-white absolute -bottom-1 left-1/2 -translate-x-1/2 rotate-45 border-r-2 border-b-2 border-slate-800"></div>
//         </div>
//       ) : (
//         /*
//            Wenn kein Logo da ist, lassen wir die Children leer.
//            Google Maps rendert dann automatisch die rote Standard-Nadel.
//         */
//         null
//       )}
//     </AdvancedMarker>
//   ))}
// </Map>
//       </div>

//       {/* Kompakte, sortierte Listenansicht */}
//       {/* Kompakte, sortierte Listenansicht */}
// <div className="flex-1 min-h-0 overflow-y-auto bg-slate-900 pb-8">
//   <div className="flex flex-col">

//     {/* Klickbarer Tabellen-Kopf */}
// <div className="hidden md:flex items-center justify-between p-2 px-4 border-b border-slate-800 bg-slate-900/50 sticky top-0 z-10 text-[10px] text-slate-500 uppercase tracking-wider font-bold">
//   <div className="flex gap-4 w-1/3">
//     <span
//       className="cursor-pointer hover:text-red-500 transition-colors flex items-center gap-1"
//       onClick={() => requestSort('team')}
//     >
//       Mannschaft {sortConfig.key === 'team' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
//     </span>
//   </div>
//   <div className="flex gap-4 w-1/3">
//     <span
//       className="cursor-pointer hover:text-red-500 transition-colors flex items-center gap-1"
//       onClick={() => requestSort('matchday')}
//     >
//       Spieltermin {sortConfig.key === 'matchday' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
//     </span>
//   </div>
//   <div className="flex gap-4 justify-end w-1/3 shrink-0">
//     <span
//       className="w-20 text-right cursor-pointer hover:text-red-500 transition-colors flex items-center justify-end gap-1"
//       onClick={() => requestSort('distance')}
//     >
//       Distanz {sortConfig.key === 'distance' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
//     </span>
//     <span className="w-20 text-right">Reisezeit</span>
//   </div>
// </div>

//     {/* Die Datenzeilen */}
//     {sortedStadiums.map((s) => (
//       <div
//         key={s.id}
//         onClick={() => handleStadiumClick(s)}
//         className={`flex flex-col md:flex-row md:items-center justify-between p-3 px-4 border-b border-slate-800/50 cursor-pointer transition-colors gap-2 md:gap-0 ${
//           selectedStadium?.id === s.id
//             ? 'bg-slate-800 border-l-4 border-l-red-600'
//             : 'hover:bg-slate-800/50 border-l-4 border-l-transparent'
//         }`}
//       >
//         {/* Spalte 1: Team & Stadion */}
//         <div className="flex items-center gap-3 md:w-1/3">
//           <img src={s.logoUrl} alt={s.team} className="w-6 h-6 object-contain bg-white rounded-full p-0.5" />
//           <div className="flex flex-col">
//             <span className="font-bold text-sm text-slate-200">{s.team}</span>
//             <span className="text-slate-400 text-[10px] md:text-xs truncate">{s.stadium}</span>
//           </div>
//         </div>

//         {/* Spalte 2: Spieltag & Datum (NEU) */}
//         <div className="flex flex-row md:flex-col gap-2 md:gap-0 md:w-1/3 pl-9 md:pl-0">
//           <span className="text-yellow-500 font-bold text-xs">
//             {s.matchday || 'TBA'}
//           </span>
//           <span className="text-slate-400 text-xs">
//             {s.date || 'TBA'}
//           </span>
//         </div>

//         {/* Spalte 3: Distanz & Zeit */}
//         <div className="flex gap-4 md:gap-8 font-mono text-xs md:justify-end md:w-1/3 pl-9 md:pl-0">
//           <span className="text-slate-300 w-20 md:text-right">{s.distance || '---'}</span>
//           <span className="text-red-400 font-bold w-20 md:text-right">{s.duration || '---'}</span>
//         </div>
//       </div>
//     ))}
//   </div>
// </div>
//     </div>
//   );
// }

// export default function App() {
//   return (
//     <APIProvider apiKey={API_KEY} libraries={['routes', 'marker']}>
//       <StadionPlaner />
//     </APIProvider>
//   );
// }

import React, { useState, useEffect, useMemo } from "react";
import {
	APIProvider,
	Map,
	AdvancedMarker,
	useMapsLibrary,
	useMap,
} from "@vis.gl/react-google-maps";
import { stadiums } from "./stadiums";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const MAP_ID = import.meta.env.VITE_MAP_ID;

function StadionPlaner() {
	// States für Daten und Suche
	const [selectedStadium, setSelectedStadium] = useState(null);
	const [stadiumsWithData, setStadiumsWithData] = useState(stadiums);
	const [filterText, setFilterText] = useState("");

	// States für den Startpunkt (Default: Roth)
	const [startPos, setStartPos] = useState({ lat: 49.2464, lng: 11.0928 });
	const [startLabel, setStartLabel] = useState("Roth");
	const [startInput, setStartInput] = useState("Roth");

	// States für Sortierung
	const [sortConfig, setSortConfig] = useState({
		key: "distance",
		direction: "asc",
	});

	const map = useMap();
	const routesLib = useMapsLibrary("routes");
	const coreLib = useMapsLibrary("core"); // Für Geocoding

	// 1. Distanz-Berechnung (Triggert bei Änderung von startPos)
	useEffect(() => {
		if (!routesLib) return;

		const service = new routesLib.DistanceMatrixService();
		const destinations = stadiums.map((s) => s.coords);

		service.getDistanceMatrix(
			{
				origins: [startPos],
				destinations: destinations,
				travelMode: google.maps.TravelMode.DRIVING,
			},
			(response, status) => {
				if (status === "OK") {
					const results = response.rows[0].elements;
					const updated = stadiums.map((s, index) => ({
						...s,
						distance: results[index].distance?.text || "N/A",
						duration: results[index].duration?.text || "N/A",
					}));
					setStadiumsWithData(updated);
				}
			},
		);
	}, [routesLib, startPos]);

	/// 2. Startort-Suche (Geocoding)
	const handleStartSearch = async (e) => {
		if (e.key !== "Enter" || !startInput) return;

		// Wichtig: Leerzeichen am Anfang/Ende entfernen (z. B. Autokorrektur-Leerzeichen am Handy)
		const searchQuery = startInput.trim();
		if (!searchQuery) return;

		const geocoder = new google.maps.Geocoder();
		geocoder.geocode(
			{
				address: searchQuery,
				// Optional: Fokus auf Deutschland/Europa, damit er bei "bamberg" nicht eine Straße in den USA findet
				region: "de",
			},
			(results, status) => {
				if (status === "OK" && results[0]) {
					const newPos = results[0].geometry.location.toJSON();
					setStartPos(newPos);

					// Nimmt den formatierten Namen von Google (z. B. macht er aus "bamberg" wieder "Bamberg")
					setStartLabel(results[0].formatted_address);
					setStartInput(results[0].formatted_address);

					if (map) map.panTo(newPos);
				} else {
					alert("Ort nicht gefunden! (Google-Status: " + status + ")");
				}
			},
		);
	};

	// 3. Filter & Sortierung Logik
	const filteredAndSortedStadiums = useMemo(() => {
		// Erst filtern nach Teamname
		let result = stadiumsWithData.filter(
			(s) =>
				s.team.toLowerCase().includes(filterText.toLowerCase()) ||
				s.stadium.toLowerCase().includes(filterText.toLowerCase()),
		);

		// Dann sortieren
		result.sort((a, b) => {
			let aVal = a[sortConfig.key];
			let bVal = b[sortConfig.key];

			if (sortConfig.key === "distance") {
				aVal = parseFloat(aVal) || Infinity;
				bVal = parseFloat(bVal) || Infinity;
			}
			if (sortConfig.key === "matchday") {
				aVal = parseInt(aVal) || Infinity;
				bVal = parseInt(bVal) || Infinity;
			}

			if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
			if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
			return 0;
		});

		return result;
	}, [stadiumsWithData, filterText, sortConfig]);

	const handleStadiumClick = (stadium) => {
		setSelectedStadium(stadium);
		if (map) {
			map.moveCamera({
				center: stadium.coords,
				zoom: 17.5,
				tilt: 65,
				heading: 0,
			});
		}
	};

	return (
		<div className="flex flex-col h-screen bg-slate-900 text-white overflow-hidden font-sans">
		
    	{/* Header mit Startort-Suche */}
			<header className="shrink-0 p-2 bg-slate-800 border-b border-slate-700 z-10 flex flex-col md:flex-row md:items-center justify-between gap-2">
      {/* </header><header className="shrink-0 p-4 bg-slate-800 border-b border-slate-700 z-10 flex flex-col md:flex-row md:items-center justify-between gap-4"> */}
				<h1 className="text-lg font-black text-red-600 uppercase italic tracking-tighter px-1">
    Away Day 26/27
  </h1>

				{/* Input-Feld kompakter */}
  <div className="flex items-center bg-slate-950 rounded-full px-3 py-1 border border-slate-700 w-full md:w-80">
    <span className="text-[9px] text-slate-500 uppercase font-bold mr-2 shrink-0">Start:</span>
    <input 
      type="text"
      value={startInput}
      onChange={(e) => setStartInput(e.target.value)}
      onKeyDown={handleStartSearch}
      className="bg-transparent border-none text-xs focus:outline-none w-full text-slate-200 py-1"
      placeholder="Ort suchen..."
    />
  </div>
</header>

			<div className="shrink-0 h-[40vh] w-full relative">
				<Map
					defaultCenter={startPos}
					defaultZoom={6}
					mapId={MAP_ID}
					gestureHandling={"greedy"}
				>
					{stadiumsWithData.map((s) => (
						<AdvancedMarker
							key={s.id}
							position={s.coords}
							onClick={() => handleStadiumClick(s)}
						>
							{s.logoUrl ? (
								<div className="w-10 h-10 bg-white rounded-full p-1 shadow-lg border-2 border-slate-800 flex items-center justify-center">
									<img
										src={s.logoUrl}
										alt=""
										className="w-full h-full object-contain"
									/>
								</div>
							) : null}
						</AdvancedMarker>
					))}
				</Map>
			</div>

			{/* Team-Suche & Liste */}
			<div className="flex-1 min-h-0 flex flex-col bg-slate-900">
				{/* Team-Suchleiste */}
				<div className="p-4 bg-slate-900/80 border-b border-slate-800">
					<input
						type="text"
						placeholder="Mannschaft suchen..."
						className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-4 text-sm focus:border-red-600 outline-none transition-colors"
						value={filterText}
						onChange={(e) => setFilterText(e.target.value)}
					/>
				</div>

				<div className="flex-1 overflow-y-auto">
					{/* Tabellen-Header */}
					<div className="hidden md:flex p-2 px-4 border-b border-slate-800 text-[10px] text-slate-500 uppercase font-bold sticky top-0 bg-slate-900 z-10">
						<div
							className="w-1/3 cursor-pointer hover:text-white"
							onClick={() =>
								setSortConfig({
									key: "team",
									direction: sortConfig.direction === "asc" ? "desc" : "asc",
								})
							}
						>
							Mannschaft
						</div>
						<div
							className="w-1/3 cursor-pointer hover:text-white"
							onClick={() =>
								setSortConfig({
									key: "matchday",
									direction: sortConfig.direction === "asc" ? "desc" : "asc",
								})
							}
						>
							Termin
						</div>
						<div
							className="w-1/3 text-right cursor-pointer hover:text-white"
							onClick={() =>
								setSortConfig({
									key: "distance",
									direction: sortConfig.direction === "asc" ? "desc" : "asc",
								})
							}
						>
							Distanz
						</div>
					</div>

					{filteredAndSortedStadiums.map((s) => (
						<div
							key={s.id}
							onClick={() => handleStadiumClick(s)}
							className={`flex flex-col md:flex-row md:items-center p-3 px-4 border-b border-slate-800/50 cursor-pointer hover:bg-slate-800/40 ${selectedStadium?.id === s.id ? "bg-slate-800 border-l-4 border-l-red-600" : "border-l-4 border-l-transparent"}`}
						>
							<div className="flex items-center gap-3 md:w-1/3">
								<img
									src={s.logoUrl}
									className="w-6 h-6 object-contain bg-white rounded-full p-0.5"
									alt=""
								/>
								<div className="flex items-start flex-col">
									<span className="font-bold text-sm">{s.team}</span>
									<span className="text-slate-500 text-[10px]">
										{s.stadium}
									</span>
								</div>
							</div>
							<div className="flex flex-row md:flex-col gap-2 md:w-1/3 text-xs my-1 md:my-0">
								<span className="text-yellow-500 font-bold">
									{s.matchday || "TBA"}
								</span>
								<span className="text-slate-500">{s.date || "TBA"}</span>
							</div>
							<div className="flex gap-4 md:w-1/3 md:justify-end font-mono text-xs">
								<span className="text-slate-300 w-20 md:text-right">
									{s.distance}
								</span>
								<span className="text-red-500 font-bold w-20 md:text-right">
									{s.duration}
								</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default function App() {
	return (
		<APIProvider apiKey={API_KEY} libraries={["routes", "marker", "geocoding"]}>
			<StadionPlaner />
		</APIProvider>
	);
}
