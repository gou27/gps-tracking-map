function downloadGeoJSONFromPath(path) {
    if (path.length === 0) {
        alert("ダウンロードするデータがありません。");
        return;
    }
    let geojson = {
        type: "FeatureCollection",
        features: path.map(point => ({
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [point.lng, point.lat]
            },
            properties: { timestamp: point.timestamp }
        }))
    };
    let blob = new Blob([JSON.stringify(geojson, null, 2)], { type: "application/json" });
    let a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = "none";
    a.href = URL.createObjectURL(blob);
    a.download = "track.geojson";
    a.click();
    URL.revokeObjectURL(a.href);
    document.body.removeChild(a);
}

function downloadKMLFromPath(path) {
    if (path.length === 0) {
        alert("ダウンロードするデータがありません。");
        return;
    }
    let kml = `<?xml version="1.0" encoding="UTF-8"?>
    <kml xmlns="http://www.opengis.net/kml/2.2">
        <Document>
            <name>運転軌跡</name>
            ${path.map(point => `
                <Placemark>
                    <TimeStamp><when>${point.timestamp}</when></TimeStamp>
                    <Point>
                        <coordinates>${point.lng},${point.lat},0</coordinates>
                    </Point>
                </Placemark>
            `).join('')}
        </Document>
    </kml>`;
    let blob = new Blob([kml], { type: "application/vnd.google-earth.kml+xml" });
    let a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = "none";
    a.href = URL.createObjectURL(blob);
    a.download = "track.kml";
    a.click();
    URL.revokeObjectURL(a.href);
    document.body.removeChild(a);
}
