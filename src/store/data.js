import { defineStore } from 'pinia'
import {
  PROJECTS, PROJECT_NODES, ISSUES, CHECKINS, SHIPMENTS, MEDIA_ASSETS,
  USERS, getUserById, getStatusInfo
} from '@/mock/data'

export const useDataStore = defineStore('data', {
  state: () => ({
    projects: JSON.parse(JSON.stringify(PROJECTS)),
    nodes: JSON.parse(JSON.stringify(PROJECT_NODES)),
    issues: JSON.parse(JSON.stringify(ISSUES)),
    checkins: JSON.parse(JSON.stringify(CHECKINS)),
    shipments: JSON.parse(JSON.stringify(SHIPMENTS)),
    media: JSON.parse(JSON.stringify(MEDIA_ASSETS)),
    users: USERS
  }),
  getters: {
    // 看板统计
    runningProjects: (s) => s.projects.filter(p => !['done', 'closed'].includes(p.status)),
    overdueProjects: (s) => s.projects.filter(p => p.overdue),
    todayTasks: (s) => {
      const now = Date.now()
      const tomorrow = now + 86400000
      return s.nodes.filter(n => {
        const dl = new Date(n.deadline).getTime()
        return ['todo', 'doing', 'pending_confirm'].includes(n.status) && dl <= tomorrow
      })
    },
    overdueTasks: (s) => {
      const now = Date.now()
      return s.nodes.filter(n => {
        const dl = new Date(n.deadline).getTime()
        return ['todo', 'doing'].includes(n.status) && dl < now
      })
    },
    openIssues: (s) => s.issues.filter(i => !['closed', 'resolved'].includes(i.status)),
    overdueIssues: (s) => {
      const now = Date.now()
      return s.issues.filter(i => {
        const dl = new Date(i.deadline).getTime()
        return !['closed', 'resolved'].includes(i.status) && dl < now
      })
    },
    pendingShipProjects: (s) => s.projects.filter(p => p.status === 'ship'),
    pendingAcceptProjects: (s) => s.projects.filter(p => p.status === 'accept'),
    unpaidAmount: (s) => s.projects
      .filter(p => p.status !== 'closed')
      .reduce((sum, p) => sum + (p.contractAmount - p.receivedAmount), 0),
    // 人员责任统计
    workloadByUser: (s) => {
      const map = {}
      USERS.forEach(u => { map[u.id] = { user: u, pending: 0, overdue: 0, issues: 0 } })
      const now = Date.now()
      s.nodes.forEach(n => {
        if (['todo', 'doing'].includes(n.status) && map[n.owner]) {
          map[n.owner].pending++
          if (new Date(n.deadline).getTime() < now) map[n.owner].overdue++
        }
      })
      s.issues.forEach(i => {
        if (!['closed', 'resolved'].includes(i.status) && map[i.assignee]) {
          map[i.assignee].issues++
        }
      })
      return Object.values(map).filter(x => x.pending + x.overdue + x.issues > 0)
    }
  },
  actions: {
    addProject(p) {
      const id = 'p' + String(this.projects.length + 1).padStart(3, '0')
      const code = `HM2026-${String(this.projects.length + 1).padStart(3, '0')}`
      const project = {
        id, code, ...p,
        receivedAmount: 0,
        status: 'material',
        createdAt: new Date().toISOString(),
        overdue: false
      }
      this.projects.unshift(project)
      return project
    },
    addIssue(issue) {
      const id = 'i' + String(this.issues.length + 1).padStart(3, '0')
      const project = this.projects.find(p => p.id === issue.projectId)
      this.issues.unshift({
        id, ...issue,
        projectName: project?.name || '',
        status: 'todo',
        createdAt: new Date().toISOString()
      })
    },
    updateIssueStatus(id, status) {
      const issue = this.issues.find(i => i.id === id)
      if (issue) issue.status = status
    },
    updateNodeStatus(nodeId, status, confirmedBy) {
      const node = this.nodes.find(n => n.id === nodeId)
      if (node) {
        node.status = status
        if (confirmedBy) node.confirmedBy = confirmedBy
      }
    },
    addCheckin(payload) {
      const id = 'c' + String(this.checkins.length + 1).padStart(3, '0')
      const project = this.projects.find(p => p.id === payload.projectId)
      this.checkins.unshift({
        id, ...payload,
        projectName: project?.name || '',
        time: new Date().toISOString()
      })
    },
    helpers: () => ({ getUserById, getStatusInfo })
  }
})
