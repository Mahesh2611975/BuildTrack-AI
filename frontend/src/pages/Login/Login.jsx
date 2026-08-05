import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    InputAdornment,
    IconButton,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ConstructionIcon from "@mui/icons-material/Construction";

import { login as loginService } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        try {
            const response = await loginService(username, password);

            login(response.access_token);

            navigate("/");
        } catch (error) {
            alert("Invalid username or password");
            console.error(error);
        }
    };

    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f5f7fb",
            }}
        >
            <Paper
                elevation={8}
                sx={{
                    width: 420,
                    p: 5,
                    borderRadius: 4,
                }}
            >
                <Box
                    sx={{
                        textAlign: "center",
                        mb: 4,
                    }}
                >
                    <ConstructionIcon
                        sx={{
                            fontSize: 55,
                            color: "primary.main",
                        }}
                    />

                    <Typography
                        variant="h4"
                        fontWeight="bold"
                    >
                        BuildTrack AI
                    </Typography>

                    <Typography color="text.secondary">
                        Construction ERP Login
                    </Typography>
                </Box>

                <TextField
                    fullWidth
                    label="Username"
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? (
                                        <VisibilityOff />
                                    ) : (
                                        <Visibility />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{
                        mt: 3,
                        borderRadius: 2,
                    }}
                    onClick={handleLogin}
                >
                    Login
                </Button>
            </Paper>
        </Box>
    );
}

export default Login;