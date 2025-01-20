/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// src/components/CreatePostForm.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Autocomplete,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import { createFilterOptions } from "@mui/material/Autocomplete";

const autocompleteFilter = createFilterOptions();

const options = [
  { title: "Notícias" },
  { title: "Artigos" },
  { title: "Tutoriais" },
  { title: "Opinião" },
  { title: "Revisão/Review" },
  { title: "Análise" },
  { title: "Lista/Ranking" },
  { title: "Guia rápido" },
  { title: "Dicas" },
];

const CreatePostForm = ({ open, handleClose, onCreate }) => {
  const [newPost, setNewPost] = useState({
    titulo: "",
    tipo: "",
    conteudo: "",
  });
  const [base64Image, setBase64Image] = useState("");
  const [value, setValue] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result.split(",")[1];
        setBase64Image(base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    onCreate({
      ...newPost,
      tipo: value?.title || newPost.tipo,
      imagem: base64Image,
    });
    // Resetar o formulário
    setNewPost({ titulo: "", tipo: "", conteudo: "" });
    setBase64Image("");
    setValue(null);
  };

  return (
    <Dialog
      sx={{
        "& .MuiDialog-paper": {
          width: "80%",
          backgroundColor: "#262D34",
          color: "white",
          height: "70%",
          borderRadius: "16px",
        },
      }}
      open={open}
      onClose={handleClose} // Garante que o diálogo feche ao clicar fora ou pressionar "Esc"
    >
      <DialogTitle>Create a New Post</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Post Title"
          type="text"
          InputLabelProps={{ style: { color: "white" } }}
          InputProps={{
            style: { color: "white", borderColor: "white" },
          }}
          sx={{
            fontFamily: "Rubik, sans-serif",
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "white" },
              "&:hover fieldset": { borderColor: "#ff8c00" },
              "&.Mui-focused fieldset": { borderColor: "#ff8c00" },
            },
          }}
          fullWidth
          variant="outlined"
          value={newPost.titulo}
          onChange={(e) => setNewPost({ ...newPost, titulo: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Post Content"
          type="text"
          fullWidth
          multiline
          rows={4}
          InputLabelProps={{ style: { color: "white" } }}
          InputProps={{
            style: { color: "white", borderColor: "white" },
          }}
          sx={{
            fontFamily: "Rubik, sans-serif",
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "white" },
              "&:hover fieldset": { borderColor: "#ff8c00" },
              "&.Mui-focused fieldset": { borderColor: "#ff8c00" },
            },
          }}
          value={newPost.conteudo}
          onChange={(e) => setNewPost({ ...newPost, conteudo: e.target.value })}
          variant="outlined"
        />
        <Button
          sx={{
            mt: "10px",
            mb: "20px",
            textTransform: "none",
            padding: "10px 20px",
            display: "flex",
            alignItems: "center",
            backgroundColor: "#1976d2",
            color: "#ffffff",
            "&:hover": { backgroundColor: "#1565c0" },
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
          variant="contained"
          component="label"
        >
          <ImageIcon sx={{ mr: "8px" }} />
          Escolher Imagem
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
        </Button>
        <Autocomplete
          value={value}
          onChange={(event, newValue) => {
            if (typeof newValue === "string") {
              setValue({ title: newValue });
            } else if (newValue && newValue.inputValue) {
              setValue({ title: newValue.inputValue });
            } else {
              setValue(newValue);
            }
          }}
          filterOptions={(options, params) => {
            const filtered = autocompleteFilter(options, params);
            const { inputValue } = params;
            const isExisting = options.some(
              (option) => inputValue === option.title
            );
            if (inputValue !== "" && !isExisting) {
              filtered.push({
                inputValue,
                title: `Add "${inputValue}"`,
              });
            }
            return filtered;
          }}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          id="free-solo-with-text-demo"
          options={options}
          getOptionLabel={(option) => {
            if (typeof option === "string") return option;
            if (option.inputValue) return option.inputValue;
            return option.title;
          }}
          renderOption={(props, option) => {
            const { key, ...optionProps } = props;
            return (
              <li key={key} {...optionProps}>
                {option.title}
              </li>
            );
          }}
          sx={{ color: "white", width: 300 }}
          freeSolo
          renderInput={(params) => (
            <TextField
              {...params}
              label="Qual o conteúdo do post?"
              InputLabelProps={{ style: { color: "white" } }}
              InputProps={{
                ...params.InputProps,
                style: { color: "white" },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "white" },
                  "&:hover fieldset": { borderColor: "#ff8c00" },
                  "&.Mui-focused fieldset": {
                    borderColor: "#ff8c00",
                  },
                },
              }}
            />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Post
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePostForm;
