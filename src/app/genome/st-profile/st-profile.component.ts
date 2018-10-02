import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { zip } from 'rxjs/observable/zip';

import { GoogleCharts } from '../../../app/core/services/google-charts.service';
import { MistApi, SignalProfileCount } from '../../../app/core/services/mist-api.service';

const ucFirst = (value) => value[0].toUpperCase() + value.substr(1);

const COLORS_BY_KIND = {
  chemotaxis: '#ef5b5b',
  ecf: '#5f455b',
  input: '#ffba49',
  output: '#20a39e',
  receiver: '#0075f2',
  transmitter: '#a5907e',
  unknown: '#a4a9ad',
};

// We increase the max axis value by this amount to improve the graph appearance
// with some "headroom" above the tallest bar.
const AXIS_COUNT_EXTRA = 5;

@Component({
  selector: 'mist-st-profile',
  styleUrls: ['./st-profile.scss'],
  templateUrl: './st-profile.pug',
})
export class StProfileComponent implements OnInit {
  @Input()
  genomeVersion: number;

  legendHidden = true;
  height = 500;
  width = 500;

  private options = {
    chartArea: {
      height: '60%',
      left: '10%',
      top: '8%',
      width: '85%',
    },
    hAxis: {
      slantedText: true,
      slantedTextAngle: 60,
    },
    height: this.height,
    legend: {
      position: 'none',
    },
    title: 'Signal transduction profile',
    titleTextStyle: {
      fontSize: 16,
    },
    vAxis: {
      format: 'short',
      viewWindow: {
        // This will be changed dynamically after the profile is loaded
        max: 0,
        min: 0,
      },
      viewWindowMode: 'explicit',
    },
    width: this.width,
  };

  private chartElement: HTMLElement;

  constructor(
    private mistApi: MistApi,
    private googleCharts: GoogleCharts,
    private element: ElementRef,
  ) {}

  ngOnInit() {
    this.chartElement = this.element.nativeElement.querySelector('.chart');
    this.fetchProfileDataAndRenderChart().subscribe();
  }

  private fetchProfileDataAndRenderChart() {
    return zip(
      this.mistApi.fetchStProfileData(this.genomeVersion),
      this.googleCharts.loaded(),
    )
      .take(1)
      .do(([profile]: [SignalProfileCount[], boolean]) => {
        const dataTable = this.createDataTable();
        dataTable.addRows(this.createDataRowsForProfile(profile));

        const chart = new (<any>window).google.visualization.ColumnChart(this.chartElement);
        (<any>window).google.visualization.events.addListener(chart, 'ready', () => {
          this.legendHidden = false;
        });
        chart.draw(dataTable, this.options);
      });
  }

  private createDataTable() {
    const table = new (<any>window).google.visualization.DataTable();
    table.addColumn('string', 'Function');
    table.addColumn('number', 'Domains');
    table.addColumn({type: 'string', role: 'style'});
    return table;
  }

  private createDataRowsForProfile(profile) {
    const maxNumDomains = this.getMaxNumDomains(profile);
    this.setAxisMax(maxNumDomains + AXIS_COUNT_EXTRA);

    return profile.map((row) => [
      row.function === 'ecf' ? 'ECF' : ucFirst(row.function),
      row.numDomains,
      COLORS_BY_KIND[row.kind],
    ]);
  }

  private getMaxNumDomains(profile: SignalProfileCount[]): number {
    return profile.reduce((acc, next) => Math.max(acc, next.numDomains), 0);
  }

  private setAxisMax(max: number) {
    this.options.vAxis.viewWindow.max = max;
  }
}
