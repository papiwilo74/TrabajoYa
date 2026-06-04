// backend/src/infrastructure/repositories/JobRepository.js
import { supabase } from '../supabaseClient.js'; // ✓ corregido: era '../supabase/client.js'

export class JobRepository {

  async save(job) {
    const { data, error } = await supabase
      .from('jobs')
      .insert([{
        id:          job.id,
        employer_id: job.employerId,
        title:       job.title,
        description: job.description,
        type:        job.type,
        category:    job.category,
        location:    job.location,
        salary:      job.salary,
        status:      job.status,
        created_at:  job.createdAt,
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this._map(data);
  }

  async findAll() {
    const { data, error } = await supabase
      .from('jobs')
      .select('*, applications(id)')
      .eq('status', 'open')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(this._map);
  }

  async findById(id) {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return this._map(data);
  }

  async findByLocation(location) {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'open')
      .ilike('location', `%${location}%`)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(this._map);
  }

  async findByCategory(category) {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'open')
      .eq('category', category.toLowerCase())
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(this._map);
  }

  // Convierte snake_case de Supabase a camelCase para el resto del código
  _map(row) {
    return {
      id:          row.id,
      employerId:  row.employer_id,
      title:       row.title,
      description: row.description,
      type:        row.type,
      category:    row.category,
      location:    row.location,
      salary:      row.salary,
      status:      row.status,
      createdAt:   row.created_at,
      applicationsCount: row.applications ? row.applications.length : 0,
    };
  }
}