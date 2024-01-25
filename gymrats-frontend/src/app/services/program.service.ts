import { Injectable } from '@angular/core';

export interface ITrainer {
  name: string;
  surname: string;
}
export interface IProgram {
  id: number;
  trainer: ITrainer;
  title: string;
  image: string;
  description: string;
  type: string;
  price: number;
  is_group: boolean;
  max_size: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProgramService {
  programs: IProgram[] = [
    {
      id: 1,
      trainer: {
        name: 'Mixalhs',
        surname: 'Fillipakhs',
      },
      image:
        'https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg',

      is_group: true,
      title: 'Some title',
      description: 'Some description',
      type: 'Pilates',
      price: 20,
      max_size: 20,
    },
  ];
  constructor() {}
}
