import { Component, Input } from '@angular/core';
import { LastDeviceService } from './services/last-device.service';
import { IManagedObject, InventoryService, QueriesUtil } from '@c8y/client';

@Component({
  selector: 'c8y-widget-plugin',
  templateUrl: 'widget-plugin.component.html',
  styleUrls: ['./widget-plugin.component.css'],
})
export class WidgetPluginComponent {
  public devices: IManagedObject[] = [];
  constructor(
    private lastDeviceService: LastDeviceService,
    private inventoryService: InventoryService
  ) {}
  ngOnInit() {
    const filter: object = {
      pageSize: 100,
      withTotalPages: true,
    };
    this.lastDeviceService.getDeviceWatchHistory().subscribe({
      next: async (deviceIds: string[]) => {
        try {
          const res = await this.inventoryService.listQuery(
            { __or: Object.values(deviceIds).map((a) => ({ id: a })) },
            {
              pageSize: 100,
              withTotalPages: true,
            }
          );
          this.devices = res.data;
        } catch (e) {}
      },
    });
  }
}
