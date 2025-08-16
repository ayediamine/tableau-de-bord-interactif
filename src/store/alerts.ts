import { defineStore } from 'pinia'
import { alerts as seed } from '../data/mock-alerts'

export type Alert = typeof seed[number]

export const useAlerts = defineStore('alerts', {
  state: () => ({
    list: seed as Alert[],
    selectedId: null as string | null,
    filter: { severity: 'All' as 'All'|'Low'|'Medium'|'High', source: 'All' as 'All'|'Video'|'LiDAR'|'Access' }
  }),
  getters: {
    filtered: (s) => s.list.filter(a =>
      (s.filter.severity==='All'||a.severity===s.filter.severity) &&
      (s.filter.source==='All'||a.source===s.filter.source)
    ),
    selected: (s)=> s.list.find(a=>a.id===s.selectedId) || null
  },
  actions: {
    select(id: string){ this.selectedId = id }
  }
})
