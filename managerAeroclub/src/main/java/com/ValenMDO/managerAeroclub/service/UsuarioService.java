package com.ValenMDO.managerAeroclub.service;

import com.ValenMDO.managerAeroclub.config.JwtUtil;
import com.ValenMDO.managerAeroclub.dto.LoginRequest;
import com.ValenMDO.managerAeroclub.dto.PasswordDTO;
import com.ValenMDO.managerAeroclub.dto.UsuarioCreateDTO;
import com.ValenMDO.managerAeroclub.dto.UsuarioDTO;
import com.ValenMDO.managerAeroclub.enums.RolesUsarios;
import com.ValenMDO.managerAeroclub.model.Usuario;
import com.ValenMDO.managerAeroclub.repository.UsuarioRepository;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;


@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private HttpServletRequest request;

    @Autowired
    private PasswordEncoder passwordEncoder;


    public UsuarioService(UsuarioRepository usuarioRepository,
                          JwtUtil jwtUtil,
                          HttpServletRequest request,
                          PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.jwtUtil = jwtUtil;
        this.request = request;
        this.passwordEncoder = passwordEncoder;
    }


    // -------------------------------
    // GET /users/me
    // -------------------------------

    @GetMapping("/users/me")
    public Usuario getUsuarioActual() {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Token no presente");
        }

        String token = authHeader.substring(7);

        Claims claims = jwtUtil.obtenerClaims(token);

        Long userId = claims.get("id", Long.class);

        return usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    // -------------------------------
    // PUT /users/change-password
    // -------------------------------

    public void cambiarPassword(PasswordDTO dto) {

        Usuario usuario = usuarioRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!usuario.getPassword().equals(dto.getPasswordActual())) {
            throw new RuntimeException("La contraseña actual es incorrecta");
        }

        usuario.setPassword(dto.getPasswordNueva());
        usuarioRepository.save(usuario);
    }

    // -------------------------------
    // GET /users
    // -------------------------------

    public List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }


    /**
     * Login real con JWT
     */
    public String login(LoginRequest request) {

        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            throw new RuntimeException("Credenciales inválidas");
        }

        return jwtUtil.generarToken(usuario);
    }

    public List<Usuario> getAll() {
        return usuarioRepository.findAll();
    }

    /**
     * Crear usuario
     */

    public UsuarioDTO create(UsuarioCreateDTO dto) {

        Usuario user = new Usuario();

        user.setNombre(dto.getNombre());
        user.setEmail(dto.getEmail());

        // 🔐 encriptar password
        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        user.setRol(RolesUsarios.INSTRUCTOR); // opcional default

        Usuario guardado = usuarioRepository.save(user);

        return new UsuarioDTO(guardado); // usás tu constructor actual
    }

    /**
     * Eliminar usuario
     */
    public void eliminar(Long id) {

        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado");
        }

        usuarioRepository.deleteById(id);
    }

    /*
    Listar usuarios por rol
     */
    public List<Usuario> obtenerPorRol(RolesUsarios rol) {
        return usuarioRepository.findByRol(rol);
    }


    /**
     * Bloquear usuario
     */
    public Usuario bloquearUsuario(Long userId, Long adminId) {
        Usuario admin = usuarioRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Administrador no encontrado"));

        if (admin.getRol() != RolesUsarios.ADMIN) {
            throw new RuntimeException("Solo los administradores pueden bloquear usuarios");
        }

        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setBloqueado(true);
        return usuarioRepository.save(usuario);
    }

    /**
     * Desbloquear usuario
     */
    public Usuario desbloquearUsuario(Long userId, Long adminId) {
        Usuario admin = usuarioRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Administrador no encontrado"));

        if (admin.getRol() != RolesUsarios.ADMIN) {
            throw new RuntimeException("Solo los administradores pueden desbloquear usuarios");
        }

        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setBloqueado(false);

        return usuarioRepository.save(usuario);
    }


}
