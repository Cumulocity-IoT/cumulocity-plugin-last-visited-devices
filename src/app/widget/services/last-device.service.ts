import { Injectable } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import {
  ContextData,
  RouterTabsResolver,
  TabsService,
  ContextRouteService,
} from '@c8y/ngx-components';
import { filter, ReplaySubject } from 'rxjs';
import { _LocalStorageKeys } from '../const/localstorage.const';
import { IManagedObject, InventoryService } from '@c8y/client';

@Injectable({
  providedIn: 'root',
})
export class LastDeviceService {
  private activatedContextData!: ContextData;
  private upperLimitVisitedDevices = 500;
  private $deviceIdHistory: ReplaySubject<string[]> = new ReplaySubject(1);
  private deviceIdHistory: string[] = [];

  constructor(
    private inventoryService: InventoryService,
    private router: Router,
    private contextRouteService: ContextRouteService
  ) {
    const history =
      localStorage.getItem(_LocalStorageKeys.deviceHistory) || '[]';
    try {
      const historyArray: string[] = JSON.parse(history);
      this.deviceIdHistory = historyArray;
      this.$deviceIdHistory.next(this.deviceIdHistory);
    } catch (e) {}
    this.router.events
      .pipe(filter((event) => event instanceof ActivationEnd))
      .subscribe((event: ActivationEnd) => {
        //@ts-ignore
        const currentContext = this.contextRouteService.getContextDataSnapshot(
          event.snapshot
        );
        if (currentContext) {
          this.activatedContextData = currentContext as ContextData;
          if (this.activatedContextData.context === 'device/:id') {
            console.log('DEVICE', this.activatedContextData);
            this.addDeviceToWatchHistory(
              this.activatedContextData.contextData as IManagedObject
            );
          }
        }
      });
  }

  public async addDeviceToWatchHistory(device: IManagedObject) {
    this.deviceIdHistory = this.deviceIdHistory.filter((a) => device.id !== a);
    this.deviceIdHistory.unshift(device.id);
    if (this.deviceIdHistory.length > this.upperLimitVisitedDevices) {
      this.deviceIdHistory.splice(this.upperLimitVisitedDevices);
    }
    localStorage.setItem(
      _LocalStorageKeys.deviceHistory,
      JSON.stringify(this.deviceIdHistory)
    );
    this.$deviceIdHistory.next(this.deviceIdHistory);
  }

  public getDeviceWatchHistory() {
    return this.$deviceIdHistory;
  }
}
