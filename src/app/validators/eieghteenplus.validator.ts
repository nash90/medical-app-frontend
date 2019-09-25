import { FormControl } from '@angular/forms';

export class EighteenPlusValidator {
        static validEighteenPlus (fc: FormControl) {
                var systemDate = new Date();
                if (systemDate.getFullYear() - Number(fc.value.substring(0,4)) > 18) {
                        return null
                } else if (
                        (systemDate.getFullYear() - Number(fc.value.substring(0,4)) == 18 && 
                        (systemDate.getMonth() + 1 > Number(fc.value.substring(5,7)) || 
                        (systemDate.getMonth() + 1 == Number(fc.value.substring(5,7)) && systemDate.getDate() >= Number(fc.value.substring(8,10)))
                        ) 
                        )
                ) {
                        return null
                } else {
                        return {
                                validEighteenPlus: true
                        }
                }
        }
}