<script setup lang="ts">
import { useDevices } from '@/store/devices'
const dStore = useDevices()
</script>

<template>
  <div class="panel">
    <h3>Live Devices</h3>

    <div class="list">
      <div v-for="c in dStore.cameras" :key="c.id" class="item">
        <div class="row">
          <strong>Camera — {{ c.name }} ({{ c.id }})</strong>
          <span class="badge">online</span>
        </div>
        <div class="small">
          pos: [{{ c.pos.join(', ') }}], yaw: {{ c.yaw }}°, fov: {{ c.fov }}°
        </div>
        <div style="display:flex;gap:8px;margin-top:8px">
          <button class="btn" @click="dStore.focus(c.id)">Locate</button>
          <button class="btn" @click="dStore.toggleCoverage()">
            {{ dStore.showCoverage ? 'Hide' : 'Show' }} coverage
          </button>
        </div>
      </div>

      <div v-for="d in dStore.doors" :key="d.id" class="item">
        <div class="row">
          <strong>Door — {{ d.name }} ({{ d.id }})</strong>
          <span class="badge">{{ d.state }}</span>
        </div>
        <div class="small">pos: [{{ d.pos.join(', ') }}]</div>
        <div style="display:flex;gap:8px;margin-top:8px">
          <button class="btn" @click="dStore.focus(d.id)">Locate</button>
        </div>
      </div>
    </div>
  </div>
</template>
