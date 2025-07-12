import type { Text } from "hast";
import fm from "front-matter";
import z from "zod";

const geoJsonReferenceSchema = z.object({
	id: z.string(),
	url: z.string(),
	title: z.string().optional(),
	href: z.string().optional(),
});

const transformGeoJsonReference = (
	v: string,
): z.infer<typeof geoJsonReferenceSchema> => {
	const [id, title, hrefFragment] = v.split("|");

	let href: string | undefined = undefined;

	if (hrefFragment?.includes("(")) {
		const regex = /\[.*?\]\((.*?)\)/g;
		const matches = [...hrefFragment.matchAll(regex)];

		href = matches.map((match) => match[1])?.[0];
	}

	return {
		id,
		url: `/assets/Maps/${id}`,
		title,
		href,
	};
};

const leafletSchema = z.object({
	id: z.string(),
	lat: z.number(),
	long: z.number(),
	minZoom: z.number().optional().default(1),
	maxZoom: z.number().optional().default(10),
	defaultZoom: z.number().optional().default(5),
	geojson: z.string().transform(transformGeoJsonReference).array(),
});

type LeafletInput = z.input<typeof leafletSchema>;

export const leaflet = (node: Text) => {
	const { attributes } = fm<LeafletInput>(`---\n${node.value}\n---\n`);

	if (!attributes) {
		return null;
	}

	const options = leafletSchema.parse(attributes);

	return {
		before: [
			//  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
			{
				type: "element",
				tagName: "link",
				properties: {
					"data-pagefind-weight": "0",
					rel: "stylesheet",
					href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
					integrity: "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=",
					crossorigin: "",
				},
			},
			// <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="     crossorigin=""></script>
			{
				type: "element",
				tagName: "script",
				properties: {
					"data-pagefind-weight": "0",
					src: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
					integrity: "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=",
					crossorigin: "",
				},
			},
			{
				type: "element",
				tagName: "leaflet-map",
				properties: {
  				"data-pagefind-weight": "0",
					id: options.id,
					className: 'map',
				},
				children: [
					{
						type: "element",
						tagName: "script",
						properties: {
							type: "application/json",
						},
						children: [
							{
								type: "text",
								value: JSON.stringify(
									{
										options: {
											attributionControl: false,
											center: [options.lat, options.long],
											zoom: options.defaultZoom,
											maxZoom: options.maxZoom,
											minZoom: options.minZoom,
											zoomControl: false,
										},
										scaleOptions: {
											maxWidth: 200,
										},
										baseLayers: [
											{
												name: "OpenStreetMaps",
												config: {
													kind: "TileLayer",
													urlTemplate:
													//	"https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.{ext}",
													// 'https://tiles.stadiamaps.com/tiles/stamen_terrain_background/{z}/{x}/{y}{r}.{ext}'
													'https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}.{ext}',
													// "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png",
													options: {
														attribution:
															'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
														ext: 'png',
													},
												},
											},
										],
										overlayLayers: [
											...options.geojson.map((geo) => ({
												name: geo.title,
												selected: true,
												config: {
													kind: "GeoJSON",
													id: geo.id,
													href: geo.href,
													options: {
														useSimpleStyle: true,
										        useMakiMarkers: true
													}
													// "fitBounds": true,
												}
											})),
										],
									},
									null,
									2,
								),
							},
						],
					},
					...options.geojson.map((geo) => ({
						// <script id="singapore-neighbourhoods" type="application/geo+json" src="testdata/neighbourhoods.geojson"></script>
						type: "element",
						tagName: "script",
						properties: {
							id: geo.id,
							type: "application/geo+json",
							src: geo.url,
						},
					})),
				],
			},
		],
	};
};
