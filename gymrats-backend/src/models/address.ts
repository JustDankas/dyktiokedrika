export interface IAddress {
  id: number;
  user_id: number;
  country: string;
  city: string;
  street: string;
}

export interface IAddressCreationRequest extends Omit<IAddress, "id"> {}
