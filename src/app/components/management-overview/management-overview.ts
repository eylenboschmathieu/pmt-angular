import { Component } from '@angular/core';
import { OverviewDataDTO, ShiftService } from '../../services/shift-service';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-management-overview',
    imports: [RouterLink, DatePipe],
    templateUrl: './management-overview.html',
    styleUrl: './management-overview.css',
})
export class ManagementOverviewComponent {
    constructor(private shiftService: ShiftService) { }

    overview_data!: OverviewDataDTO

    ngOnInit() {
        this.shiftService.get_overview().subscribe({
            next: (res: OverviewDataDTO) => this.overview_data = res
        })
    }
}
