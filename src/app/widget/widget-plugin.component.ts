import { Component, Input } from '@angular/core';
import { LastDeviceService } from './services/last-device.service';
import { IManagedObject, InventoryService, QueriesUtil } from '@c8y/client';
import { _CustomDevice, _LocalstorageDevice } from './model/last-device.model';
import { get } from 'lodash';

@Component({
  selector: 'c8y-widget-plugin',
  templateUrl: 'widget-plugin.component.html',
  styleUrls: ['./widget-plugin.component.css'],
})
export class WidgetPluginComponent {
  public devices: _CustomDevice[] = [];

  @Input() config: any;
  constructor(
    private lastDeviceService: LastDeviceService,
    private inventoryService: InventoryService
  ) {}
  ngOnInit() {
    console.log('CONFIG', this.config);
    this.lastDeviceService.getDeviceWatchHistory().subscribe({
      next: async (localStorageDevices: _LocalstorageDevice[]) => {
        if (localStorageDevices.length === 0) {
          return;
        }
        try {
          const res = await this.inventoryService.listQuery(
            {
              __or: Object.values(localStorageDevices).map((a) => ({
                id: a.id,
              })),
            },
            {
              pageSize: 100,
              withTotalPages: true,
            }
          );
          this.devices = res.data.map((device) => ({
            ...device,
            ...(localStorageDevices.find(
              (a) => a.id === device.id
            ) as _LocalstorageDevice),
          }));

          if (this.config?.fragments?.length) {
            for (const device of this.devices) {
              for (const value of this.config.fragments) {
                if (!device?.extraData?.length) {
                  device.extraData = [];
                }
                const data = get(device, value.path);
                if (typeof data !== 'undefined') {
                  device.extraData.push(data);
                }
              }
            }
          }
          console.log('FRAGMETNS', this.devices);
        } catch (e) {}
      },
    });
  }
}
