import { Ticket } from "./ticket.interface";

export interface TicketHistory {
  _id: string;
  ticketId: string;
  changedBy: {
    _id: string;
    name: string;
    email: string;
  };
  changeType: TicketChangeType;
  changes: {
    previous: Partial<Ticket>;
    current: Partial<Ticket>;
  };
  notes?: string;
  timestamp: Date;
}

export type TicketChangeType = 'CREATED' | 'UPDATED' | 'STATUS_CHANGE' | 'PRIORITY_CHANGE' | 'ASSIGNMENT_CHANGE'; 