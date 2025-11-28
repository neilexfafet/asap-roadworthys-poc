export interface FormAttachment {
  uuid: string;
  name: string;
  active: number;
  edit_date: string;
  document_template_uuid: string;
  badge_name: string;
  can_be_used_independently: string;
  badge_mandatory_state: string;
  template_fields: boolean;
}

export interface Message {
  id: number;
  booking_id: number;
  sender: string;
  content: string;
  created_at?: Date;
}

export interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  created_at?: Date;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Booking {
  id: number;
  user_id: number;
  users: User;
  reference: string;
  service_type: string;
  description: string;
  status: string;
  vehicle_id: number;
  vehicles: Vehicle;
  messages: Message[];
  created_at?: Date;
}