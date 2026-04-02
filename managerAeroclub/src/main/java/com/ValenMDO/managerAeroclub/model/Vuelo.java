package com.ValenMDO.managerAeroclub.model;

import com.ValenMDO.managerAeroclub.enums.TiposDeVuelo;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Vuelo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate fecha;

    private Double horasVuelo;

    @Enumerated(EnumType.STRING)
    private TiposDeVuelo tipoVuelo;

    private String observaciones;

    @ManyToOne
    private Estudiante student;

    @ManyToOne
    private Usuario instructor;

    @ManyToOne
    private Avion avion;
}
