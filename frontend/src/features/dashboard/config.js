export const roleDashboardConfig = {
  organizer: {
    workspaceLabel: 'ORGANIZER WORKSPACE',
    overview: {
      nextStepTitle: 'Plan your next event.',
      nextStepLabel: 'Create expo',
      nextStepPath: '/dashboard/expos/new',
    },
    feedback: {
      listEndpoint: '/feedback',
      canModerate: true,
    },
    canSendNotifications: true,
  },
  exhibitor: {
    workspaceLabel: 'EXHIBITOR WORKSPACE',
    overview: {
      nextStepTitle: 'Introduce your company.',
      nextStepLabel: 'Company profile',
      nextStepPath: '/dashboard/profile',
    },
    feedback: {
      listEndpoint: '/feedback/mine',
      canModerate: false,
    },
    canSendNotifications: false,
  },
  attendee: {
    workspaceLabel: 'ATTENDEE WORKSPACE',
    overview: {
      nextStepTitle: 'Plan your visit.',
      nextStepLabel: 'My plans',
      nextStepPath: '/dashboard/bookmarks',
    },
    feedback: {
      listEndpoint: '/feedback/mine',
      canModerate: false,
    },
    canSendNotifications: false,
  },
}
