import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import * as Sentry from '@sentry/angular';
import { environment } from './environments/environment';

Sentry.init({
  dsn: "https://5d606329ade79cb784b0e47f653f165d@o4508998653837312.ingest.us.sentry.io/4508998658752512",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration()
  ],
  // Tracing
  tracesSampleRate: 1.0,
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  // tracePropagationTargets: ["localhost","https://event-management-sand-one.vercel.app"],
  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0
})

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
