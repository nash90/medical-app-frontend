import { FormControl } from '@angular/forms';

export class EighteenPlusValidator {
        static validEighteenPlus (fc: FormControl) {
                var systemDate = new Date();
                if (systemDate.getFullYear() - Number(fc.value.substring(0,4)) < 18) {
                        return {
                                validEighteenPlus: true
                        };
                } else {
                        return null
                }
        }
}