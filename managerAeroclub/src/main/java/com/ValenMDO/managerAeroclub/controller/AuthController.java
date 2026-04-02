package com.ValenMDO.managerAeroclub.controller;

import com.ValenMDO.managerAeroclub.config.JwtUtil;
import com.ValenMDO.managerAeroclub.dto.LoginRequest;
import com.ValenMDO.managerAeroclub.dto.LoginResponse;
import com.ValenMDO.managerAeroclub.dto.UsuarioDTO;
import com.ValenMDO.managerAeroclub.model.Usuario;
import com.ValenMDO.managerAeroclub.service.AuthService;
import com.ValenMDO.managerAeroclub.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioService usuarioService;

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        /*
        Usuario usuario = authService.login(
                request.getEmail(),
                request.getPassword()
        );

        return new UsuarioDTO(usuario);
         */

        Usuario usuario = authService.login(
                request.getEmail(),
                request.getPassword()
        );

        String token = jwtUtil.generarToken(usuario);

        return new LoginResponse(token, new UsuarioDTO(usuario));

    }

    @PostMapping("/logout")
    public void logout() {
        // placeholder
    }
}
