
import { z } from 'zod';

export const rideRequestSchema = z.object({
  body: z.object({
    pickupLocation: z.string().min(1, 'Pickup location is required'),
    destination: z.string().min(1, 'Destination is required'),
  }),
});



