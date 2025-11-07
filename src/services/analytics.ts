export type AnalyticsEvent = {
  name: string;
  payload?: Record<string, unknown>;
};

export const analytics = {
  log(event: AnalyticsEvent) {
    // eslint-disable-next-line no-console
    console.debug('[analytics]', event.name, event.payload ?? {});
  },
};
