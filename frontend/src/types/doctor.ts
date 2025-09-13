export interface Availability {
  [key: string]: {
    start: string;
    end: string;
  };
}

export interface Doctor {
  userId: string;
  gender: string;
  specialisation: string;
  isActive: boolean;
  avgTimePerPatient: number;
  availability: Availability;
  
  name: string;
  email: string;
  phoneNo: string;
}