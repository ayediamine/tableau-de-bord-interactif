<script setup lang="ts">
import ThreeTwin from './components/three/ThreeTwin.vue'
import AlertsList from './components/alerts/AlertsList.vue'
import DevicesList from './components/devices/DevicesList.vue'
</script>

<template>
  <div class="app">
    <div class="topbar">
      <strong>AVENZOR JARVIS — PSOC Demo (Front-only)</strong>
      <span class="badge">mock data</span>
    </div>

    <aside class="left">
      <div class="panel">
        <h3>Inputs</h3>
        <div class="list">
          <div class="item">Video Surveillance</div>
          <div class="item">LiDAR</div>
          <div class="item">Access Control</div>
          <div class="item">Intrusion Detection</div>
          <div class="item">Env. Sensors</div>
          <div class="item">BMS / IoT</div>
        </div>
      </div>
    </aside>

    <main class="main">
      <ThreeTwin />
    </main>

    <aside class="right">
      <AlertsList />
      <DevicesList style="margin-top:12px"/>
    </aside>
  </div>
</template>
