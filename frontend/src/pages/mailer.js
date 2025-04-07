import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import Layout from "../layouts/layout";

const Mailer = () => {
  // Mapping of events to their corresponding template image paths
  const eventToTemplatePath = {
    "Workshop on Replit AI": "REPLIT Workshop.png",
    "Workshop on GitHub": "GITHUB Workshop.png",
    UIXploit: "UIXploit.png",
    "Nerd Script 3.0": "NERDSCRIPT 3.0.png",
    "Bi0s CTF": "bi0s CTF.png",
    "Treasure Hunt": "Treasure Hunt.png",
    "Tech Survival: Squid Game Edition": "TECH SURVIVAL.png",
    "Web Hackathon": "Web Hackathon.png",
    TechinGO: "TechinGO.png",
    "FC 25 Tournament": "FC25 Tournament.png",
    "PES Tournament": "PES Tournament.png",
    Xonotic: "Xonotic.png",
    "Squid Game": "SQUID GAME 2025.png",
    Carroms: "Carroms.png",
    "BGMI TDM": "BGMI 2025.png",
    "Movie Madness": "Movie Madness.png",
  };

  // Possible values for Batch and Year dropdowns
  const batchOptions = [
    "BCA",
    "BCA (Data Science)",
    "BCA (HONOURS)",
    "Integrated MCA",
    "MCA",
    "BBA",
    "B.Com (Taxation & Finance)",
    "B.Com (Fintech)",
    "M.Com (Finance & Systems)",
    "B.Des (Communication Design)",
    "B.Sc (Visual Media)",
    "M.Sc (Applied Statistics and Data Analytics)",
    "BA-MA (English Language & Literature)",
    "M.Sc (Mathematics)",
    "MA (Journalism & Mass Communication)",
    "MA (Visual Media & Communication)",
    "MA (English Language & Literature)",
    "MFA (Applied Art & Advertising)",
    "MFA (Animation & VFX)",
    "Int Physics",
    "PhD Scholar",
  ];
  const yearOptions = ["2020", "2021", "2022", "2023", "2024", "2025"];

  const [formData, setFormData] = useState({
    email: "",
    use_image_url: false,
    template_image_url: "",
    template_image_path: "REPLIT Workshop.png", // Default value for the dropdown
    image_size: { width: 2000, height: 647 }, // Changed to integers
    qr_config: {
      size: 350, // Changed to integer
      offset: { x: 100, y: 200 }, // Changed to integers
      rotation: 0, // Changed to integer
    },
    ticket_details: {
      name: "",
      roll_no: "",
      event: "Workshop on Replit AI", // Default value for the dropdown
      batch: "BCA", // Default batch value
      year: "2020", // Default year value
      mobile: "",
      amount: "",
    },
    send_email: true, // Default to "checked"
    email_subject: `Your Ticket for Workshop on Replit AI`, // Default subject with the default event
    email_body: `<div style="max-width:600px; margin:auto; padding:20px; background-color:#000; border-radius:10px; text-align:center; color:#e0e0e0; font-family: 'Playfair Display', serif;">
      <h2 style="color:#b08c22; font-size:2.5rem; text-shadow: 2px 2px 6px #000;">Hello {{name}}</h2>
      <p style="font-size:1rem; line-height:1.6;">Thank you for registering for our event! Your ticket is now available and has been attached to this email.</p>
      <p style="font-size:1rem; line-height:1.6;">Please keep your ticket handy and present it at the registration desk on the day of the event.</p>
      <p style="font-size:1rem; line-height:1.6;">If you have any questions or need assistance, feel free to contact our support team anytime.</p>
      <a href="https://savishkaara.in" style="display:inline-block; padding:12px 24px; background-color:#f1c40f; color:#000; text-decoration:none; border-radius:6px; font-size:1rem; font-weight:bold;">Contact Support</a>
      <p style="font-size:0.85rem; color:#888; margin-top:24px;">Kind regards,<br><strong>Team SavishKaara</strong></p>
    </div>`,
    email_format: "html",
    mail_credentials: {
      email_user: "savishkaara.amrita@gmail.com", // Default value
      email_password: "kfbrayafnnqhilsz", // Default value
      sender_name: "SavishKaara Tech TEAM", // Default value
    },
    use_default_mail_settings: true, // Default to "checked"
    use_default_image_settings: true, // Default to "checked"
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    document.title = "Mailer";
  }, []);

  const apiBaseURL =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_PROD_API_URL || "https://testapi.amritaiedc.site"
      : process.env.REACT_APP_API_URL || "http://localhost:5000";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Handle checkbox inputs
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
      return;
    }
    // Handle nested objects (e.g., ticket_details, qr_config, image_size, mail_credentials)
    if (name.includes(".")) {
      const [parentKey, childKey] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parentKey]: { ...prev[parentKey], [childKey]: value },
      }));
      // If the event field changes, update the template_image_path and email_subject accordingly
      if (name === "ticket_details.event") {
        const newTemplatePath = eventToTemplatePath[value];
        const newEmailSubject = `Your Ticket for ${value}`;
        setFormData((prev) => ({
          ...prev,
          template_image_path: newTemplatePath,
          email_subject: newEmailSubject,
        }));
      }
      return;
    }
    // Handle normal fields
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert image-related values to integers before sending
      const sanitizedFormData = {
        ...formData,
        image_size: {
          width: parseInt(formData.image_size.width, 10),
          height: parseInt(formData.image_size.height, 10),
        },
        qr_config: {
          size: parseInt(formData.qr_config.size, 10),
          offset: {
            x: parseInt(formData.qr_config.offset.x, 10),
            y: parseInt(formData.qr_config.offset.y, 10),
          },
          rotation: parseInt(formData.qr_config.rotation, 10),
        },
      };
      const response = await fetch(`${apiBaseURL}/request_ticket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Allowed-Origin": "savishkaara.in",
        },
        credentials: "include",
        body: JSON.stringify(sanitizedFormData),
      });
      const data = await response.json();
      if (response.ok) {
        // Clear Ticket Details fields and email field on success
        setFormData((prev) => ({
          ...prev,
          email: "", // Clear the email field
          ticket_details: {
            name: "",
            roll_no: "",
            event: "Workshop on Replit AI", // Reset to default event
            batch: "BCA", // Reset to default batch
            year: "2020", // Reset to default year
            mobile: "",
            amount: "",
          },
        }));
        setMessage(`Email was sent successfully!`);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error generating ticket:", error);
      setMessage("An error occurred while generating the ticket.");
    }
  };

  return (
    <Layout title="Mailer" activePage="mailer">
      <Paper style={{ margin: "20px auto", padding: "20px", maxWidth: "1200px" }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Send Email
        </Typography>
        {message && (
          <Typography
            variant="body1"
            style={{
              marginBottom: "10px",
              color: message.startsWith("Email was sent successfully") ? "green" : "red",
            }}
          >
            {message}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Section 1: Mail Settings */}
            <Grid item xs={4}>
              <Paper elevation={3} style={{ padding: "20px" }}>
                <Typography variant="h6" gutterBottom>
                  Mail Settings
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="use_default_mail_settings"
                      checked={formData.use_default_mail_settings}
                      onChange={handleChange}
                    />
                  }
                  label="Use Default Mail Settings"
                />
                <TextField
                  name="mail_credentials.email_user"
                  label="Sender Email"
                  variant="outlined"
                  fullWidth
                  value={formData.mail_credentials.email_user}
                  onChange={handleChange}
                  disabled={formData.use_default_mail_settings}
                  required={!formData.use_default_mail_settings}
                  margin="normal"
                />
                <TextField
                  name="mail_credentials.email_password"
                  label="Sender Password"
                  variant="outlined"
                  fullWidth
                  value={formData.mail_credentials.email_password}
                  onChange={handleChange}
                  disabled={formData.use_default_mail_settings}
                  required={!formData.use_default_mail_settings}
                  margin="normal"
                />
                <TextField
                  name="mail_credentials.sender_name"
                  label="Sender Name"
                  variant="outlined"
                  fullWidth
                  value={formData.mail_credentials.sender_name}
                  onChange={handleChange}
                  disabled={formData.use_default_mail_settings}
                  required={!formData.use_default_mail_settings}
                  margin="normal"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="send_email"
                      checked={formData.send_email}
                      onChange={handleChange}
                      disabled={formData.use_default_mail_settings}
                      required={!formData.use_default_mail_settings}
                    />
                  }
                  label="Send Email"
                />
                {formData.send_email && (
                  <>
                    <TextField
                      name="email_subject"
                      label="Email Subject"
                      variant="outlined"
                      fullWidth
                      value={formData.email_subject}
                      onChange={handleChange}
                      disabled={formData.use_default_mail_settings}
                      required={!formData.use_default_mail_settings}
                      margin="normal"
                    />
                    <TextField
                      name="email_body"
                      label="Email Body"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={4}
                      value={formData.email_body}
                      onChange={handleChange}
                      disabled={formData.use_default_mail_settings}
                      required={!formData.use_default_mail_settings}
                      margin="normal"
                    />
                    <FormControl
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      disabled={formData.use_default_mail_settings}
                    >
                      <InputLabel id="email-format-label">Email Format</InputLabel>
                      <Select
                        labelId="email-format-label"
                        name="email_format"
                        value={formData.email_format}
                        onChange={handleChange}
                        label="Email Format"
                        disabled={formData.use_default_mail_settings}
                      >
                        <MenuItem value="plain">Plain Text</MenuItem>
                        <MenuItem value="html">HTML</MenuItem>
                      </Select>
                    </FormControl>
                  </>
                )}
              </Paper>
            </Grid>
            {/* Section 2: Image Settings */}
            <Grid item xs={4}>
              <Paper elevation={3} style={{ padding: "20px" }}>
                <Typography variant="h6" gutterBottom>
                  Image Settings
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="use_image_url"
                      checked={formData.use_image_url}
                      onChange={handleChange}
                    />
                  }
                  label="Use Image URL"
                />
                {formData.use_image_url ? (
                  <TextField
                    name="template_image_url"
                    label="Template Image URL"
                    variant="outlined"
                    fullWidth
                    value={formData.template_image_url}
                    onChange={handleChange}
                    required={formData.use_image_url}
                    margin="normal"
                  />
                ) : (
                  // Template Image Path Dropdown
                  <FormControl variant="outlined" fullWidth margin="normal">
                    <InputLabel id="template-image-path-label">Template Image Path</InputLabel>
                    <Select
                      labelId="template-image-path-label"
                      name="template_image_path"
                      value={formData.template_image_path}
                      onChange={handleChange}
                      label="Template Image Path"
                    >
                      {Object.entries(eventToTemplatePath).map(([event, path]) => (
                        <MenuItem key={path} value={path}>
                          {event}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
                {/* Use Default Checkbox */}
                <FormControlLabel
                  control={
                    <Checkbox
                      name="use_default_image_settings"
                      checked={formData.use_default_image_settings}
                      onChange={handleChange}
                    />
                  }
                  label="Use Default Image Settings"
                />
                {/* Image Size Fields */}
                <Typography variant="subtitle2" gutterBottom>
                  Image Size
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      name="image_size.width"
                      label="Width"
                      variant="outlined"
                      fullWidth
                      type="number" // Restrict input to numbers
                      inputProps={{ min: 0 }} // Ensure non-negative values
                      value={formData.image_size.width}
                      onChange={handleChange}
                      disabled={formData.use_default_image_settings}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      name="image_size.height"
                      label="Height"
                      variant="outlined"
                      fullWidth
                      type="number" // Restrict input to numbers
                      inputProps={{ min: 0 }} // Ensure non-negative values
                      value={formData.image_size.height}
                      onChange={handleChange}
                      disabled={formData.use_default_image_settings}
                      margin="normal"
                    />
                  </Grid>
                </Grid>
                {/* QR Code Configuration Fields */}
                <Typography variant="subtitle2" gutterBottom>
                  QR Code Configuration
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      name="qr_config.size"
                      label="QR Size (px)"
                      variant="outlined"
                      fullWidth
                      type="number" // Restrict input to numbers
                      inputProps={{ min: 0 }} // Ensure non-negative values
                      value={formData.qr_config.size}
                      onChange={handleChange}
                      disabled={formData.use_default_image_settings}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      name="qr_config.offset.x"
                      label="Offset X (px)"
                      variant="outlined"
                      fullWidth
                      type="number" // Restrict input to numbers
                      inputProps={{ min: 0 }} // Ensure non-negative values
                      value={formData.qr_config.offset.x}
                      onChange={handleChange}
                      disabled={formData.use_default_image_settings}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      name="qr_config.offset.y"
                      label="Offset Y (px)"
                      variant="outlined"
                      fullWidth
                      type="number" // Restrict input to numbers
                      inputProps={{ min: 0 }} // Ensure non-negative values
                      value={formData.qr_config.offset.y}
                      onChange={handleChange}
                      disabled={formData.use_default_image_settings}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="qr_config.rotation"
                      label="Rotation (degrees)"
                      variant="outlined"
                      fullWidth
                      type="number" // Restrict input to numbers
                      inputProps={{ min: 0 }} // Ensure non-negative values
                      value={formData.qr_config.rotation}
                      onChange={handleChange}
                      disabled={formData.use_default_image_settings}
                      margin="normal"
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            {/* Section 3: Ticket Details */}
            <Grid item xs={4}>
              <Paper elevation={3} style={{ padding: "20px" }}>
                <Typography variant="h6" gutterBottom>
                  Ticket Details
                </Typography>
                <TextField
                  name="email"
                  label="Recipient's Email"
                  variant="outlined"
                  fullWidth
                  value={formData.email}
                  onChange={handleChange}
                  required
                  margin="normal"
                />
                <TextField
                  name="ticket_details.name"
                  label="Name"
                  variant="outlined"
                  fullWidth
                  value={formData.ticket_details.name}
                  onChange={handleChange}
                  required
                  margin="normal"
                />
                <TextField
                  name="ticket_details.roll_no"
                  label="Register Number"
                  variant="outlined"
                  fullWidth
                  required
                  value={formData.ticket_details.roll_no}
                  onChange={handleChange}
                  margin="normal"
                />
                {/* Event Dropdown */}
                <FormControl variant="outlined" fullWidth margin="normal">
                  <InputLabel id="event-label">Event</InputLabel>
                  <Select
                    labelId="event-label"
                    name="ticket_details.event"
                    required
                    value={formData.ticket_details.event}
                    onChange={handleChange}
                    label="Event"
                  >
                    {Object.keys(eventToTemplatePath).map((event) => (
                      <MenuItem key={event} value={event}>
                        {event}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {/* End of Event Dropdown */}
                {/* Batch Dropdown */}
                <FormControl variant="outlined" fullWidth margin="normal">
                  <InputLabel id="batch-label">Batch</InputLabel>
                  <Select
                    labelId="batch-label"
                    name="ticket_details.batch"
                    value={formData.ticket_details.batch}
                    onChange={handleChange}
                    label="Batch"
                  >
                    {batchOptions.map((batch) => (
                      <MenuItem key={batch} value={batch}>
                        {batch}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {/* Year Dropdown */}
                <FormControl variant="outlined" fullWidth margin="normal">
                  <InputLabel id="year-label">Year</InputLabel>
                  <Select
                    labelId="year-label"
                    name="ticket_details.year"
                    value={formData.ticket_details.year}
                    onChange={handleChange}
                    label="Year"
                  >
                    {yearOptions.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  name="ticket_details.mobile"
                  label="Mobile"
                  variant="outlined"
                  fullWidth
                  required
                  value={formData.ticket_details.mobile}
                  onChange={handleChange}
                  margin="normal"
                />
                {/* Amount Field */}
                <TextField
                  name="ticket_details.amount"
                  label="Amount"
                  variant="outlined"
                  fullWidth
                  required
                  value={formData.ticket_details.amount}
                  onChange={handleChange}
                  margin="normal"
                  type="number" // Restrict input to numbers
                  inputProps={{ min: 0 }} // Ensure non-negative values
                />
              </Paper>
            </Grid>
            {/* Submit Button */}
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Send Email
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Layout>
  );
};

export default Mailer;