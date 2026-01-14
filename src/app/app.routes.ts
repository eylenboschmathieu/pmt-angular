import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';

// Components
import { HomeComponent } from './components/home/home';
import { LoginComponent } from './components/login/login';
import { UsersComponent } from './components/users/users';
import { UserNewComponent } from './components/user.new/user.new';
import { UserUpdateComponent } from './components/user.update/user.update';
import { RolesComponent } from './components/roles/roles';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized';
import { ParamedicAcceptedComponent } from './components/paramedic-accepted/paramedic-accepted';
import { ParamedicRequestedComponent } from './components/paramedic-requested/paramedic-requested';
import { ManagementPlanningComponent } from './components/management-planning/management-planning';
import { Error500 } from './components/error500/error500';
import { ManagementOverviewComponent } from './components/management-overview/management-overview';

export const routes: Routes = [
    {
        component: LoginComponent,
        path: "login"
    },
    {
        component: HomeComponent,
        path: "home",
        canActivate: [AuthGuard]
    },
    {
        component: ParamedicRequestedComponent,
        path: "paramedic/requested",
        canActivate: [AuthGuard]
    },
    {
        component: ParamedicAcceptedComponent,
        path: "paramedic/accepted",
        canActivate: [AuthGuard]
    },
    {
        component: UsersComponent,
        path: "users",
        canActivate: [AuthGuard]
    },
    {
        component: ManagementPlanningComponent,
        path: "management/planning",
        canActivate: [AuthGuard]
    },
    {
        component: ManagementOverviewComponent,
        path: "management/overview",
        canActivate: [AuthGuard]
    },
    {
        component: UserNewComponent,
        path: "user/new",
        canActivate: [AuthGuard]
    },
    {
        component: UserUpdateComponent,
        path: "user",
        canActivate: [AuthGuard]
    },
    {
        component: RolesComponent,
        path: "roles",
        canActivate: [AuthGuard]
    },
    {
        component: UnauthorizedComponent,
        path: "unauthorized"
    },
    {
        component: Error500,
        path: "500"
    },
    {
        path: "**",
        redirectTo: 'login'
    }
];
