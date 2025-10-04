import { supabase, getSupabaseClient } from './supabase';

export const driverStatusService = {
  // Go online
  async goOnline(driverId: string, location?: { lat: number; lng: number }) {
    try {
      const client = getSupabaseClient();
      if (!client) {
        console.log('Demo mode: Driver going online');
        return {
          success: true,
          data: { status: 'online', message: 'Driver is now online' }
        };
      }

      const updateData: any = {
        is_online: true,
        work_status: 'online',
        last_seen: new Date().toISOString()
      };

      if (location) {
        updateData.current_lat = location.lat;
        updateData.current_lng = location.lng;
      }

      const { data, error } = await client
        .from('drivers')
        .update(updateData)
        .eq('id', driverId)
        .select()
        .single();

      if (error) throw error;

      // Update user status as well
      await client
        .from('users')
        .update({ status: 'active' })
        .eq('id', driverId);

      return {
        success: true,
        data: { ...data, message: 'Driver is now online' }
      };
    } catch (error: any) {
      console.error('Go online error:', error);
      return {
        success: false,
        error: error.message || 'Failed to go online'
      };
    }
  },

  // Go offline
  async goOffline(driverId: string) {
    try {
      const client = getSupabaseClient();
      if (!client) {
        console.log('Demo mode: Driver going offline');
        return {
          success: true,
          data: { status: 'offline', message: 'Driver is now offline' }
        };
      }

      const { data, error } = await client
        .from('drivers')
        .update({
          is_online: false,
          work_status: 'offline',
          last_seen: new Date().toISOString()
        })
        .eq('id', driverId)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: { ...data, message: 'Driver is now offline' }
      };
    } catch (error: any) {
      console.error('Go offline error:', error);
      return {
        success: false,
        error: error.message || 'Failed to go offline'
      };
    }
  },

  // Update driver location
  async updateLocation(driverId: string, location: { lat: number; lng: number }) {
    try {
      const client = getSupabaseClient();
      if (!client) {
        return { success: true, data: { message: 'Location updated (demo)' } };
      }

      const { data, error } = await client
        .from('drivers')
        .update({
          current_lat: location.lat,
          current_lng: location.lng,
          last_seen: new Date().toISOString()
        })
        .eq('id', driverId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      console.error('Update location error:', error);
      return { success: false, error: error.message };
    }
  },

  // Get driver status
  async getDriverStatus(driverId: string) {
    try {
      const client = getSupabaseClient();
      if (!client) {
        return {
          success: true,
          data: {
            is_online: false,
            work_status: 'offline',
            current_lat: null,
            current_lng: null
          }
        };
      }

      const { data, error } = await client
        .from('drivers')
        .select('is_online, work_status, current_lat, current_lng, last_seen')
        .eq('id', driverId)
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      console.error('Get driver status error:', error);
      return { success: false, error: error.message };
    }
  },

  // Get all online drivers
  async getOnlineDrivers() {
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
              is_online: true,
              rating: 4.9
            }
          ]
        };
      }

      const { data, error } = await client
        .from('drivers')
        .select('id, name, phone, is_online, current_lat, current_lng, work_status')
        .eq('is_online', true)
        .eq('verification_status', 'approved');

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      console.error('Get online drivers error:', error);
      return { success: false, error: error.message };
    }
  },

  // Toggle driver status (online/offline)
  async toggleStatus(driverId: string, location?: { lat: number; lng: number }) {
    try {
      // Get current status
      const statusResult = await this.getDriverStatus(driverId);

      if (!statusResult.success) {
        throw new Error(statusResult.error);
      }

      const currentStatus = statusResult.data.is_online;

      // Toggle status
      if (currentStatus) {
        return await this.goOffline(driverId);
      } else {
        return await this.goOnline(driverId, location);
      }
    } catch (error: any) {
      console.error('Toggle status error:', error);
      return {
        success: false,
        error: error.message || 'Failed to toggle status'
      };
    }
  }
};

export default driverStatusService;
