package com.ValenMDO.managerAeroclub.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VueloResponseDTO {
    public Long id;
    public String student;
    public String instructor;
    public String aircraft;
    public Double horasVuelo;
    public String tipoVuelo;
    public String fecha;
}
