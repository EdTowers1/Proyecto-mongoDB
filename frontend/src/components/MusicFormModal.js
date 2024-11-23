import React, { useState } from 'react';
import { Box, Typography, Modal, TextField, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add'; // Importa el ícono desde el paquete correcto
import { toast, Toaster } from 'react-hot-toast';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

const MusicFormModal = ({ onSongAdded }) => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        artist: '',
        genre: '',
        releaseYear: '',
        image: '',
        audio: '',
    });

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // const handleFileChange = (e) => {
    //     setFormData((prevData) => ({
    //       ...prevData,
    //       image: e.target.files[0], // Guardar el archivo seleccionado
    //     }));
    //   };

    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
          const response = await fetch('http://localhost:3000/api/music/', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
          });
  
          if (response.ok) {
              const data = await response.json();
              console.log('Music added:', data);
  
              // Mostrar notificación de éxito
              toast.success('cancion añadida con Exito!');
  
              onSongAdded(); // Actualiza la lista de canciones
              handleClose(); // Cierra el modal
          } else {
              console.error('Error adding music:', response.statusText);
  
              // Mostrar notificación de error
              toast.error(`Failed to add music: ${response.statusText}`);
          }
      } catch (error) {
          console.error('Error:', error);
  
          // Mostrar notificación de error genérico
          toast.error('An unexpected error occurred.');
      }
  };

    return (
        <div>
        {/* Botón con ícono de + */}
        <IconButton
          onClick={handleOpen}
          sx={{
            color: 'black',
            bgcolor: 'transparent',
            border: '2px solid black',
            '&:hover': {
              color: 'white',
              bgcolor: 'black',
              border: '2px solid white',
            },
            borderRadius: '50%',
            transition: 'all 0.3s ease',
          }}
        >
          <AddIcon />
        </IconButton>
  
        {/* Modal */}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add New Music
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Artist"
                name="artist"
                value={formData.artist}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Release Year"
                name="releaseYear"
                value={formData.releaseYear}
                onChange={handleChange}
                type="number"
                fullWidth
                margin="normal"
              />
              <TextField
                label="audio"
                name="audio"
                value={formData.audio}
                onChange={handleChange}
                type="text"
                fullWidth
                margin="normal"
              />
              <label style={{ display: 'block', margin: '16px 0 8px' }}>
              Upload Image:
            </label>
            <TextField
                label="Imagen"
                name="image"
                value={formData.image}
                onChange={handleChange}
                type="text"
                fullWidth
                margin="normal"
              />
              <button
                type="submit"
                style={{
                  marginTop: '16px',
                  padding: '10px 20px',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '4px',
                }}
              >
                Add Music
              </button>
            </form>
          </Box>
        </Modal>
        <Toaster />
      </div>
    );
};

export default MusicFormModal;
