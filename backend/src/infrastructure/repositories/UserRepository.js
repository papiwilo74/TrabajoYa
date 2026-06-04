import { supabase } from '../supabaseClient.js';

export class UserRepository {
  async save(user) {
    const { data, error } = await supabase
      .from('users')
      .insert([{
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  }

  async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) return null;
    return data;
  }
}
