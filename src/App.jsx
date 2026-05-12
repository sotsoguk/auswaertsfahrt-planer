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
		<div className="flex flex-col h-screen bg-[#09090b] text-zinc-100 overflow-hidden font-sans antialiased">
			{/* Ultra-Slim Header mit Glassmorphism */}
			{/* Optimierter Header */}
			<header className="shrink-0 p-2 px-4 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800/50 z-10 flex flex-row items-center gap-4">
				<h1 className="text-sm font-black tracking-[0.2em] uppercase italic">
					<span className="text-rose-500">Away</span>
					<span className="text-zinc-100 ml-1">Days</span>
					<span className="text-zinc-500 font-light ml-2 text-[10px] not-italic">
						26/27
					</span>
				</h1>

				<div className="flex-1 flex items-center bg-zinc-950/50 rounded-full px-3 py-1 border border-zinc-800 focus-within:border-rose-900/50 transition-all max-w-sm">
					<input
						type="text"
						value={startInput}
						onChange={(e) => setStartInput(e.target.value)}
						onKeyDown={handleStartSearch}
						className="bg-transparent border-none text-[11px] focus:outline-none w-full text-zinc-300 placeholder:text-zinc-700"
						placeholder="Startpunkt..."
					/>
				</div>
			</header>

			<div className="shrink-0 h-[35vh] w-full relative shadow-inner">
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
				<div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_60px_rgba(0,0,0,0.3)]"></div>
			</div>

			{/* Team-Suche & Liste */}
			<div className="flex-1 min-h-0 flex flex-col bg-zinc-950">
				<div className="p-3 bg-zinc-950 border-b border-zinc-900">
					<input
						type="text"
						placeholder="Mannschaft suchen..."
						className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg py-1.5 px-4 text-xs focus:ring-1 focus:ring-zinc-700 outline-none transition-all placeholder:text-zinc-600"
						value={filterText}
						onChange={(e) => setFilterText(e.target.value)}
					/>
				</div>

				<div className="flex-1 overflow-y-auto custom-scrollbar">
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
							className={`
      flex flex-row items-center p-3 px-4 transition-all duration-150 border-b border-zinc-900/30
      ${
				selectedStadium?.id === s.id
					? "bg-zinc-900 shadow-[inset_3px_0_0_0_#f43f5e]"
					: "hover:bg-zinc-900/40"
			}
    `}
						>
							{/* Logo-Container mit fixer Breite für Ruhe in der Optik */}
							<div className="w-10 shrink-0 flex justify-start items-center">
								<img
									src={s.logoUrl}
									className={`w-7 h-7 object-contain bg-white rounded-full p-0.5 shadow-sm transition-transform ${selectedStadium?.id === s.id ? "scale-110" : ""}`}
									alt=""
								/>
							</div>

							{/* Text-Block: Konsequent linksbündig */}
							<div className="flex flex-col items-start flex-1 ml-2">
								<span
									className={`text-sm font-bold tracking-tight ${selectedStadium?.id === s.id ? "text-white" : "text-zinc-200"}`}
								>
									{s.team}
								</span>
								<span className="text-zinc-500 text-[9px] uppercase tracking-wider font-medium">
									{s.stadium}
								</span>
							</div>

							{/* Rechte Spalte: Kompakt gehalten */}
							<div className="flex flex-col items-end shrink-0">
								<div className="flex items-center gap-2">
									<span className="text-[10px] font-mono text-zinc-600">
										{s.distance}
									</span>
									<span
										className={`text-xs font-bold ${selectedStadium?.id === s.id ? "text-rose-400" : "text-rose-600"}`}
									>
										{s.duration}
									</span>
								</div>
								<div className="text-[8px] text-zinc-400 font-bold bg-zinc-800 px-1.5 py-0.5 rounded-sm mt-1">
									SPIELTAG {s.matchday}
								</div>
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
