const labels: Record<string, string> = {
  PLANNED: 'Planned',
  NOT_STARTED: 'Not started',
  IN_PROGRESS: 'In progress',
  FINISHED: 'Completed'
};

export function matchStatusLabel(status: string): string {
  return labels[status] || status;
}
