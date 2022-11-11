import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

import { CommonModule } from '@angular/common';
import { UserNavComponent } from './components/user-nav/user-nav.component';
import { RouterModule } from '@angular/router';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogDataComponent } from './components/dialog-data/dialog-data.component';

@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    RouterModule,
    MatTableModule,
    MatSortModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatDialogModule,
  ],
  exports: [
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    UserNavComponent,
    MatTableModule,
    MatSortModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatDialogModule,
  ],
  providers: [],
  declarations: [UserNavComponent, DialogDataComponent],
})
export class SharedModule {}
