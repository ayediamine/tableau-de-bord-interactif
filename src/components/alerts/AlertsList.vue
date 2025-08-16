<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAlerts } from '@/store/alerts'
import { useDevices } from '@/store/devices'

const aStore = useAlerts()
const dStore = useDevices()

const severities = ['All','High','Medium','Low'] as const
const sources    = ['All','Video','LiDAR','Access'] as const

const list = computed(()=> aStore.filtered)

function focusAlert(id:string, deviceId:string){
  aStore.select(id)
  dStore.focus(deviceId)
}
</script>

<template>
  <div class="panel">
    <h3>Correlated Alerts</h3>

    <div class="row" style="margin-bottom:8px">
      <select v-model="aStore.filter.severity" class="btn">
        <option v-for="s in severities" :key="s" :value="s">{{ s }}</option>
      </select>
      <select v-model="aStore.filter.source" class="btn">
        <option v-for="s in sources" :key="s" :value="s">{{ s }}</option>
      </select>
    </div>

    <div class="list">
      <div v-for="a in list" :key="a.id" class="item" :style="a.id===aStore.selectedId ? 'outline:1px solid var(--accent)' : ''">
        <div class="row">
          <strong>{{ a.type }}</strong>
          <span class="badge">{{ a.severity }}</span>
        </div>
        <div class="small">{{ a.source }} • {{ a.ts }} • #{{ a.id }}</div>
        <div style="display:flex;gap:8px;margin-top:8px">
          <button class="btn" @click="focusAlert(a.id, a.deviceId)">Focus 3D</button>
          <button class="btn">Playback (mock)</button>
        </div>
      </div>
    </div>
  </div>
</template>
