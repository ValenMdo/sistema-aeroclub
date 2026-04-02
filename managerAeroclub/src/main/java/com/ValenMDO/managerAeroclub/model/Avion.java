package com.ValenMDO.managerAeroclub.model;


import com.ValenMDO.managerAeroclub.enums.EstadosAviones;
import jakarta.persistence.*;
import lombok.*;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Avion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String matricula;
    private String modelo;

    private Double horasTotales;

    @Enumerated(EnumType.STRING)
    private EstadosAviones estado;
}
