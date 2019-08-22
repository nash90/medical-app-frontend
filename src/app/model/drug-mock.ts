import { Drug } from './drug';

export const DRUG_LIST: Drug[] = [
  {
    'drug_id': 1,
    'drug_subclass': {
        'drug_subclass_id': 1,
        'drug_class': {
            'drug_class_id': 2,
            'drug_class_name': 'Cardiovascular',
            'drug_class_description': null
        },
        'drug_subclass_name': 'Antihypertensive',
        'drug_subclass_description': null
    },
    'drug_name': 'atenolol',
    'black_box_warning': 'Do not suddenly stop taking this medication if you have coronary artery disease, may cause/worsen heart attack, chest pain, or arrhythmia.'
},
{
    'drug_id': 2,
    'drug_subclass': {
        'drug_subclass_id': 1,
        'drug_class': {
            'drug_class_id': 2,
            'drug_class_name': 'Cardiovascular',
            'drug_class_description': null
        },
        'drug_subclass_name': 'Antihypertensive',
        'drug_subclass_description': null
    },
    'drug_name': 'amlodipine besylate',
    'black_box_warning': '(none)'
}
];
