/* eslint-disable @typescript-eslint/no-misused-promises */
import { Box, Typography, TextField, Button } from "@mui/material";
import { useState } from "react";
import "./DynamicForm.css";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

export type InputField = {
  name: string;
  text: string;
  type: string;
};

export type RequestInfoBlock = {
  text: string;
  type: RequestMethod;
  inputs: InputField[];
  path: string;
  byId: boolean;
};

type DynamicFormProps = {
  path: string;
  request: RequestInfoBlock;
};

const DynamicForm = ({ request, path }: DynamicFormProps) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [responce, setResponce] = useState<string>();

  const handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [name]: event.target.value,
    });
  };

  const handleSubmit = async () => {
    if (request.byId && !formData.id) {
      return;
    }

    const { id, ...formDataNew } = formData;

    try {
      // todo api
      const response = await fetch(path + request.path + (request.byId ? `/  ${id}` : ""), {
        method: request.type,
        headers: {
          "Content-Type": "application/json",
        },
        body: request.type != "GET" ? JSON.stringify(formDataNew) : undefined,
      });

      if (!response.ok) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        throw new Error(`Ошибка: ${response.status}`);
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await response.json();
      console.log("Ответ от сервера:", result);
      setResponce(JSON.stringify(result));
    } catch (error) {
      console.error("Ошибка при отправке данных:", error);
    }
  };

  return (
    <Box className="dynamic-form">
      <Box className="request-responce-header">
        <Typography variant="h6" gutterBottom className="request-header">
          {`${request.text} запрос`}
        </Typography>
        <Typography variant="h6" gutterBottom className="response-header">
          Response
        </Typography>
      </Box>
      <Box className="form-container">
        <Box className="form-section">
          {request.inputs.map((input) => (
            <TextField
              key={input.name}
              fullWidth
              label={input.text}
              variant="outlined"
              margin="normal"
              type={input.type}
              onChange={handleChange(input.name)}
            />
          ))}
          <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }}>
            Отправить
          </Button>
        </Box>
        <Box className="response-section">
          <pre>{JSON.stringify(responce, null, 2)}</pre>
        </Box>
      </Box>
    </Box>
  );
};

export default DynamicForm;
