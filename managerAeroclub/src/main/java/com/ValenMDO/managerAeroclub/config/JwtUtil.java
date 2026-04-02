package com.ValenMDO.managerAeroclub.config;

import com.ValenMDO.managerAeroclub.model.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    private static final String SECRET = "mi_clave_super_secreta_jwt_2026_aeroclubes";

    public String generarToken(Usuario usuario) {
        return Jwts.builder()
                .setSubject(usuario.getEmail())
                .claim("rol", usuario.getRol().name())
                .claim("id", usuario.getId())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 4)) // 4h
                .signWith(Keys.hmacShaKeyFor(SECRET.getBytes()), SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims obtenerClaims(String token) {
        // 1. Convertimos el String de la clave en una SecretKey real
        SecretKey key = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));

        // 2. Usamos el nuevo flujo del Parser
        return Jwts.parser()
                .verifyWith(key)             // En lugar de setSigningKey
                .build()
                .parseSignedClaims(token)    // En lugar de parseClaimsJws
                .getPayload();               // En lugar de getBody
    }
}
