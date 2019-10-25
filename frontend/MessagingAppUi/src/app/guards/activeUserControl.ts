import { CanDeactivate } from "@angular/router";
import { Observable } from "rxjs/Observable";

export interface IActiveUserControl {
    userControl(): boolean | Observable<boolean>;
}

export class ActiveUserControl implements CanDeactivate<IActiveUserControl> {
    canDeactivate(component: IActiveUserControl): boolean | Observable<boolean> {
        if (component.userControl()) {
            return true;
        }
    }
}