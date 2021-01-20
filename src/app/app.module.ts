import { OrangeComponent } from './realty-detail/orange/orange.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { NgApexchartsModule} from 'ng-apexcharts';

import { AppComponent } from './app.component';
import { PrimengModule } from './primeng/primeng.module';
import { TopBarComponent } from './top-bar/top-bar.component';
import { AreaComponent } from './realty-detail/area/area.component';
import { ProductComponent } from './realty-detail/product/product.component';
import { SpendingsComponent } from './realty-detail/spendings/spendings.component';
import { ConclusionComponent } from './realty-detail/conclusion/conclusion.component';
import { MainLayoutComponent } from './realty-detail/main-layout/main-layout.component';
import { ProductBasicSettingVillageComponent } from './realty-detail/product/components/setting/product-basic-setting-village/product-basic-setting-village.component';
import { ProductBasicSummaryVillageComponent } from './realty-detail/product/components/summary/product-basic-summary-village/product-basic-summary-village.component';
import { CustomSliderComponent } from './shared/custom-slider/custom-slider.component';
import { ProductBasicSettingTownhouseComponent } from './realty-detail/product/components/setting/product-basic-setting-townhouse/product-basic-setting-townhouse.component';
import { ProductBasicSummaryTownhouseComponent } from './realty-detail/product/components/summary/product-basic-summary-townhouse/product-basic-summary-townhouse.component';
import { ProductBasicSummaryHotelComponent } from './realty-detail/product/components/summary/product-basic-summary-hotel/product-basic-summary-hotel.component';
import { ProductBasicSettingHotelComponent } from './realty-detail/product/components/setting/product-basic-setting-hotel/product-basic-setting-hotel.component';
import { ProductBasicSettingCommunityComponent } from './realty-detail/product/components/setting/product-basic-setting-community/product-basic-setting-community.component';
import { StoreModule } from '@ngrx/store';
import { coreReducers, metaReducers } from './core/reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { ProductBasicTypeComponent } from './realty-detail/product/components/product-basic-type/product-basic-type.component';
import { ChartsComponent } from './shared/charts/charts.component';
import { LoadingComponent } from './shared/loading/loading.component';
import { StandardSizeComponent } from './shared/standard-size/standard-size.component';
import { RateReturnComponent } from './realty-detail/rate-return/rate-return.component';
import { ImplicitCostComponent } from './realty-detail/implicit-cost/implicit-cost.component';
import { ContructionCostTableComponent } from './shared/contruction-cost-table/contruction-cost-table.component';
import { ProfitTableComponent } from './shared/profit-table/profit-table.component';
import {NgxMaterialToolsModule} from 'ngx-material-tools';
import {NumberCommaDirective} from './shared/number-comma.directive'

@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
    AreaComponent,
    ProductComponent,
    ConclusionComponent,
    MainLayoutComponent,
    SpendingsComponent,
    ProductBasicSettingVillageComponent,
    ProductBasicSummaryVillageComponent,
    CustomSliderComponent,
    ProductBasicSettingTownhouseComponent,
    ProductBasicSummaryTownhouseComponent,
    ProductBasicSummaryHotelComponent,
    ProductBasicSettingHotelComponent,
    ProductBasicSettingCommunityComponent,
    ProductBasicTypeComponent,
    ChartsComponent,
    LoadingComponent,
    StandardSizeComponent,
    RateReturnComponent,
    ImplicitCostComponent,
    ContructionCostTableComponent,
    ProfitTableComponent,
    NumberCommaDirective,
    OrangeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PrimengModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    NgxMaterialToolsModule,
    StoreModule.forRoot(coreReducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      }
    }),
    !environment.production ? StoreDevtoolsModule.instrument() : []
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
