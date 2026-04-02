package com.ValenMDO.managerAeroclub.controller;


import com.ValenMDO.managerAeroclub.dto.LoginRequest;
import com.ValenMDO.managerAeroclub.dto.PasswordDTO;
import com.ValenMDO.managerAeroclub.dto.UsuarioCreateDTO;
import com.ValenMDO.managerAeroclub.dto.UsuarioDTO;
import com.ValenMDO.managerAeroclub.model.Usuario;
import com.ValenMDO.managerAeroclub.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }


    /**
     * Crear usuario (ADMIN)
     * POST /api/usuarios
     */
    @PostMapping
    public UsuarioDTO create(@RequestBody UsuarioCreateDTO dto) {
        return usuarioService.create(dto);
    }


    /**
     * ADMIN: Bloquear usuario
     */
    @PutMapping("/{userId}/bloquear/{adminId}")
    public Usuario bloquearUsuario(@PathVariable Long userId, @PathVariable Long adminId) {
        return usuarioService.bloquearUsuario(userId, adminId);
    }

    @GetMapping("/test")
    public String test() {
        return "API OK";
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {
        return usuarioService.login(request);
    }


    /**
     * Obtener usuario actual
     * GET /api/usuarios/me
     */
    @GetMapping("/me")
    public Usuario perfil() {
        return usuarioService.getUsuarioActual();
    }

    /**
     * Cambiar contraseña del usuario actual
     * PUT /api/usuarios/me/password
     */
    @PutMapping("/me/password")
    public void cambiarPassword(@RequestBody PasswordDTO dto) {
        usuarioService.cambiarPassword(dto);
    }

    /**
     * Listar usuarios (solo ADMIN)
     * GET /api/usuarios
     */

    @GetMapping
    public List<Usuario> listarUsuarios() {
        return usuarioService.obtenerTodos();
    }

    /**
     * Eliminar usuario (opcional)
     */
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        usuarioService.eliminar(id);
    }
}
