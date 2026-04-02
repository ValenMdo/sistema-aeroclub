package com.ValenMDO.managerAeroclub.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MantenimientoDTO {
    public Long aircraftId;
    public String tipo;
    public String descripcion;
    public String fecha;
    public Double horasAvion;
}
