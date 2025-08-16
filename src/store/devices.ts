import { defineStore } from 'pinia'
import { devices as seed } from '../data/mock-devices'

export type Devices = typeof seed

export const useDevices = defineStore('devices', {
  state: () => ({
    ...seed,
    focusedId: null as string | null,
    showCoverage: true
  }),
  actions: {
    focus(id: string){ this.focusedId = id },
    toggleCoverage(){ this.showCoverage = !this.showCoverage }
  }
})
