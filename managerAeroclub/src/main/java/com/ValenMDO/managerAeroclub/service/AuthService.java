package com.ValenMDO.managerAeroclub.service;


import com.ValenMDO.managerAeroclub.model.Usuario;
import com.ValenMDO.managerAeroclub.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    public Usuario login(String email, String password) {


        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Los passwords se guardan con BCrypt (en UsuarioService.create),
        // así que para validar hay que usar matches() contra el hash.
        // Incluimos fallback para passwords legados en texto plano por si
        // se cargaron usuarios antiguos manualmente.
        String storedPassword = usuario.getPassword();
        if (storedPassword == null || password == null) {
            throw new RuntimeException("Credenciales inválidas");
        }

        boolean ok = passwordEncoder.matches(password, storedPassword);
        if (!ok && storedPassword.equals(password)) {
            ok = true;
        }

        if (!ok) {
            throw new RuntimeException("Credenciales inválidas");
        }

        return usuario;
    }
}
