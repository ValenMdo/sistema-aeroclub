package com.ValenMDO.managerAeroclub.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VueloDTO {
    public Long studentId;
    public Long instructorId;
    public Long aircraftId;
    public Double horasVuelo;
    public String tipoVuelo;
    public String observaciones;
}
