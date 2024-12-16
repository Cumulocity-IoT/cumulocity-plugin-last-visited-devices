import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule as ngRouterModule } from '@angular/router';
import {
  BootstrapComponent,
  CoreModule,
  RouterModule,
} from '@c8y/ngx-components';
import {
  CockpitDashboardModule,
  DeviceContextDashboardModule,
} from '@c8y/ngx-components/context-dashboard';

import { IconDirective } from '@c8y/ngx-components';
@NgModule({
  imports: [
    BrowserAnimationsModule,
    ngRouterModule.forRoot([], { enableTracing: false, useHash: true }),
    RouterModule.forRoot(),
    CoreModule.forRoot(),
    CockpitDashboardModule,
    DeviceContextDashboardModule,
    IconDirective,
  ],
  bootstrap: [BootstrapComponent],
})
export class AppModule {}
