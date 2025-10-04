import { supabase, getSupabaseClient } from './supabase';

export const phoneVerificationService = {
  // Send verification code
  async sendVerificationCode(phoneNumber: string) {
    try {
      const client = getSupabaseClient();
      if (!client) {
        console.log('Demo mode: Verification code would be 123456');
        return {
          success: true,
          data: { message: 'Verification code sent (Demo: 123456)' }
        };
      }

      // Generate 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Delete old codes for this phone number
      await client
        .from('verification_codes')
        .delete()
        .eq('phone_number', phoneNumber);

      // Insert new code
      const { data, error } = await client
        .from('verification_codes')
        .insert([{
          phone_number: phoneNumber,
          code: code,
          expires_at: expiresAt.toISOString(),
          verified: false,
          attempts: 0
        }])
        .select()
        .single();

      if (error) throw error;

      // In production, send SMS here via Twilio/AWS SNS
      console.log(`Verification code for ${phoneNumber}: ${code}`);

      return {
        success: true,
        data: {
          message: 'Verification code sent successfully',
          // In demo, return code for testing
          code: code
        }
      };
    } catch (error: any) {
      console.error('Send verification code error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send verification code'
      };
    }
  },

  // Verify code
  async verifyCode(phoneNumber: string, code: string) {
    try {
      const client = getSupabaseClient();
      if (!client) {
        return {
          success: true,
          data: { verified: code === '123456' }
        };
      }

      // Get the latest code for this phone
      const { data: codeData, error: fetchError } = await client
        .from('verification_codes')
        .select('*')
        .eq('phone_number', phoneNumber)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (fetchError || !codeData) {
        return {
          success: false,
          error: 'No verification code found. Please request a new one.'
        };
      }

      // Check if expired
      if (new Date(codeData.expires_at) < new Date()) {
        return {
          success: false,
          error: 'Verification code has expired. Please request a new one.'
        };
      }

      // Check attempts
      if (codeData.attempts >= 3) {
        return {
          success: false,
          error: 'Too many attempts. Please request a new code.'
        };
      }

      // Verify code
      if (codeData.code !== code) {
        // Increment attempts
        await client
          .from('verification_codes')
          .update({ attempts: codeData.attempts + 1 })
          .eq('id', codeData.id);

        return {
          success: false,
          error: 'Invalid verification code. Please try again.'
        };
      }

      // Mark as verified
      const { error: updateError } = await client
        .from('verification_codes')
        .update({ verified: true })
        .eq('id', codeData.id);

      if (updateError) throw updateError;

      // Update user phone_verified status
      await client
        .from('users')
        .update({ phone_verified: true })
        .eq('phone_number', phoneNumber);

      return {
        success: true,
        data: { verified: true, message: 'Phone verified successfully' }
      };
    } catch (error: any) {
      console.error('Verify code error:', error);
      return {
        success: false,
        error: error.message || 'Failed to verify code'
      };
    }
  },

  // Check if phone is verified
  async isPhoneVerified(phoneNumber: string) {
    try {
      const client = getSupabaseClient();
      if (!client) {
        return { success: true, data: { verified: true } };
      }

      const { data, error } = await client
        .from('users')
        .select('phone_verified')
        .eq('phone_number', phoneNumber)
        .single();

      if (error) throw error;

      return {
        success: true,
        data: { verified: data?.phone_verified || false }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }
};

export default phoneVerificationService;
