package com.ValenMDO.managerAeroclub.dto;

import com.ValenMDO.managerAeroclub.model.Usuario;
import lombok.*;

@Getter @Setter
public class UsuarioDTO {
    public Long id;
    public String nombre;
    public String email;
    public String rol;
    public String password;

    public UsuarioDTO(Usuario usuario) {
        this.id = usuario.getId();
        this.nombre = usuario.getNombre();
        this.email = usuario.getEmail();
        this.rol = usuario.getRol() != null
                ? String.valueOf(usuario.getRol())
                : null;
    }

    public UsuarioDTO() {}
}
