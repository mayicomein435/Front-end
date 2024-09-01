import React, { useState, useEffect } from 'react';
import './Tasks.css'; // Assuming you have a CSS file for styling

const Tasks = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    deadlines: '',
  });

  useEffect(() => {
    // Fetch projects
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/projects', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // JWT
          }
        });

        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        } else {
          setError('Failed to fetch projects');
        }
      } catch (error) {
        setError('An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const method = editingProject ? 'PUT' : 'POST';
      const url = editingProject ? `http://localhost:5000/api/projects/${editingProject._id}` : 'http://localhost:5000/api/projects';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // JWT
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(prevProjects => 
          editingProject
            ? prevProjects.map(project => (project._id === data._id ? data : project))
            : [...prevProjects, data]
        );
        setEditingProject(null);
        setForm({ title: '', description: '', category: '', deadlines: '' });
      } else {
        setError('Failed to save project');
      }
    } catch (error) {
      setError('An error occurred');
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setForm({
      title: project.title,
      description: project.description,
      category: project.category,
      deadlines: project.deadlines,
    });
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // JWT
        }
      });

      if (response.ok) {
        setProjects(prevProjects => prevProjects.filter(project => project._id !== id));
      } else {
        setError('Failed to delete project');
      }
    } catch (error) {
      setError('An error occurred');
    }
  };

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="tasks-container">
      <h2>Project List</h2>
      <form onSubmit={handleSubmit} className="project-form">
        <input
          type="text"
          name="title"
          placeholder="Project Title"
          value={form.title}
          onChange={handleInputChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="deadlines"
          placeholder="Deadline"
          value={form.deadlines}
          onChange={handleInputChange}
        />
        <button type="submit">{editingProject ? 'Update' : 'Create'} Project</button>
      </form>
      <table className="tasks-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Category</th>
            <th>Deadlines</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => (
            <tr key={project._id}>
              <td>{project.title}</td>
              <td>{project.description}</td>
              <td>{project.category}</td>
              <td>{project.deadlines}</td>
              <td>
                <button onClick={() => handleEdit(project)}>Edit</button>
                <button onClick={() => handleDelete(project._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Tasks;
