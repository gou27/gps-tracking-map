function moveToCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                let lat = position.coords.latitude;
                let lng = position.coords.longitude;
                map.flyTo([lat, lng], 18, { animate: true });
                document.getElementById("status").textContent = `現在位置へ移動: 緯度 ${lat}, 経度 ${lng}`;
            },
            (error) => {
                document.getElementById("status").textContent = "現在位置を取得できませんでした。";
                console.error("現在位置の取得に失敗しました", error);
            },
            { enableHighAccuracy: true, maximumAge: 0 }
        );
    } else {
        alert("このブラウザでは位置情報がサポートされていません。");
    }
}

function startTracking() {
    if (navigator.geolocation) {
        document.getElementById("status").textContent = "計測中...";
        path = [];
        polyline.setLatLngs([]);
        trackingActive = true;

        watchId = navigator.geolocation.watchPosition(
            (position) => {
                if (!trackingActive) return;
                let lat = position.coords.latitude;
                let lng = position.coords.longitude;
                let timestamp = new Date(position.timestamp).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
                let newPos = { lat, lng, timestamp };
                path.push(newPos);
                polyline.setLatLngs(path.map(p => [p.lat, p.lng]));
                map.flyTo([lat, lng], map.getZoom(), { animate: true });
                marker.setLatLng([lat, lng]);
                document.getElementById("status").textContent = `計測中: 緯度 ${lat}, 経度 ${lng}, 時刻 ${timestamp}`;
            },
            (error) => {
                let errorMsg;
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMsg = "位置情報の利用が許可されていません。ブラウザの設定を確認してください。";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMsg = "位置情報が取得できません。電波状況やGPSの設定を確認してください。";
                        break;
                    case error.TIMEOUT:
                        errorMsg = "位置情報の取得がタイムアウトしました。再試行してください。";
                        break;
                    default:
                        errorMsg = "未知のエラーが発生しました。";
                }
                document.getElementById("status").textContent = errorMsg;
                console.error("位置情報の取得に失敗しました", error);
            },
            { enableHighAccuracy: true, maximumAge: 0 }
        );
    } else {
        alert("このブラウザでは位置情報がサポートされていません。");
        document.getElementById("status").textContent = "位置情報がサポートされていません。";
    }
}

function stopTracking() {
    trackingActive = false;
    if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
    document.getElementById("status").textContent = "計測停止。軌跡表示ボタンを押すと再表示できます。";
    alert("記録を停止しました。");
}
