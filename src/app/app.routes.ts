import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';

// Components
import { HomeComponent } from './components/home/home';
import { LoginComponent } from './components/login/login';
import { UsersComponent } from './components/users/users';
import { UsersCreateComponent } from './components/users.create/users.create';
import { UsersUpdateComponent } from './components/users.update/users.update';
import { RolesComponent } from './components/roles/roles';
import { UnauthorizedComponent } from './components/unauthorized.component/unauthorized.component';
import { ParamedicAcceptedComponent } from './components/paramedic-accepted/paramedic-accepted';
import { ParamedicRequestedComponent } from './components/paramedic-requested/paramedic-requested';
import { ManagementPlanningComponent } from './components/management-planning/management-planning';

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
        component: ManagementPlanningComponent,
        path: "management/planning",
        canActivate: [AuthGuard]
    },
    {
        component: UsersComponent,
        path: "users",
        canActivate: [AuthGuard]
    },
    {
        component: UsersCreateComponent,
        path: "users/new",
        canActivate: [AuthGuard]
    },
    {
        component: UsersUpdateComponent,
        path: "user/:id",
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
        path: "**",
        redirectTo: 'login'
    }
];
