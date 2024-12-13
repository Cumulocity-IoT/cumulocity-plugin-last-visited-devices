// Assets need to be imported into the module, or they are not available
import { assetPaths } from '../../assets/assets';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetPluginComponent } from './widget-plugin.component';
import { WidgetPluginConfig } from './widget-plugin-config.component';
import { FormsModule, gettext, hookWidget } from '@c8y/ngx-components';
import { LastDeviceService } from './services/last-device.service';
import { BrowserModule } from '@angular/platform-browser';
import { IconDirective } from '@c8y/ngx-components';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [WidgetPluginComponent, WidgetPluginConfig],
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    IconDirective,
    RouterModule,
  ],
  providers: [
    hookWidget({
      id: 'angular.widget.plugin',
      label: gettext('Module Federation widget'),
      description: gettext('Widget added via Module Federation'),
      component: WidgetPluginComponent,
      previewImage: assetPaths.previewImage,
      configComponent: WidgetPluginConfig,
    }),
  ],
})
export class WidgetPluginModule {
  constructor(private lastDeviceService: LastDeviceService) {}
}
