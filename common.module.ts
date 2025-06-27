import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { DesignSystemModule } from "../design-system/design-system.module";
import { DatePickerComponent } from "./components/date-picker/date-picker.component";
import { FavoriteButtonComponent } from "./components/favorite-button/favorite-button.component";
import { FooterComponent } from "./components/footer/footer.component";
import { NavbarLocationDropdownComponent } from "./components/location-dropdown/location-dropdown.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { RoomShowcaseItemCardComponent } from "./components/room-showcase-item-card/room-showcase-item-card.component";
import { RoomShowcaseItemSuccessSharedModalComponent } from "./components/room-showcase-item-success-shared-modal/room-showcase-item-success-shared-modal.component";
import { NavbarSearchComponent } from "./components/search/search.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";


@NgModule({
  declarations: [
    SidebarComponent,
    NavbarComponent,
    DatePickerComponent,
    NavbarSearchComponent,
    NavbarLocationDropdownComponent,
    FooterComponent,
    RoomShowcaseItemCardComponent,
    RoomShowcaseItemSuccessSharedModalComponent,
    FavoriteButtonComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CollapseModule.forRoot(),
    BsDatepickerModule.forRoot(),
    DesignSystemModule,
    RouterModule,
    FontAwesomeModule,
  ],
  exports: [
    SidebarComponent,
    NavbarComponent,
    FooterComponent,
    DatePickerComponent,
    NavbarLocationDropdownComponent,
    RoomShowcaseItemCardComponent,
    FavoriteButtonComponent,
  ],
})
export class ClinaCommonModule {}

