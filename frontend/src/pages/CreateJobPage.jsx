import { useState } from 'react';

export const CreateJobPage = () => {
  // Aquí guardamos temporalmente lo que el usuario escribe
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'formal',
    location: '',
    salary: ''
  });

  // Función para actualizar los datos cuando escriben en un input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Función que se ejecuta al darle al botón "Publicar"
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Enviamos los datos al backend usando fetch
      const response = await fetch('http://localhost:3000/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Vacante guardada en el servidor:', data);
        alert(`¡Éxito! La vacante "${data.title}" ya está en el sistema.`);
        
        // Limpiamos el formulario después de guardar
        setFormData({ title: '', description: '', type: 'formal', location: '', salary: '' });
      } else {
        alert('Hubo un error al guardar la vacante.');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      alert('No se pudo conectar con el servidor backend.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', border: '1px solid #ccc' }}>
      <h2 style={{ marginTop: 0, color: '#2e7d32' }}>Publicar Nueva Vacante</h2>
      <p>Llena los detalles del empleo para atraer a los mejores candidatos.</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        
        <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <strong>Título del Empleo:</strong>
          <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Ej. Desarrollador Frontend" required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <strong>Ubicación:</strong>
          <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Ej. Barranquilla, Centro" required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <strong>Tipo de Contrato:</strong>
          <select name="type" value={formData.type} onChange={handleChange} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
            <option value="formal">Formal</option>
            <option value="informal">Informal</option>
          </select>
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <strong>Salario (Opcional):</strong>
          <input type="number" name="salary" value={formData.salary} onChange={handleChange} placeholder="Ej. 1500000" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <strong>Descripción:</strong>
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe las responsabilidades..." rows="4" required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical' }} />
        </label>

        <button type="submit" style={{ padding: '12px', backgroundColor: '#2e7d32', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
          Publicar Vacante
        </button>
      </form>
    </div>
  );
};