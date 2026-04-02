package com.ValenMDO.managerAeroclub.dto;

import lombok.*;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AvionDTO {
    public Long id;
    public String matricula;
    public String modelo;
    public Double horasTotales;
    public String estado;
}
