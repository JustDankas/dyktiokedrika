export interface IProgram {
  id: number;
  trainer_id: number;
  title: string;
  description: string;
  type: string;
  price: number;
  is_group: boolean;
  max_size: number;
  image: Blob;
}

export interface IProgramTrainer {
  id: number;
  name: string;
  surname: string;
}

export interface IProgramCreationRequest extends Omit<IProgram, "id"> {
  trainer_id: number;
}
