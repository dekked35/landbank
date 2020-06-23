import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { SliderModule } from 'primeng/slider';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { PanelModule } from 'primeng/panel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { DropdownModule } from 'primeng/dropdown';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SelectButtonModule } from 'primeng/selectbutton';
import { RatingModule } from 'primeng/rating';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RadioButtonModule } from 'primeng/radiobutton';

// import { ConfirmationService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    InputTextModule,
    KeyFilterModule,
    SliderModule,
    ButtonModule,
    TableModule,
    TabViewModule,
    PanelMenuModule,
    ConfirmDialogModule,
    DialogModule,
    DropdownModule,
    ToggleButtonModule,
    RadioButtonModule,
    // ConfirmationService,
    TooltipModule,
    MessagesModule,
    MessageModule,
    ToastModule,
    PanelModule,
    ProgressBarModule,
    CalendarModule,
    DynamicDialogModule,
    OverlayPanelModule,
    SelectButtonModule,
    RatingModule
  ],
  exports: [
    CommonModule,
    InputTextModule,
    KeyFilterModule,
    SliderModule,
    ButtonModule,
    TableModule,
    SelectButtonModule,
    RadioButtonModule,
    TabViewModule,
    PanelMenuModule,
    ConfirmDialogModule,
    DialogModule,
    DropdownModule,
    ToggleButtonModule,
    CheckboxModule,
    // ConfirmationService,
    TooltipModule,
    MessagesModule,
    MessageModule,
    ToastModule,
    PanelModule,
    ProgressBarModule,
    CalendarModule,
    DynamicDialogModule,
    OverlayPanelModule,
    RatingModule
  ]
})
export class PrimengModule { }
