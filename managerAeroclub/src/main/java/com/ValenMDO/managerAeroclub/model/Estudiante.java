package com.ValenMDO.managerAeroclub.model;

import com.ValenMDO.managerAeroclub.enums.EstadosEstudiante;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Estudiante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String apellido;
    private String email;
    private String telefono;

    private Double horasTotales;

    @Enumerated(EnumType.STRING)
    private EstadosEstudiante estado;
}
