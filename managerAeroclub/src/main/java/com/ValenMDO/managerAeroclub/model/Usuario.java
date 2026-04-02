package com.ValenMDO.managerAeroclub.model;

import com.ValenMDO.managerAeroclub.enums.RolesUsarios;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String email;
    private String password;
    private boolean bloqueado;
    @Enumerated(EnumType.STRING)
    private RolesUsarios rol;

}
