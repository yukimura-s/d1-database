<script>
  import { onMount } from 'svelte';
  import L from 'leaflet';

  onMount(() => {
    const map = L.map('map').setView([35.6895, 139.6917], 13); // 東京
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
  });
</script>

<div id="map" style="height: 100vh;"></div>

<style>
  #map { height: 100vh; }
</style>
