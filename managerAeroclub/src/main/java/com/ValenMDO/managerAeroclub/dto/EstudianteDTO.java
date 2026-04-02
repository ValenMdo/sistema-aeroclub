package com.ValenMDO.managerAeroclub.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EstudianteDTO {
    public Long id;
    public String nombre;
    public String apellido;
    public String email;
    public String telefono;
    public Double horasTotales;
    public String estado;
}
