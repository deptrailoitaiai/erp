import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { AnnualFormService } from "../service/annualForm.service";

@Injectable()
export class AnnualFormActiveGuard implements CanActivate {
    constructor(private readonly annualFormService: AnnualFormService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return 
    }
} 