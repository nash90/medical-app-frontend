import { FormControl } from '@angular/forms';

export class BirthdateValidator {
        

        // date format: dd/mm/yy
        /*static ptDate(control: FormControl): { [key: string]: any } {
            let ptDatePattern =  /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g;
     
            if (!control.value.match(ptDatePattern))
                return { "ptDate": true };
     
            return null;
        }*/
     
        // date formate: mm/dd/yy
        static validUsDate(control: FormControl): { [key: string]: any } {
                let DatePattern = /^\d{4}-\d{2}-\d{2}$/;

                if (!control.value.match(DatePattern))
                    return { "validUsDate": true };
         
                return null;
        }
     }