import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { IManagedObject, InventoryService } from '@c8y/client';
import {
  DynamicComponent,
  OnBeforeSave,
  AlertService,
} from '@c8y/ngx-components';
import { get } from 'lodash';

@Component({
  selector: 'c8y-widget-plugin-config',
  templateUrl: 'widget-plugin-config.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class WidgetPluginConfig
  implements DynamicComponent, OnBeforeSave, OnInit
{
  filteredData: { path: string; value: any; selected?: boolean }[] = [];
  public sampleDevice!: IManagedObject;
  @Input() config: {
    fragments?: { path: string; value: any; selected?: boolean }[];
  } = {};

  constructor(
    private alert: AlertService,
    private inventoryService: InventoryService
  ) {}

  onBeforeSave(config: any): boolean {
    // if (config.trim() === '') {
    //   this.alert.warning('Please enter a valid text.');
    //   return false;
    // }
    return true;
  }
  async ngOnInit() {
    const res = await this.inventoryService.list({
      fragmentType: 'c8y_IsDevice',
      pageSize: 1,
    });
    console.log('config device', res.data);

    if (res.data.length) {
      this.sampleDevice = res.data[0];
      this.filteredData = this.filterPaths(
        this.flattenObject(this.sampleDevice),
        [
          'id',
          'self',
          'name',
          'owner',
          'c8y_SupportedOperations',
          'childDevices',
          'deviceParents',
          'additionParents',
          'assetParents',
          'childAssets',
          'childAdditions',
        ].map((a) => a.toLowerCase())
      );
      if (this.filteredData.length && this.config?.fragments?.length) {
        this.filteredData = this.filteredData.map((a) => {
          const selected = this.config.fragments!.some(
            (b) => a.path === b.path
          );
          a.selected = selected;
          return a;
        });
      }
    }
  }
  onCheckboxChange(path: string, value: any) {
    console.info({ path, value });
    if (!this.config?.fragments?.length) {
      this.config.fragments = [];
    }
    const index = this.config.fragments.findIndex((a) => a.path === path);
    if (index >= 0) {
      this.config.fragments.splice(index, 1);
    } else {
      this.config.fragments.push({ path: path, value: value, selected: true });
    }
    console.info('config', this.config.fragments);
  }

  flattenObject(
    obj: any,
    parentKey = '',
    result: { path: string; value: any }[] = []
  ): { path: string; value: any }[] {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const path = parentKey ? `${parentKey}.${key}` : key;
        const value = obj[key];
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          this.flattenObject(value, path, result);
        } else {
          result.push({ path, value });
        }
      }
    }
    return result;
  }

  filterPaths(
    data: { path: string; value: any }[],
    blacklist: string[]
  ): { path: string; value: any }[] {
    return data.filter(
      (item) => !blacklist.some((a) => item.path.toLowerCase().includes(a))
    );
  }
}
