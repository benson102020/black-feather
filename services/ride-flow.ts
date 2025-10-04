import { supabase, getSupabaseClient } from './supabase';

export const rideFlowService = {
  // Create a new ride request
  async createRideRequest(rideData: {
    passenger_id: string;
    pickup_address: string;
    pickup_lat: number;
    pickup_lng: number;
    destination_address: string;
    destination_lat: number;
    destination_lng: number;
    car_type?: string;
    customer_name?: string;
    customer_phone?: string;
  }) {
    try {
      const client = getSupabaseClient();
      if (!client) {
        return {
          success: true,
          data: {
            id: 'RD' + Date.now(),
            ...rideData,
            status: 'pending',
            created_at: new Date().toISOString()
          }
        };
      }

      // Calculate distance and fare
      const distance = this.calculateDistance(
        rideData.pickup_lat,
        rideData.pickup_lng,
        rideData.destination_lat,
        rideData.destination_lng
      );

      const fare = this.calculateFare(distance, rideData.car_type || 'economy');

      const { data, error } = await client
        .from('rides')
        .insert([{
          passenger_id: rideData.passenger_id,
          pickup_address: rideData.pickup_address,
          pickup_lat: rideData.pickup_lat,
          pickup_lng: rideData.pickup_lng,
          destination_address: rideData.destination_address,
          dropoff_address: rideData.destination_address,
          destination_lat: rideData.destination_lat,
          destination_lng: rideData.destination_lng,
          car_type: rideData.car_type || 'economy',
          customer_name: rideData.customer_name,
          customer_phone: rideData.customer_phone,
          distance_km: distance,
          base_fare: fare.base_fare,
          distance_fare: fare.distance_fare,
          time_fare: fare.time_fare,
          total_fare: fare.total_fare,
          status: 'pending',
          requested_at: new Date().toISOString(),
          payment_completed: false
        }])
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      console.error('Create ride request error:', error);
      return { success: false, error: error.message };
    }
  },

  // Driver accepts ride
  async acceptRide(rideId: string, driverId: string) {
    try {
      const client = getSupabaseClient();
      if (!client) {
        return { success: true, data: { message: 'Ride accepted (demo)' } };
      }

      const { data, error } = await client
        .from('rides')
        .update({
          driver_id: driverId,
          status: 'accepted',
          accepted_at: new Date().toISOString()
        })
        .eq('id', rideId)
        .eq('status', 'pending')
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      console.error('Accept ride error:', error);
      return { success: false, error: error.message };
    }
  },

  // Driver arrives at pickup
  async arriveAtPickup(rideId: string) {
    try {
      const client = getSupabaseClient();
      if (!client) {
        return { success: true, data: { message: 'Arrived at pickup (demo)' } };
      }

      const { data, error } = await client
        .from('rides')
        .update({
          status: 'arrived',
          pickup_at: new Date().toISOString()
        })
        .eq('id', rideId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      console.error('Arrive at pickup error:', error);
      return { success: false, error: error.message };
    }
  },

  // Start ride
  async startRide(rideId: string) {
    try {
      const client = getSupabaseClient();
      if (!client) {
        return { success: true, data: { message: 'Ride started (demo)' } };
      }

      const { data, error } = await client
        .from('rides')
        .update({
          status: 'in_progress',
          started_at: new Date().toISOString()
        })
        .eq('id', rideId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      console.error('Start ride error:', error);
      return { success: false, error: error.message };
    }
  },

  // Complete ride
  async completeRide(rideId: string) {
    try {
      const client = getSupabaseClient();
      if (!client) {
        return { success: true, data: { message: 'Ride completed (demo)' } };
      }

      const { data, error } = await client
        .from('rides')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', rideId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      console.error('Complete ride error:', error);
      return { success: false, error: error.message };
    }
  },

  // Complete payment
  async completePayment(rideId: string, paymentMethod: string) {
    try {
      const client = getSupabaseClient();
      if (!client) {
        return { success: true, data: { message: 'Payment completed (demo)' } };
      }

      // Get ride details
      const { data: ride, error: rideError } = await client
        .from('rides')
        .select('*')
        .eq('id', rideId)
        .single();

      if (rideError) throw rideError;

      // Create payment record
      const { data: payment, error: paymentError } = await client
        .from('payments')
        .insert([{
          ride_id: rideId,
          user_id: ride.passenger_id,
          amount: ride.total_fare,
          payment_method: paymentMethod,
          status: 'completed',
          processed_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (paymentError) throw paymentError;

      // Update ride payment status
      await client
        .from('rides')
        .update({
          payment_completed: true,
          payment_method: paymentMethod
        })
        .eq('id', rideId);

      return { success: true, data: payment };
    } catch (error: any) {
      console.error('Complete payment error:', error);
      return { success: false, error: error.message };
    }
  },

  // Get available drivers near location
  async getAvailableDrivers(lat: number, lng: number, radius: number = 5) {
    try {
      const client = getSupabaseClient();
      if (!client) {
        return {
          success: true,
          data: [
            {
              id: '11111111-1111-1111-1111-111111111111',
              name: '在線司機',
              phone: '0911111111',
              rating: 4.9,
              is_online: true
            }
          ]
        };
      }

      const { data, error } = await client
        .from('drivers')
        .select('*')
        .eq('is_online', true)
        .eq('verification_status', 'approved');

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      console.error('Get available drivers error:', error);
      return { success: false, error: error.message };
    }
  },

  // Get ride history
  async getRideHistory(userId: string, role: string = 'passenger') {
    try {
      const client = getSupabaseClient();
      if (!client) {
        return { success: true, data: [] };
      }

      const column = role === 'driver' ? 'driver_id' : 'passenger_id';

      const { data, error } = await client
        .from('rides')
        .select('*')
        .eq(column, userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      console.error('Get ride history error:', error);
      return { success: false, error: error.message };
    }
  },

  // Calculate distance between two points (Haversine formula)
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  // Calculate fare based on distance and car type
  calculateFare(distanceKm: number, carType: string) {
    const baseFare = 85;
    const perKmRate = carType === 'premium' ? 15 : 12;
    const timeRate = 2.5;

    const distanceFare = distanceKm * perKmRate;
    const estimatedMinutes = distanceKm * 3; // Assume 20 km/h average
    const timeFare = estimatedMinutes * timeRate;

    const totalFare = baseFare + distanceFare + timeFare;

    return {
      base_fare: baseFare,
      distance_fare: distanceFare,
      time_fare: timeFare,
      total_fare: Math.round(totalFare)
    };
  }
};

export default rideFlowService;
