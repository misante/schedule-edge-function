"use client";
import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const DocumentForm = () => {
  const router = useRouter();
  const [formValues, setFormValues] = useState({
    name: "",
    expiration_date: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (newDate) => {
    setFormValues({
      ...formValues,
      expiration_date: newDate,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/insert-document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Document added successfully!");
        toast.success("Document added successfully!", { duration: 5000 });
        setFormValues({
          name: "",
          expiration_date: null,
        });
        setMessage("");
        router.push("/");
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: "400px", margin: "auto", padding: "20px" }}
    >
      <Typography
        variant="h5"
        color="primary"
        font="bold"
        sx={{
          marginBottom: "32px",
          textAlign: "center",
          fontFamily: "serif",
          // backgroundColor: "red",
        }}
      >
        Add New Document
      </Typography>

      <TextField
        fullWidth
        label="Document Name"
        name="name"
        value={formValues.name}
        onChange={handleChange}
        required
        sx={{ marginBottom: "20px" }}
      />

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Expiration Date"
          value={formValues.expiration_date}
          onChange={handleDateChange}
          slots={{
            textField: (params) => <TextField {...params} fullWidth required />,
          }}
        />
      </LocalizationProvider>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ marginTop: "20px" }}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Document"}
      </Button>

      {message && (
        <Typography variant="body1" sx={{ marginTop: "20px", color: "green" }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default DocumentForm;
